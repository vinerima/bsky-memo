<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "../composables/useI18n"
import type { GameMode, GameConfig, TimeDifficulty, ChallengeDifficulty } from "../types"

const { t } = useI18n()

const emit = defineEmits<{
  start: [handle: string, config: GameConfig]
}>()

const handle = ref("")
const mode = ref<GameMode>("time")
const timeDifficulty = ref<TimeDifficulty>("quick")
const challengeDifficulty = ref<ChallengeDifficulty>("easy")

function onSubmit() {
  const trimmed = handle.value.trim()
  if (!trimmed) return

  const config: GameConfig =
    mode.value === "time"
      ? { mode: "time", timeDifficulty: timeDifficulty.value }
      : { mode: "challenge", challengeDifficulty: challengeDifficulty.value }

  emit("start", trimmed, config)
}
</script>

<template>
  <div class="start-screen">
    <h1>{{ t("app.title") }}</h1>
    <p class="start-screen__subtitle">
      {{ t("app.subtitle") }}
    </p>

    <form class="handle-form" @submit.prevent="onSubmit">
      <div class="input-group">
        <span class="input-prefix">@</span>
        <input
          v-model="handle"
          type="text"
          :placeholder="t('app.placeholder')"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      <div class="mode-tabs">
        <button
          type="button"
          class="mode-tab"
          :class="{ active: mode === 'time' }"
          @click="mode = 'time'"
        >
          {{ t("mode.time") }}
        </button>
        <button
          type="button"
          class="mode-tab"
          :class="{ active: mode === 'challenge' }"
          @click="mode = 'challenge'"
        >
          {{ t("mode.challenge") }}
        </button>
      </div>

      <p class="mode-desc">{{ mode === "time" ? t("mode.time.desc") : t("mode.challenge.desc") }}</p>

      <div v-if="mode === 'time'" class="option-group">
        <button
          v-for="d in (['quick', 'moderate', 'long'] as const)"
          :key="d"
          type="button"
          class="option-btn"
          :class="{ active: timeDifficulty === d }"
          @click="timeDifficulty = d"
        >
          <span class="option-btn__label">{{ t(`time.${d}`) }}</span>
          <span class="option-btn__detail">{{ t(`time.${d}.detail`) }}</span>
        </button>
      </div>

      <div v-else class="option-group">
        <button
          v-for="d in (['easy', 'medium', 'hard', 'extreme'] as const)"
          :key="d"
          type="button"
          class="option-btn"
          :class="{ active: challengeDifficulty === d }"
          @click="challengeDifficulty = d"
        >
          <span class="option-btn__label">{{ t(`challenge.${d}`) }}</span>
          <span class="option-btn__detail">{{ t(`challenge.${d}.detail`) }}</span>
        </button>
      </div>

      <button type="submit" :disabled="!handle.trim()">{{ t("app.start") }}</button>
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

.mode-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  background: var(--border);
  border-radius: 10px;
  padding: 3px;
  margin-top: 4px;
}

.mode-tab {
  border: none;
  background: transparent;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}

.mode-tab.active {
  background: var(--bg);
  color: var(--text-h);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.mode-desc {
  font-size: 13px;
  color: var(--text);
  line-height: 1.4;
}

.option-group {
  display: flex;
  gap: 6px;
}

.option-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  cursor: pointer;
  transition: all 0.15s;
}

.option-btn:hover {
  border-color: var(--accent-border);
}

.option-btn.active {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.option-btn__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}

.option-btn__detail {
  font-size: 11px;
  color: var(--text);
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
  margin-top: 4px;
}

button[type="submit"]:hover:not(:disabled) {
  opacity: 0.9;
}

button[type="submit"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
