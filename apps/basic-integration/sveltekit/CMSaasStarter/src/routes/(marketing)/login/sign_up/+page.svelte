<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import posthog from "posthog-js"
  import { onMount } from "svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()

  onMount(() => {
    const { data: authListener } = data.supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN" && session?.user.id) {
        posthog.identify(
          session.user.id,
          session.user.email ? { email: session.user.email } : undefined,
        )
        posthog.capture("user_signed_up")
      }
    })

    return () => authListener.subscription.unsubscribe()
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
