<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session, user } = $state(data)
  $effect(() => {
    ;({ supabase, session, user } = data)
  })

  const identifyUser = (user: NonNullable<typeof data.user>) => {
    const previousUserId = posthog.get_property("$user_id")
    if (typeof previousUserId === "string" && previousUserId !== user.id) {
      posthog.reset()
    }

    const name = user.user_metadata.full_name ?? user.user_metadata.name
    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(typeof name === "string" ? { name } : {}),
    })
  }

  onMount(() => {
    if (user) {
      identifyUser(user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN" && _session?.user) {
        identifyUser(_session.user)
      }

      if (event === "SIGNED_OUT") {
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
