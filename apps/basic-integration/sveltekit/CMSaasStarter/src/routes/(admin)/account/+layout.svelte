<script lang="ts">
  import { invalidate } from "$app/navigation"
  import type { User } from "@supabase/supabase-js"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  let identifiedUserId: string | null = null

  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: User) {
    const personProperties = {
      ...(user.email ? { email: user.email } : {}),
      ...(user.user_metadata.full_name
        ? { name: user.user_metadata.full_name as string }
        : {}),
    }

    posthog.identify(user.id, personProperties)
    identifiedUserId = user.id
  }

  onMount(() => {
    identifyUser(data.user)

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (event === "SIGNED_OUT") {
          posthog.reset()
          identifiedUserId = null
        } else if (nextSession?.user) {
          if (identifiedUserId && identifiedUserId !== nextSession.user.id) {
            posthog.reset()
          }
          if (identifiedUserId !== nextSession.user.id) {
            identifyUser(nextSession.user)
          }
        }

        if (nextSession?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authSubscription.subscription.unsubscribe()
  })
</script>

{@render children?.()}
