<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"
  import type { User } from "@supabase/supabase-js"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    let identifiedUserId: string | null = null

    const identifyUser = (user: User) => {
      if (!posthog.__loaded || identifiedUserId === user.id) return

      const currentUserId = posthog.get_property("$user_id")
      if (currentUserId && currentUserId !== user.id) {
        posthog.reset()
      }

      posthog.identify(user.id, {
        email: user.email,
        ...(typeof user.user_metadata.full_name === "string"
          ? { name: user.user_metadata.full_name }
          : {}),
      })
      identifiedUserId = user.id
    }

    identifyUser(data.user)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, updatedSession) => {
        if (event === "SIGNED_IN" && updatedSession) {
          identifyUser(updatedSession.user)
        }

        if (updatedSession?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authListener.subscription.unsubscribe()
  })
</script>

{@render children?.()}
