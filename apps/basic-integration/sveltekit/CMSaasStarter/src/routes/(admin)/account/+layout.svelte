<script lang="ts">
  import { invalidate } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
  })

  const identifyUser = (
    user: NonNullable<typeof data.user>,
    fullName?: string | null,
  ) => {
    const personProperties: { email?: string; name?: string } = {}
    if (user.email) personProperties.email = user.email
    if (fullName) personProperties.name = fullName

    posthog.identify(user.id, personProperties)
  }

  onMount(() => {
    // Account routes only load for authenticated users, so this also restores identity on refresh.
    identifyUser(data.user, data.profile?.full_name)

    const { data: authData } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN" && authSession) {
        identifyUser(authSession.user)
      }

      if (authSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => authData.subscription.unsubscribe()
  })
</script>

{@render children?.()}
