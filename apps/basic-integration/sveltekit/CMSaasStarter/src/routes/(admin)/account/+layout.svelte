<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  onMount(() => {
    if (user) {
      posthog.identify(user.id, user.email ? { email: user.email } : {})
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN" && _session?.user) {
        if (user && user.id !== _session.user.id) {
          posthog.reset()
        }

        posthog.identify(
          _session.user.id,
          _session.user.email ? { email: _session.user.email } : {},
        )
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
