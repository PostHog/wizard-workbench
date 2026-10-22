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
      posthog.identify(
        data.user.id,
        data.user.email ? { email: data.user.email } : {},
      )
    }

    const { data: authState } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN" && _session?.user.id) {
        posthog.identify(
          _session.user.id,
          _session.user.email ? { email: _session.user.email } : {},
        )
      }

      if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authState.subscription.unsubscribe()
  })
</script>

{@render children?.()}
