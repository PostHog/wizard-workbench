<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"
  import { onMount } from "svelte"
  import posthog from "posthog-js"

  let { data } = $props()

  onMount(() => {
    data.supabase.auth.onAuthStateChange(
      (
        event: string,
        session: { user?: { id: string; email?: string } } | null,
      ) => {
        if (event == "SIGNED_IN" && session?.user) {
          // Identify the new user in PostHog and capture sign up event
          posthog.identify(session.user.id, {
            email: session.user.email,
          })
          posthog.capture("user_signed_up", {
            email: session.user.email,
            $set: { email: session.user.email },
          })
        }
      },
    )
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
