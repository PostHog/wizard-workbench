<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(authSession: typeof session | null) {
    const user = authSession?.user
    if (!user?.id) return

    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(typeof user.user_metadata.full_name === "string"
        ? { name: user.user_metadata.full_name }
        : {}),
    })
  }

  onMount(() => {
    identifyUser(session)

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        if (session?.user.id && session.user.id !== _session?.user.id) {
          posthog.reset()
        }
        identifyUser(_session)
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
