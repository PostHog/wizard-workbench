export type User = {
  id: number;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
};
