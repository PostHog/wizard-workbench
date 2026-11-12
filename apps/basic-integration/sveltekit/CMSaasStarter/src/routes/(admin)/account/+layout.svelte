<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  onMount(() => {
    if (user?.id) {
      posthog.identify(user.id, user.email ? { email: user.email } : undefined)
    }

    const { data } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === "SIGNED_IN" && currentSession?.user.id) {
          posthog.identify(
            currentSession.user.id,
            currentSession.user.email
              ? { email: currentSession.user.email }
              : undefined,
          )
        }

        if (currentSession?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
