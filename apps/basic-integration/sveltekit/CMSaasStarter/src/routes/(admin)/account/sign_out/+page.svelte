<script lang="ts">
  import { env } from "$env/dynamic/public"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  // on mount, sign out
  onMount(() => {
    if (env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST) {
      posthog.capture("account_sign_out_started")
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
