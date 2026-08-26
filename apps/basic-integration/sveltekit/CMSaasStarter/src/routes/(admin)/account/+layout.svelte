<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import type { User } from "@supabase/supabase-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  function identifyUser(authUser: User | null) {
    if (!authUser?.id) return

    posthog.identify(authUser.id, {
      email: authUser.email,
    })
  }

  onMount(() => {
    identifyUser(user)

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN") {
        identifyUser(authSession?.user ?? null)
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
