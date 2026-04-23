<template>
  <div class="base-input-group" :class="{ 'has-error': error, 'has-focus': isFocused }">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <div v-if="$slots.icon || icon" class="input-icon">
        <slot name="icon">
          <i :class="icon"></i>
        </slot>
      </div>
      <input
        :id="id"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="input-field"
        :placeholder="placeholder"
      />
    </div>
    <transition name="fade">
      <span v-if="error" class="input-error">{{ error }}</span>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  label: String,
  id: {
    type: String,
    required: true
  },
  modelValue: [String, Number],
  error: String,
  icon: String,
  placeholder: String
})

defineEmits(['update:modelValue'])

const isFocused = ref(false)
</script>

<style scoped>
.base-input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
  width: 100%;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  transition: color 0.3s;
}

.has-focus .input-label {
  color: var(--color-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  font-size: 1.1rem;
  transition: color 0.3s;
}

.has-focus .input-icon {
  color: var(--color-secondary);
}

.input-field {
  width: 100%;
  padding: 0.8rem 1rem;
  padding-left: v-bind("$slots.icon || icon ? '2.8rem' : '1rem'");
  border: 2px solid #eef2f6;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f8fafc;
  color: var(--color-primary);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-secondary);
  background-color: white;
  box-shadow: 0 4px 12px rgba(var(--color-secondary-rgb, 100, 160, 255), 0.15);
}

.has-error .input-field {
  border-color: #e05252;
  background-color: #fffafa;
}

.input-error {
  font-size: 0.8rem;
  color: #e05252;
  margin-top: 0.4rem;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
