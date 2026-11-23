<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { env } from "$env/dynamic/public"
  import posthog from "posthog-js"
  import { onMount } from "svelte"
  import type { User } from "@supabase/supabase-js"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  let identifiedUserId: string | null = null

  function resetPostHog() {
    if (env.PUBLIC_POSTHOG_PROJECT_TOKEN) {
      posthog.reset()
    }
  }

  function identifyUser(user: User) {
    if (!env.PUBLIC_POSTHOG_PROJECT_TOKEN || identifiedUserId === user.id) return

    if (identifiedUserId) {
      resetPostHog()
    }

    const properties: { email?: string; name?: string } = {}
    if (user.email) {
      properties.email = user.email
    }
    if (typeof user.user_metadata.full_name === "string") {
      properties.name = user.user_metadata.full_name
    }

    posthog.identify(user.id, properties)
    identifiedUserId = user.id
  }

  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    if (session?.user) {
      identifyUser(session.user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_OUT") {
        resetPostHog()
        identifiedUserId = null
      } else if (event === "SIGNED_IN" && _session?.user) {
        identifyUser(_session.user)
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
