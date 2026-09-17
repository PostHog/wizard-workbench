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
    if (data.user) {
      posthog.identify(data.user.id, {
        email: data.user.email,
        name: data.profile?.full_name,
        company_name: data.profile?.company_name,
      })
    }

    const { data: authStateChange } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (_session?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authStateChange.subscription.unsubscribe()
  })
</script>

{@render children?.()}
