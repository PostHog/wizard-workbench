<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()
  let identifiedUserId: string | null = null

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: { id: string; email?: string }) {
    if (identifiedUserId && identifiedUserId !== user.id) {
      posthog.reset()
    }

    posthog.identify(user.id, user.email ? { email: user.email } : undefined)
    identifiedUserId = user.id
  }

  onMount(() => {
    if (data.user?.id) {
      identifyUser(data.user)
    }

    const { data: authSubscription } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN" && authSession?.user) {
        identifyUser(authSession.user)
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authSubscription.subscription.unsubscribe()
  })
</script>

{@render children?.()}
