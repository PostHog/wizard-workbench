<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "../settings_module.svelte"
  import { page } from "$app/stores"
  import posthog from "posthog-js"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()

  let lastEmailFormState: unknown = null
  $effect(() => {
    const form = $page.form as Record<string, unknown> | null
    if (
      form &&
      form !== lastEmailFormState &&
      !form.errorMessage &&
      form.email !== undefined
    ) {
      lastEmailFormState = form
      posthog.capture("email_changed", { new_email: form.email })
    }
  })
</script>

<svelte:head>
  <title>Change Email</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  title="Change Email"
  editable={true}
  successTitle="Email change initiated"
  successBody="You should receive emails at both the old and new address to confirm the change. Please click the link in both emails to finalized the change. Until finalized, you must sign in with your current email."
  formTarget="/account/api?/updateEmail"
  fields={[
    {
      id: "email",
      label: "Email",
      initialValue: data.user?.email ?? "",
      placeholder: "Email address",
    },
  ]}
/>
