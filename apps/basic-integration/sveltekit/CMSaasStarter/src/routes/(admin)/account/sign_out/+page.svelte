<script lang="ts">
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import {
    PUBLIC_POSTHOG_HOST,
    PUBLIC_POSTHOG_PROJECT_TOKEN,
  } from "$env/static/public"
  import posthog from "posthog-js"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  // on mount, sign out
  onMount(() => {
    if (PUBLIC_POSTHOG_PROJECT_TOKEN && PUBLIC_POSTHOG_HOST) {
      posthog.capture("user_signed_out")
      posthog.reset()
    }

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
