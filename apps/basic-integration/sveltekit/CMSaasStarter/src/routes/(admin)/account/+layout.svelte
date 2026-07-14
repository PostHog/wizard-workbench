<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import { identifyUser, resetUser } from "$lib/posthog"

  let { data, children } = $props()

  let { supabase, session, user, profile } = $state(data)
  $effect(() => {
    ;({ supabase, session, user, profile } = data)
  })

  $effect(() => {
    if (session && user) {
      identifyUser({
        id: user.id,
        email: user.email,
        full_name: profile?.full_name,
        company_name: profile?.company_name,
      })
    } else {
      resetUser()
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
