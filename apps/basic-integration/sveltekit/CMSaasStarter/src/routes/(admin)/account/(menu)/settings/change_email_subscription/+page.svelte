<script lang="ts">
  import posthog from "posthog-js"
  import SettingsModule from "../settings_module.svelte"
  let { data } = $props()
  let { profile } = data
  let unsubscribed = profile?.unsubscribed

  function handleSubscriptionToggled(result: Record<string, unknown> | undefined) {
    posthog.capture("email_subscription_toggled", {
      subscribed: !(result?.unsubscribed as boolean | undefined),
    })
  }
</script>

<svelte:head>
  <title>Change Email Subscription</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Email Subscription</h1>

<SettingsModule
  editable={true}
  title="Subscription"
  message={unsubscribed
    ? "You are currently unsubscribed from emails"
    : "You are currently subscribed to emails"}
  saveButtonTitle={unsubscribed ? "Re-subscribe" : "Unsubscribe"}
  successBody={unsubscribed
    ? "You have been re-subscribed to emails"
    : "You have been unsubscribed from emails"}
  formTarget="/account/api?/toggleEmailSubscription"
  onSuccess={handleSubscriptionToggled}
  fields={[]}
/>
