<template>
  <button :class="['btn', `btn-${variant}`, { 'is-loading': loading }]" :disabled="loading || disabled">
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger'].includes(value)
  },
  loading: Boolean,
  disabled: Boolean
})
</script>

<style scoped>
.btn {
  /* Inherits base styles from main.css (.btn) */
  /* We add loading specific styles here */
  position: relative;
}

.btn-danger {
  background-color: var(--color-danger);
  color: white;
}
.btn-danger:hover {
  background-color: #c0392b;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Spinner */
.is-loading {
  color: transparent !important;
  pointer-events: none;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  transform: translate(-50%, -50%);
}

.btn-outline .spinner {
  border-color: rgba(26, 42, 68, 0.2);
  border-top-color: var(--color-primary);
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
