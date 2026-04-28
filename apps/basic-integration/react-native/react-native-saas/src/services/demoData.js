// Demo data for testing without a backend API
// Login with: demo@test.com / demo

export const DEMO_TOKEN = 'demo-token-12345';

export const demoTeams = [
  { id: 1, name: 'Acme Corp', slug: 'acme-corp' },
  { id: 2, name: 'Startup Inc', slug: 'startup-inc' },
  { id: 3, name: 'Personal', slug: 'personal' },
];

export const demoProjects = {
  'acme-corp': [
    { id: 1, title: 'Website Redesign' },
    { id: 2, title: 'Mobile App' },
    { id: 3, title: 'API Integration' },
  ],
  'startup-inc': [
    { id: 4, title: 'MVP Launch' },
    { id: 5, title: 'User Research' },
  ],
  'personal': [
    { id: 6, title: 'Side Project' },
  ],
};

export const demoMembers = {
  'acme-corp': [
    { id: 1, user: { name: 'John Doe', email: 'john@acme.com' }, roles: [{ id: 1, name: 'Admin' }] },
    { id: 2, user: { name: 'Jane Smith', email: 'jane@acme.com' }, roles: [{ id: 2, name: 'Developer' }] },
    { id: 3, user: { name: 'Bob Wilson', email: 'bob@acme.com' }, roles: [{ id: 2, name: 'Developer' }] },
  ],
  'startup-inc': [
    { id: 4, user: { name: 'Alice Brown', email: 'alice@startup.com' }, roles: [{ id: 1, name: 'Admin' }] },
    { id: 5, user: { name: 'Charlie Davis', email: 'charlie@startup.com' }, roles: [{ id: 3, name: 'Viewer' }] },
  ],
  'personal': [
    { id: 6, user: { name: 'Demo User', email: 'demo@test.com' }, roles: [{ id: 1, name: 'Admin' }] },
  ],
};

export const demoPermissions = {
  roles: ['administrator', 'developer', 'viewer'],
  permissions: ['projects_create', 'projects_edit', 'invites_create', 'members_edit'],
};

export function isDemoMode(token) {
  return token === DEMO_TOKEN;
}
