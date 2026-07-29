<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: { id: string; email?: string | null }) {
    posthog.identify(user.id, {
      email: user.email,
    })
  }

  onMount(() => {
    // Identifies returning users once after the browser-side PostHog client has initialized.
    if (session?.user?.id) {
      identifyUser(session.user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_IN" && nextSession?.user?.id) {
        if (session?.user?.id && session.user.id !== nextSession.user.id) {
          posthog.reset()
        }
        identifyUser(nextSession.user)
      }

      if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (nextSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
