<script lang="ts">
  import { goto } from "$app/navigation"
  import {
    PUBLIC_POSTHOG_HOST,
    PUBLIC_POSTHOG_PROJECT_TOKEN,
  } from "$env/static/public"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  onMount(() => {
    const signOut = async () => {
      const posthogConfigured =
        PUBLIC_POSTHOG_PROJECT_TOKEN && PUBLIC_POSTHOG_HOST
      if (posthogConfigured) {
        posthog.capture("user_signed_out")
      }

      const { error } = await supabase.auth.signOut()
      if (error) {
        message = "There was an issue signing out."
      } else {
        if (posthogConfigured) {
          posthog.reset()
        }
        goto("/")
      }
    }

    void signOut()
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
