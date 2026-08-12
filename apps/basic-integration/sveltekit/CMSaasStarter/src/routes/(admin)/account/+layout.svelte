<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  let identifiedUserId: string | null = null
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: NonNullable<typeof session>["user"]) {
    if (identifiedUserId && identifiedUserId !== user.id) {
      posthog.reset()
    }

    posthog.identify(user.id, {
      email: user.email,
      name: user.user_metadata.full_name ?? user.user_metadata.name,
    })
    identifiedUserId = user.id
  }

  onMount(() => {
    if (session?.user) {
      identifyUser(session.user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_OUT") {
        posthog.reset()
        identifiedUserId = null
      } else if (event === "SIGNED_IN" && authSession?.user) {
        identifyUser(authSession.user)
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
