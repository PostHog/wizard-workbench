<script lang="ts">
  import { invalidate } from "$app/navigation"
  import {
    PUBLIC_POSTHOG_HOST,
    PUBLIC_POSTHOG_PROJECT_TOKEN,
  } from "$env/static/public"
  import { onMount } from "svelte"
  import type { User } from "@supabase/supabase-js"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  const identifyUser = async (authenticatedUser: User) => {
    if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) return

    const { default: posthog } = await import("posthog-js")
    posthog.identify(authenticatedUser.id, {
      email: authenticatedUser.email,
    })
  }

  const resetPostHog = async () => {
    if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) return

    const { default: posthog } = await import("posthog-js")
    posthog.reset()
  }

  onMount(() => {
    if (user) {
      void identifyUser(user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_OUT") {
        void resetPostHog()
      } else if (event === "SIGNED_IN" && authSession?.user) {
        void identifyUser(authSession.user)
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
