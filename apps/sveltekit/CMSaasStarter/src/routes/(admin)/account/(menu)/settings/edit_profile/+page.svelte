<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { page } from "$app/stores"
  import posthog from "posthog-js"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()

  let lastFormState: unknown = null
  $effect(() => {
    const form = $page.form as Record<string, unknown> | null
    if (
      form &&
      form !== lastFormState &&
      !form.errorMessage &&
      form.fullName !== undefined
    ) {
      lastFormState = form
      posthog.capture("profile_updated", {
        full_name: form.fullName,
        company_name: form.companyName,
        website: form.website,
      })
    }
  })
</script>

<svelte:head>
  <title>Edit Profile</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  editable={true}
  title="Edit Profile"
  successTitle="Saved Profile"
  formTarget="/account/api?/updateProfile"
  fields={[
    {
      id: "fullName",
      label: "Name",
      initialValue: data.profile?.full_name ?? "",
      placeholder: "Your full name",
      maxlength: 50,
    },
    {
      id: "companyName",
      label: "Company Name",
      initialValue: data.profile?.company_name ?? "",
      maxlength: 50,
    },
    {
      id: "website",
      label: "Company Website",
      initialValue: data.profile?.website ?? "",
      maxlength: 50,
    },
  ]}
/>
