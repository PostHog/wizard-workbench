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
    if (session?.user) {
      posthog.identify(session.user.id, { email: session.user.email })
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
