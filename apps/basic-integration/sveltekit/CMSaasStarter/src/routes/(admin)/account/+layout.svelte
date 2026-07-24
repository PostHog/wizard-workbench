<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  function identifyUser(user: typeof data.user | undefined) {
    if (!user?.id) return

    const personProperties: Record<string, string> = {}
    if (user.email) personProperties.email = user.email

    const fullName = user.user_metadata.full_name
    if (typeof fullName === "string" && fullName) {
      personProperties.name = fullName
    }

    posthog.identify(user.id, personProperties)
  }

  onMount(() => {
    identifyUser(data.user)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (event === "SIGNED_OUT") {
          posthog.reset()
        } else if (event === "SIGNED_IN") {
          identifyUser(nextSession?.user)
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
