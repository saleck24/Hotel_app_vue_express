<template>
  <div class="stat-card">
    <p class="text-gray-500 dark:text-gray-400 text-sm">{{ title }}</p>
    <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
});
</script>
