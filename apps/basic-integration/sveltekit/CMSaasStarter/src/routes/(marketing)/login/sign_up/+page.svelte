<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"
  import posthog from "posthog-js"
  import { onMount } from "svelte"

  let { data } = $props()
  let { supabase } = data

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Use Supabase's stable UUID, with PII stored only as a person property.
        posthog.identify(
          session.user.id,
          session.user.email ? { email: session.user.email } : {},
        )
        posthog.capture("user_signed_up")
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Sign Up</h1>
<Auth
  supabaseClient={data.supabase}
  view="sign_up"
  redirectTo={`${data.url}/auth/callback`}
  showLinks={false}
  providers={oauthProviders}
  socialLayout="horizontal"
  appearance={sharedAppearance}
  additionalData={undefined}
/>
<div class="text-l text-slate-800 mt-4 mb-2">
  Have an account? <a class="underline" href="/login/sign_in">Sign in</a>.
</div>
