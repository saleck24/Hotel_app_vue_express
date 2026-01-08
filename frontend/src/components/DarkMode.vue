<template>
  <button @click="toggle" class="menu-link flex items-center gap-2">
    <component :is="isDark ? SunIcon : MoonIcon" class="darkmode-icon"/>
    <span>{{ isDark ? 'Mode clair' : 'Mode sombre' }}</span>
  </button>
</template>

<script setup>
import { useThemeStore } from '../stores/theme'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const theme = useThemeStore()
const isDark = theme.isDark
const toggle = theme.toggle
</script>
