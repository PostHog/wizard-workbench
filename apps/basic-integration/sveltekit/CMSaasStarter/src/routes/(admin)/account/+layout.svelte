<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    // This layout only renders after the authenticated session has been validated.
    void import("posthog-js").then(({ default: posthog }) => {
      if (posthog.__loaded) {
        posthog.identify(data.user.id, {
          email: data.user.email,
        })
      }
    })

    const { data: authStateChangeData } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (_session?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authStateChangeData.subscription.unsubscribe()
  })
</script>

{@render children?.()}
