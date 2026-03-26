<script setup lang="ts">
import { useGameState } from "./composables/useGameState"
import { useI18n } from "./composables/useI18n"
import { useTheme } from "./composables/useTheme"
import HandleInput from "./components/HandleInput.vue"
import LoadingSpinner from "./components/LoadingSpinner.vue"
import GameBoard from "./components/GameBoard.vue"
import GameOver from "./components/GameOver.vue"
import type { Locale } from "./composables/useI18n"

const { t, locale, setLocale, availableLocales } = useI18n()
const { theme, toggleTheme } = useTheme()

const {
  gameState,
  handle,
  score,
  timeRemaining,
  currentPage,
  selectedRootUri,
  matchedReplyUris,
  matchedRootUris,
  wrongSelection,
  error,
  totalMatches,
  progress,
  startGame,
  selectRoot,
  selectReply,
  resetGame,
} = useGameState()

function onLocaleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  setLocale(target.value as Locale)
}
</script>

<template>
  <div class="app-container">
    <nav class="app-bar">
      <select
        class="locale-select"
        :value="locale"
        @change="onLocaleChange"
        :aria-label="'Language'"
      >
        <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code">
          {{ loc.label }}
        </option>
      </select>

      <button class="theme-toggle" @click="toggleTheme" :aria-label="'Toggle theme'">
        <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </nav>

    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <HandleInput v-if="gameState === 'idle'" @start="startGame" />

    <LoadingSpinner v-else-if="gameState === 'loading'" :message="t('app.loading')" />

    <GameBoard
      v-else-if="gameState === 'playing' && currentPage"
      :currentPage="currentPage"
      :selectedRootUri="selectedRootUri"
      :matchedReplyUris="matchedReplyUris"
      :matchedRootUris="matchedRootUris"
      :wrongSelection="wrongSelection"
      :score="score"
      :timeRemaining="timeRemaining"
      :progress="progress"
      :handle="handle"
      @selectRoot="selectRoot"
      @selectReply="selectReply"
    />

    <GameOver
      v-else-if="gameState === 'gameOver'"
      :score="score"
      :totalMatches="totalMatches"
      :handle="handle"
      @playAgain="resetGame"
    />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100svh;
}

.app-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
}

.locale-select {
  appearance: none;
  background: var(--bg);
  color: var(--text-h);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 28px 5px 10px;
  font-size: 13px;
  font-family: var(--sans);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6375' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.locale-select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text-h);
  cursor: pointer;
  transition: border-color 0.2s;
}

.theme-toggle:hover {
  border-color: var(--accent-border);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.error-banner {
  background: var(--danger-bg);
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 12px 16px;
  border-radius: 8px;
  margin: 0 16px 16px;
  font-size: 14px;
}
</style>
