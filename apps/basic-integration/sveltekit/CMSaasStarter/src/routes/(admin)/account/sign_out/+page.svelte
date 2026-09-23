<script lang="ts">
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import posthog from "posthog-js"

  let { data } = $props()

  let message = $state("Signing out....")

  // on mount, sign out
  onMount(() => {
    data.supabase.auth.signOut().then(({ error }) => {
      if (error) {
        message = "There was an issue signing out."
      } else {
        posthog.capture("user_signed_out")
        posthog.reset()
        goto("/")
      }
    })
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
