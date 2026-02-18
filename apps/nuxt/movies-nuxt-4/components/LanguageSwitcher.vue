<script setup>
const { $posthog: posthog } = useNuxtApp()
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value)
})

function updateLocale(event) {
  const newLocale = event.target.value
  const previousLocale = locale.value

  // Track language change event before reload
  posthog?.capture('language_changed', {
    previous_language: previousLocale,
    new_language: newLocale,
  })

  setLocale(newLocale)
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
    <select id="langSwitcher" rounded-md text-sm p-1 aria-label="Select language" @change="updateLocale">
      <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code" p-1>
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>
