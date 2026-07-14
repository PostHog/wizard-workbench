import type { User } from "@supabase/supabase-js"

export function getDistinctId(user: User) {
  return user.id
}

export function getPersonProperties(
  user: User,
  profile?: { full_name?: string | null; company_name?: string | null } | null,
) {
  return {
    email: user.email ?? undefined,
    full_name: profile?.full_name ?? undefined,
    company_name: profile?.company_name ?? undefined,
  }
}
