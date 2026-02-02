<template>
<<<<<<< Updated upstream
  <router-view />
</template>

<script setup>
</script>
<style>
html.dark{
  color-scheme: dark;
}
</style>


=======
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
  return route.meta.layout || DefaultLayout
})
</script>

<style>
/* App specific global styles if needed */
</style>
>>>>>>> Stashed changes
