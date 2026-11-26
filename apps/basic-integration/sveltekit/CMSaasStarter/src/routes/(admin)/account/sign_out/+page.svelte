<script lang="ts">
  import { goto } from "$app/navigation"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  // Capture before reset so the sign-out remains attributed to the departing user.
  onMount(() => {
    posthog.capture("user_signed_out")
    // Reset before sign-out so a subsequent user does not inherit this user's identity.
    posthog.reset()
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        message = "There was an issue signing out."
      } else {
        goto("/")
      }
    })
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
