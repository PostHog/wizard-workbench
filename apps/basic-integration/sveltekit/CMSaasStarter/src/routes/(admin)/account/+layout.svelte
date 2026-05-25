<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"
  import { browser } from "$app/environment"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  $effect(() => {
    if (browser && session?.user) {
      posthog.identify(session.user.id, { email: session.user.email })
    }
  })

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
