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
    // Identify user on page load if already logged in
    if (data.user) {
      posthog.identify(data.user.id, { email: data.user.email })
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (_session?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authListener.subscription.unsubscribe()
  })
</script>

{@render children?.()}
