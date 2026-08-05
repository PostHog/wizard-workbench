<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import {
    PUBLIC_POSTHOG_HOST,
    PUBLIC_POSTHOG_PROJECT_TOKEN,
  } from "$env/static/public"
  import posthog from "posthog-js"

  let { data, children } = $props()

  let { supabase, session } = $state(data)

  const identifyUser = (user: typeof data.user | undefined) => {
    if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST || !user?.id) {
      return
    }

    posthog.identify(user.id, {
      email: user.email,
      name: data.profile?.full_name ?? undefined,
    })
  }
  $effect(() => {
    ;({ supabase, session } = data)
  })

  onMount(() => {
    identifyUser(data.user)

    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === "SIGNED_IN") {
          identifyUser(_session?.user)
        }

        if (_session?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authData.subscription.unsubscribe()
  })
</script>

{@render children?.()}
