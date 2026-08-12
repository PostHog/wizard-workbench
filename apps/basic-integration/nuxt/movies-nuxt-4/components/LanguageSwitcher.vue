<script setup>
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value)
})

const { $posthog: posthog } = useNuxtApp()

function updateLocale(event) {
  const locale = event.target.value
  posthog?.capture('language_changed', { locale })
  setLocale(locale)
  window.location.reload()
}

onMounted(() => {
  const langSwitcher = document.querySelector('#langSwitcher')
  langSwitcher.value = locale.value
})
</script>

<template>
  <div flex gap2 items-center mt-5>
    <label for="langSwitcher" class="text-sm">Language:</label>
    <select id="langSwitcher" rounded-md text-sm p-1 @change="updateLocale" aria-label="Select language">
      <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code" p-1>
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>
