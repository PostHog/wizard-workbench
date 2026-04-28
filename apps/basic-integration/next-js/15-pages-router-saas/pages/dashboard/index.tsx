import { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { User, TeamDataWithMembers } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth/session';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, PlusCircle } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { useState, useTransition } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);

  async function handleManageSubscription() {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Failed to open customer portal');
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                Current Plan: {teamData?.planName || 'Free'}
              </p>
              <p className="text-sm text-muted-foreground">
                {teamData?.subscriptionStatus === 'active'
                  ? 'Billed monthly'
                  : teamData?.subscriptionStatus === 'trialing'
                  ? 'Trial period'
                  : 'No active subscription'}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleManageSubscription}>
              Manage Subscription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  async function handleRemoveMember(memberId: number) {
    setError('');

    startTransition(async () => {
      try {
        const response = await fetch('/api/team/remove-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ memberId })
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to remove member');
          return;
        }

        // Refresh team data
        mutate('/api/team');
      } catch (err) {
        setError('An unexpected error occurred');
      }
    });
  }

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team members yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {getUserDisplayName(member.user)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member.role}
                  </p>
                </div>
              </div>
              {index > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleRemoveMember(member.id)}
                >
                  {isPending ? 'Removing...' : 'Remove'}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMember() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const isOwner = user?.role === 'owner';
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      role: formData.get('role') as 'member' | 'owner'
    };

    startTransition(async () => {
      try {
        const response = await fetch('/api/team/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to send invitation');
          return;
        }

        setSuccess(result.success);
        // Reset form
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        setError('An unexpected error occurred');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
              disabled={!isOwner}
            />
          </div>
          <div>
            <Label>Role</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-green-500">{success}</p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isPending || !isOwner}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section className="flex-1 p-4 lg:p-8">
        <h1 className="text-lg lg:text-2xl font-medium mb-6">Team Settings</h1>
        <ManageSubscription />
        <TeamMembers />
        <InviteTeamMember />
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

  const user = await getUser(sessionCookie);
  const team = user ? await getTeamForUser(sessionCookie) : null;

  return {
    props: {
      fallback: {
        '/api/user': user ? JSON.parse(JSON.stringify(user)) : null,
        '/api/team': team ? JSON.parse(JSON.stringify(team)) : null
      }
    }
  };
};
