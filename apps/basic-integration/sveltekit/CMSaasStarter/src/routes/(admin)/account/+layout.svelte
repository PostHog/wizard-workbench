<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import { initPostHog, posthog } from "$lib/posthog"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    if (data.posthogConfigured) {
      initPostHog()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (currentSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }

      if (event === "SIGNED_OUT") {
        posthog.capture("auth_signed_out")
        posthog.reset()
      }
    })

    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email,
      })
    }

    return () => subscription.unsubscribe()
  })
</script>

{@render children?.()}
