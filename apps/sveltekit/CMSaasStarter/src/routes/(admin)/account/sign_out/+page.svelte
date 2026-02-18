<script lang="ts">
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"
  import { browser } from "$app/environment"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  // on mount, sign out
  onMount(() => {
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        message = "There was an issue signing out."
      } else {
        // Capture sign out event and reset PostHog
        if (browser) {
          posthog.capture("user_signed_out")
          posthog.reset()
        }
        goto("/")
      }
    })
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
