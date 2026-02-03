<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === false) return 'div'
  return route.meta.layout || DefaultLayout
})
</script>

<style>
html.dark {
  color-scheme: dark;
}
</style>
