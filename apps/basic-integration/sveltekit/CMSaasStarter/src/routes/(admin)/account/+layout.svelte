<script lang="ts">
  import { invalidate } from "$app/navigation"
  import {
    PUBLIC_POSTHOG_HOST,
    PUBLIC_POSTHOG_PROJECT_TOKEN,
  } from "$env/static/public"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) {
      return
    }

    if (data.user?.id) {
      posthog.identify(data.user.id, {
        ...(data.user.email ? { email: data.user.email } : {}),
        ...(data.profile?.full_name ? { name: data.profile.full_name } : {}),
      })
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (event === "SIGNED_OUT") {
          posthog.reset()
        } else if (event === "SIGNED_IN" && nextSession?.user.id) {
          posthog.identify(nextSession.user.id, {
            ...(nextSession.user.email ? { email: nextSession.user.email } : {}),
          })
        }

        if (nextSession?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authListener.subscription.unsubscribe()
  })
</script>

{@render children?.()}
