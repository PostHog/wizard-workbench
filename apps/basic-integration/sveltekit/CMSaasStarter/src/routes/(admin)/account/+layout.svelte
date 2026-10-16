<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { env } from "$env/dynamic/public"
  import { onMount } from "svelte"
  import type { User } from "@supabase/supabase-js"
  import posthog from "posthog-js"

  let { data, children } = $props()

  let { supabase, session, user, profile } = $state(data)
  let identifiedUserId = $state<string | null>(null)

  const posthogConfigured = Boolean(
    env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST,
  )

  function identifyUser(currentUser: User | null, currentProfile = profile) {
    if (
      !posthogConfigured ||
      !currentUser?.id ||
      currentUser.id === identifiedUserId
    ) {
      return
    }

    if (identifiedUserId) {
      posthog.reset()
    }

    posthog.identify(currentUser.id, {
      ...(currentUser.email ? { email: currentUser.email } : {}),
      ...(currentProfile?.full_name ? { name: currentProfile.full_name } : {}),
    })
    identifiedUserId = currentUser.id
  }

  $effect(() => {
    ;({ supabase, session, user, profile } = data)
    identifyUser(user)
  })

  onMount(() => {
    identifyUser(user)

    const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === "SIGNED_IN") {
        identifyUser(currentSession?.user ?? null)
      }

      if (currentSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
