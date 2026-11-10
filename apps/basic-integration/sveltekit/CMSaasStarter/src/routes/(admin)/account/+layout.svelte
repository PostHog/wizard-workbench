<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(authSession: typeof session | null) {
    if (!authSession?.user.id) return

    posthog.identify(
      authSession.user.id,
      authSession.user.email ? { email: authSession.user.email } : undefined,
    )
  }

  onMount(() => {
    identifyUser(session)

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN") {
        if (session?.user.id && session.user.id !== authSession?.user.id) {
          posthog.reset()
        }
        identifyUser(authSession)
      } else if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
