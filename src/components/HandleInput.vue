<script setup lang="ts">
import { ref } from "vue"

const emit = defineEmits<{
  start: [handle: string]
}>()

const handle = ref("")

function onSubmit() {
  const trimmed = handle.value.trim()
  if (trimmed) {
    emit("start", trimmed)
  }
}
</script>

<template>
  <div class="start-screen">
    <h1>Bluesky Memo</h1>
    <p class="start-screen__subtitle">
      Match replies to their original posts before time runs out.
      Each correct match scores 10 points. You have 120 seconds.
    </p>

    <form class="handle-form" @submit.prevent="onSubmit">
      <div class="input-group">
        <span class="input-prefix">@</span>
        <input
          v-model="handle"
          type="text"
          placeholder="username.bsky.social"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
      <button type="submit" :disabled="!handle.trim()">Start Game</button>
    </form>
  </div>
</template>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  max-width: 460px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}

.start-screen__subtitle {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 32px;
}

.handle-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.input-group {
  display: flex;
  align-items: center;
  border: 2px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg);
  transition: border-color 0.2s;
}

.input-group:focus-within {
  border-color: var(--accent);
}

.input-prefix {
  padding: 12px 0 12px 14px;
  color: var(--text);
  font-size: 16px;
  user-select: none;
}

.input-group input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 14px 12px 4px;
  font-size: 16px;
  font-family: var(--sans);
  background: transparent;
  color: var(--text-h);
}

.input-group input::placeholder {
  color: var(--text);
  opacity: 0.5;
}

button[type="submit"] {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

button[type="submit"]:hover:not(:disabled) {
  opacity: 0.9;
}

button[type="submit"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
