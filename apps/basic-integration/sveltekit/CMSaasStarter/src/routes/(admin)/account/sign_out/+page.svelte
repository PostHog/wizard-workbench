<script lang="ts">
  import { goto } from "$app/navigation"
  import { env } from "$env/dynamic/public"
  import { onMount } from "svelte"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")
  const posthogConfigured = Boolean(
    env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST,
  )

  // on mount, sign out
  onMount(() => {
    supabase.auth.signOut().then(async ({ error }) => {
      if (error) {
        message = "There was an issue signing out."
      } else {
        if (posthogConfigured) {
          const { default: posthog } = await import("posthog-js")
          posthog.capture("user_signed_out")
          posthog.reset()
        }
        goto("/")
      }
    })
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
