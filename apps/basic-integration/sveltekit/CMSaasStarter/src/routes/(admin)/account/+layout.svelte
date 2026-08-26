<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  function identifyUser(user: NonNullable<typeof data.user>) {
    const personProperties = {
      ...(user.email ? { email: user.email } : {}),
      ...(typeof user.user_metadata.full_name === "string"
        ? { name: user.user_metadata.full_name }
        : {}),
    }

    posthog.identify(user.id, personProperties)
  }

  onMount(() => {
    if (user) {
      identifyUser(user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN" && authSession?.user) {
        identifyUser(authSession.user)
      }

      if (event === "SIGNED_OUT") {
        posthog.reset()
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
