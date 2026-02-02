<template>
  <div class="base-input">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input-field"
      :class="{ 'has-error': error }"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  id: {
    type: String,
    required: true
  },
  modelValue: [String, Number],
  error: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.input-field {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #ddd;
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: var(--color-surface);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26, 42, 68, 0.1);
}

.input-field.has-error {
  border-color: var(--color-danger);
}

.input-error {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin-top: var(--spacing-xs);
}
</style>
