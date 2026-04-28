import { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { verifyToken } from '@/lib/auth/session';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';
import { useState, useTransition } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GeneralPage() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string
    };

    startTransition(async () => {
      try {
        const response = await fetch('/api/account/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'An error occurred');
          return;
        }

        setSuccess(result.success);
        setName(result.name);
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      }
    });
  }

  return (
    <DashboardLayout>
      <section className="flex-1 p-4 lg:p-8">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
          General Settings
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  defaultValue={name || user?.name || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue={user?.email || ''}
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
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
