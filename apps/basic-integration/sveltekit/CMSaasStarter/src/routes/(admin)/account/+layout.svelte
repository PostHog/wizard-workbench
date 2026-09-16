<script lang="ts">
  import { invalidate } from "$app/navigation"
  import type { User } from "@supabase/supabase-js"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  function identifyUser(authUser: User) {
    const personProperties: Record<string, string> = {}
    if (authUser.email) {
      personProperties.email = authUser.email
    }

    const fullName = authUser.user_metadata.full_name
    if (typeof fullName === "string") {
      personProperties.name = fullName
    }

    posthog.identify(authUser.id, personProperties)
  }

  onMount(() => {
    let identifiedUserId: string | null = null
    if (user) {
      identifyUser(user)
      identifiedUserId = user.id
    }

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (
        event === "SIGNED_IN" &&
        authSession?.user &&
        authSession.user.id !== identifiedUserId
      ) {
        if (identifiedUserId) {
          posthog.reset()
        }
        identifyUser(authSession.user)
        identifiedUserId = authSession.user.id
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
