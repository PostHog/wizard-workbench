<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    let identifiedUserId: string | null = null

    const identifyUser = (user: { id: string; email?: string | null }) => {
      if (identifiedUserId && identifiedUserId !== user.id) {
        posthog.reset()
      }

      posthog.identify(user.id, user.email ? { email: user.email } : undefined)
      identifiedUserId = user.id
    }

    if (data.user?.id) {
      identifyUser(data.user)
    }

    const { data: authState } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_OUT") {
        posthog.capture("user_signed_out")
        posthog.reset()
        identifiedUserId = null
      } else if (event === "SIGNED_IN" && nextSession?.user.id) {
        identifyUser(nextSession.user)
      }

      if (nextSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authState.subscription.unsubscribe()
  })
</script>

{@render children?.()}
