<template>
  <div class="p-10 text-white min-h-screen bg-black">
    <h1 class="text-4xl mb-4">SIMPLE VIEW WORKS!</h1>
    <p class="text-xl">If you see this, the router is working</p>
    <p>Route: {{ $route.path }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
