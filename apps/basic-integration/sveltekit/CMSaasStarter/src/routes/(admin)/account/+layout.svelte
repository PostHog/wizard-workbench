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

  // Identify the user on every page load if they are already logged in
  $effect(() => {
    if (browser && session?.user?.id) {
      posthog.identify(session.user.id)
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
