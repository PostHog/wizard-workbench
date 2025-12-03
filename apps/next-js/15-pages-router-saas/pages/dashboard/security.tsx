import { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { verifyToken } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <section className="flex-1 p-4 lg:p-8">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
          Security Settings
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Password & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage your password and security settings here.</p>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      }
    };
  }

  try {
    await verifyToken(sessionCookie);
  } catch (error) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
