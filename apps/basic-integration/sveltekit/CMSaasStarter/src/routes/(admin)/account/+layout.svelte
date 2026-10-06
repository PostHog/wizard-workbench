<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: { id: string; email?: string }) {
    if (posthog.get_distinct_id() !== user.id) {
      posthog.identify(user.id, user.email ? { email: user.email } : undefined)
    }
  }

  onMount(() => {
    if (data.user?.id) {
      identifyUser(data.user)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authListener.subscription.unsubscribe()
  })
</script>

{@render children?.()}
