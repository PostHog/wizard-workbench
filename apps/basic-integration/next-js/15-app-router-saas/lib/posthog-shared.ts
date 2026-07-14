export function getDistinctIdForUser(user: {
  id: number;
  email: string;
}) {
  return `user:${user.id}`;
}
