<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { posthog } from "../../../hooks.client"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  function identifyUser() {
    if (!user?.id) return

    posthog?.identify(user.id, {
      email: user.email,
      name: user.user_metadata.full_name,
    })
  }

  onMount(() => {
    identifyUser()

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        identifyUser()
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
