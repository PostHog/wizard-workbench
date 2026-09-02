import { GetServerSideProps } from 'next';
import { Login } from '@/components/login';
import { verifyToken } from '@/lib/auth/session';

interface SignInPageProps {
  redirect?: string | null;
  priceId?: string | null;
}

export default function SignInPage({ redirect, priceId }: SignInPageProps) {
  return (
    <Login
      mode="signin"
      redirect={redirect}
      priceId={priceId}
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
      // Invalid session, continue to login page
    }
  }

  const redirect = query.redirect as string | undefined;
  const priceId = query.priceId as string | undefined;

  return {
    props: {
      redirect: redirect || null,
      priceId: priceId || null
    }
  };
};
