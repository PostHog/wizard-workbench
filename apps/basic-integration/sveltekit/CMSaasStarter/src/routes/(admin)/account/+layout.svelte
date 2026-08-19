<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user, profile } = $state(data)
  $effect(() => {
    ;({ supabase, session, user, profile } = data)
  })

  function identifyUser(authUser: NonNullable<typeof user>) {
    posthog.identify(authUser.id, {
      email: authUser.email,
      name: profile?.full_name,
    })
  }

  onMount(() => {
    if (user) {
      identifyUser(user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN" && authSession?.user) {
        identifyUser(authSession.user)
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
