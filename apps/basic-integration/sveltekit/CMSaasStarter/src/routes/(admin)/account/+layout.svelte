<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: { id: string; email?: string }) {
    const identifiedUserId = posthog.get_property("$user_id")
    if (identifiedUserId && identifiedUserId !== user.id) {
      posthog.reset()
    }

    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
    })
  }

  onMount(() => {
    if (session?.user) {
      identifyUser(session.user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN" && authSession?.user) {
        identifyUser(authSession.user)
      }

      if (event === "SIGNED_OUT") {
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
