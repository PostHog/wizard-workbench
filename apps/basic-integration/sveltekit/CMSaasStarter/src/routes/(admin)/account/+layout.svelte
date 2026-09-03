<script lang="ts">
  import { invalidate } from "$app/navigation"
  import {
    PUBLIC_POSTHOG_HOST,
    PUBLIC_POSTHOG_PROJECT_TOKEN,
  } from "$env/static/public"
  import { onMount } from "svelte"
  import posthog from "posthog-js"
  import type { User } from "@supabase/supabase-js"

  let { data, children } = $props()
  let identifiedUserId: string | null = null

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: User) {
    if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) return

    if (identifiedUserId === user.id) return
    if (identifiedUserId) posthog.reset()

    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(typeof user.user_metadata.full_name === "string"
        ? { name: user.user_metadata.full_name }
        : {}),
    })
    identifiedUserId = user.id
  }

  onMount(() => {
    if (data.user) identifyUser(data.user)

    const { data: authState } = supabase.auth.onAuthStateChange(
      (event, authSession) => {
        if (event === "SIGNED_OUT") {
          if (identifiedUserId) posthog.reset()
          identifiedUserId = null
        } else if (authSession?.user) {
          identifyUser(authSession.user)
        }

        if (authSession?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authState.subscription.unsubscribe()
  })
</script>

{@render children?.()}
