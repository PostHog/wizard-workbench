import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import type { NextApiResponse } from 'next';
import { NewUser } from '@/lib/db/schema';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

export type SessionData = {
  user: { id: number };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

// Pages Router compatible - accepts cookie value directly
export async function getSession(sessionCookieValue?: string) {
  if (!sessionCookieValue) return null;
  return await verifyToken(sessionCookieValue);
}

// Pages Router compatible - sets cookie via NextApiResponse
export async function setSession(user: NewUser, res?: NextApiResponse) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);

  if (res) {
    // For API routes
    res.setHeader('Set-Cookie', `session=${encryptedSession}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expiresInOneDay.toUTCString()}`);
  }

  return encryptedSession;
}
