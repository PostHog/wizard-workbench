import { getUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getUser();

  if (!user) {
    return Response.json(null);
  }

  return Response.json({
    ...user,
    email: user.email,
    name: user.name,
    role: user.role
  });
}
