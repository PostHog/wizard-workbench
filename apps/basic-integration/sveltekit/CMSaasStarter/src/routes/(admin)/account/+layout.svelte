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
    if (data.user?.id) {
      posthog.identify(data.user.id, {
        email: data.user.email,
      })
    }

    const { data: authState } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_IN" && nextSession?.user.id) {
        posthog.identify(nextSession.user.id, {
          email: nextSession.user.email,
        })
      }

      if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (nextSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authState.subscription.unsubscribe()
  })
</script>

{@render children?.()}
