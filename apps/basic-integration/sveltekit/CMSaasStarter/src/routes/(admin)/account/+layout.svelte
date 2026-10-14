<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { env } from "$env/dynamic/public"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user, profile } = $state(data)
  $effect(() => {
    ;({ supabase, session, user, profile } = data)
  })

  function isPostHogConfigured() {
    return Boolean(
      env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST,
    )
  }

  function identifyUser() {
    if (!isPostHogConfigured() || !user?.id) {
      return
    }

    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(profile?.full_name ? { name: profile.full_name } : {}),
    })
  }

  onMount(() => {
    identifyUser()

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_OUT" && isPostHogConfigured()) {
        posthog.reset()
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
