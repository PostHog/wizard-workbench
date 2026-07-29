<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"
  import type { User } from "@supabase/supabase-js"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  let identifiedUserId: string | null = null

  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: User) {
    if (identifiedUserId === user.id) return

    if (identifiedUserId) {
      posthog.reset()
    }

    posthog.identify(user.id, user.email ? { email: user.email } : undefined)
    identifiedUserId = user.id
  }

  onMount(() => {
    if (session?.user) {
      identifyUser(session.user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN" && _session?.user) {
        identifyUser(_session.user)
      }

      if (event === "SIGNED_OUT") {
        posthog.reset()
        identifiedUserId = null
      }

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{@render children?.()}
