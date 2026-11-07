<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"
  import { posthogIsInitialized } from "../../../hooks.client"

  type AnalyticsUser = {
    id: string
    email?: string
    user_metadata: Record<string, unknown>
  }

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  function identifyUser(analyticsUser: AnalyticsUser) {
    if (!posthogIsInitialized()) return

    const fullName = analyticsUser.user_metadata.full_name
    posthog.identify(analyticsUser.id, {
      ...(analyticsUser.email ? { email: analyticsUser.email } : {}),
      ...(typeof fullName === "string" ? { name: fullName } : {}),
    })
  }

  onMount(() => {
    // The account layout only renders for an authenticated user, including after a page refresh.
    identifyUser(user)

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (
        event === "SIGNED_IN" &&
        authSession &&
        authSession.user.id !== user.id
      ) {
        if (posthogIsInitialized()) {
          posthog.reset()
        }
        identifyUser(authSession.user)
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
