import { GetServerSideProps } from 'next';
import { Login } from '@/components/login';
import { verifyToken } from '@/lib/auth/session';

interface SignUpPageProps {
  redirect?: string | null;
  priceId?: string | null;
  inviteId?: string | null;
}

export default function SignUpPage({
  redirect,
  priceId,
  inviteId
}: SignUpPageProps) {
  return (
    <Login
      mode="signup"
      redirect={redirect}
      priceId={priceId}
      inviteId={inviteId}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query } = context;
  const sessionCookie = req.cookies.session;

  // If already signed in, redirect to dashboard
  if (sessionCookie) {
    try {
      await verifyToken(sessionCookie);
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      };
    } catch (error) {
      // Invalid session, continue to signup page
    }
  }

  const redirect = query.redirect as string | undefined;
  const priceId = query.priceId as string | undefined;
  const inviteId = query.inviteId as string | undefined;

  return {
    props: {
      redirect: redirect || null,
      priceId: priceId || null,
      inviteId: inviteId || null
    }
  };
};
