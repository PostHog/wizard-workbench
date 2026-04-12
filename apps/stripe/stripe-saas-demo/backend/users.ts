export interface User {
  id: string;
  email: string;
  name: string;
  stripeCustomerId?: string;
  posthogDistinctId?: string;
}

// Simple in-memory user store
const users = new Map<string, User>();

export function createUser(email: string, name: string, posthogDistinctId?: string): User {
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user: User = { id, email, name, posthogDistinctId };
  users.set(id, user);
  return user;
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return undefined;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const user = users.get(id);
  if (!user) return undefined;
  Object.assign(user, updates);
  return user;
}
