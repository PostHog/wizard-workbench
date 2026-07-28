<script setup lang="ts">
import type { Recipe } from '~~/server/utils/recipes'

const { data: recipes, refresh } = await useFetch<Recipe[]>('/api/recipes')

const title = ref('')
const minutes = ref(30)
const tags = ref('')

async function addRecipe() {
  if (!title.value.trim()) return

  await $fetch('/api/recipes', {
    method: 'POST',
    body: {
      title: title.value,
      minutes: minutes.value,
      tags: tags.value.split(',').map((tag) => tag.trim()).filter(Boolean),
    },
  })

  title.value = ''
  tags.value = ''
  await refresh()
}

async function cookIt(recipe: Recipe) {
  await $fetch(`/api/recipes/${recipe.id}`, {
    method: 'PATCH',
    body: { cooked: recipe.cooked + 1 },
  })
  await refresh()
}

async function toggleFavorite(recipe: Recipe) {
  await $fetch(`/api/recipes/${recipe.id}`, {
    method: 'PATCH',
    body: { favorite: !recipe.favorite },
  })
  await refresh()
}

async function removeRecipe(recipe: Recipe) {
  await $fetch(`/api/recipes/${recipe.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <nav><NuxtLink to="/about">About</NuxtLink></nav>

  <h1>Recipe box</h1>
  <p class="lede">Keep the recipes you actually cook, and count how often you cook them.</p>

  <form class="card row" @submit.prevent="addRecipe">
    <input v-model="title" class="grow" type="text" placeholder="Recipe title" />
    <input v-model.number="minutes" type="number" min="1" style="width: 6rem" />
    <input v-model="tags" type="text" placeholder="tags, comma separated" />
    <button class="primary" type="submit">Add</button>
  </form>

  <p v-if="!recipes?.length" class="lede">No recipes yet. Add one above.</p>

  <div v-for="recipe in recipes" :key="recipe.id" class="card row">
    <div>
      <strong>{{ recipe.title }}</strong>
      <div class="meta">
        {{ recipe.minutes }} min · cooked {{ recipe.cooked }}×
      </div>
      <div>
        <span v-for="tag in recipe.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    <div class="row" style="gap: 0.5rem">
      <button @click="toggleFavorite(recipe)">{{ recipe.favorite ? '★' : '☆' }}</button>
      <button @click="cookIt(recipe)">Cooked it</button>
      <button class="ghost" @click="removeRecipe(recipe)">Delete</button>
    </div>
  </div>
</template>
