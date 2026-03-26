<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: "Loading...",
})
</script>

<template>
  <div class="loading">
    <div class="spinner"></div>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  color: var(--text);
  font-size: 15px;
}
</style>
