<script lang="ts">
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  // on mount, clear analytics identity before ending the Supabase session
  onMount(() => {
    const signOut = async () => {
      const { default: posthog } = await import("posthog-js")
      if (posthog.__loaded) {
        posthog.reset()
      }

      const { error } = await supabase.auth.signOut()
      if (error) {
        message = "There was an issue signing out."
      } else {
        goto("/")
      }
    }

    void signOut()
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
