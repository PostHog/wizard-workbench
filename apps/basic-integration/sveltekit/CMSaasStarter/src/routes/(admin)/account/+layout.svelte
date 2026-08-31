<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  function identifyUser(authenticatedUser: typeof user) {
    if (!authenticatedUser) return

    const fullName = authenticatedUser.user_metadata.full_name
    posthog.identify(authenticatedUser.id, {
      ...(authenticatedUser.email ? { email: authenticatedUser.email } : {}),
      ...(typeof fullName === "string" ? { name: fullName } : {}),
    })
  }

  onMount(() => {
    identifyUser(user)

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN" && _session?.user) {
        identifyUser(_session.user)
      } else if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
