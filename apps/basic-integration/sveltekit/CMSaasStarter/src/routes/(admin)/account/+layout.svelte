<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { posthog } from "../../../hooks.client"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  let identifiedUserId: string | null = null

  function identifyUser(authUser: NonNullable<typeof user>) {
    const personProperties: Record<string, string> = {}
    if (authUser.email) {
      personProperties.email = authUser.email
    }

    const name = authUser.user_metadata.full_name
    if (typeof name === "string") {
      personProperties.name = name
    }

    posthog.identify(authUser.id, personProperties)
    identifiedUserId = authUser.id
  }

  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  onMount(() => {
    if (user) {
      identifyUser(user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_OUT") {
        posthog.reset()
        identifiedUserId = null
      } else if (
        event === "SIGNED_IN" &&
        nextSession?.user &&
        nextSession.user.id !== identifiedUserId
      ) {
        if (identifiedUserId) {
          posthog.reset()
        }
        identifyUser(nextSession.user)
      }

      if (nextSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
