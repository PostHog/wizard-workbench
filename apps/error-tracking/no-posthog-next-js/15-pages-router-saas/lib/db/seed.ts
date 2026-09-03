import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers } from './schema';
import { hashPassword } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  // Check if user already exists
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let user;
  if (existingUsers.length > 0) {
    console.log('User already exists, skipping user creation.');
    user = existingUsers[0];
  } else {
    const [newUser] = await db
      .insert(users)
      .values([
        {
          email: email,
          passwordHash: passwordHash,
          role: "owner",
        },
      ])
      .returning();
    user = newUser;
    console.log('Initial user created.');
  }

  // Check if team already exists for this user
  const existingTeamMembers = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, user.id))
    .limit(1);

  let team;
  if (existingTeamMembers.length > 0) {
    console.log('Team membership already exists, skipping team creation.');
    const existingTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.id, existingTeamMembers[0].teamId))
      .limit(1);
    team = existingTeams[0];
  } else {
    const [newTeam] = await db
      .insert(teams)
      .values({
        name: 'Test Team',
      })
      .returning();
    team = newTeam;

    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: user.id,
      role: 'owner',
    });
    console.log('Team and team membership created.');
  }

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
