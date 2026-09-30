<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user, profile } = $state(data)
  $effect(() => {
    ;({ supabase, session, user, profile } = data)
  })

  const identifyUser = (authenticatedUser = user) => {
    if (!authenticatedUser?.id) {
      return
    }

    posthog.identify(authenticatedUser.id, {
      ...(authenticatedUser.email ? { email: authenticatedUser.email } : {}),
      ...(authenticatedUser.id === user?.id && profile?.full_name
        ? { name: profile.full_name }
        : {}),
    })
  }

  onMount(() => {
    identifyUser()

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        if (_session?.user.id && user?.id && _session.user.id !== user.id) {
          posthog.reset()
        }
        identifyUser(_session?.user)
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
