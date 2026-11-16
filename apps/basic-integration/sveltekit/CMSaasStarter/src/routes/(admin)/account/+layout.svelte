<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    // Re-establish the persisted identity after a full page refresh.
    if (session?.user && posthog.get_distinct_id() !== session.user.id) {
      const properties = session.user.email
        ? { email: session.user.email }
        : undefined
      posthog.identify(session.user.id, properties)
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
