// Client-side signout helper for Pages Router
// The actual session deletion happens via API route

export async function signOut() {
  // In Pages Router, we handle signout client-side by calling an API route
  // or using router.push after cookie deletion
  // This is a placeholder that gets called from the header component
  return Promise.resolve();
}
