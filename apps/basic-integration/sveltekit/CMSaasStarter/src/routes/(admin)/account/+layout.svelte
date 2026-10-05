<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(data.user.id, {
        email: data.user.email,
        name: data.profile?.full_name ?? undefined,
      })
    })

    const { data: authState } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authState.subscription.unsubscribe()
  })
</script>

{@render children?.()}
