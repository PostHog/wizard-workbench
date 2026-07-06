<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import { getPostHog, initPostHog } from "$lib/posthog"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    initPostHog()

    if (session?.user?.id) {
      getPostHog().identify(session.user.id, {
        email: session.user.email,
      })
      getPostHog().capture("user_signed_in", {
        login_method: session.user.app_metadata?.provider ?? "unknown",
      })
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN" && _session?.user?.id) {
        getPostHog().identify(_session.user.id, {
          email: _session.user.email,
        })
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
