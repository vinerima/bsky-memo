<script setup lang="ts">
import type { GameMode } from "../types"
import { useI18n } from "../composables/useI18n"

const { t } = useI18n()

const props = defineProps<{
  score: number
  totalMatches: number
  totalMistakes: number
  handle: string
  gameMode: GameMode
  elapsedTime: number
}>()

defineEmits<{
  playAgain: []
}>()

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}
</script>

<template>
  <div class="game-over">
    <h1>{{ gameMode === "time" ? t("game.timesUp") : t("game.challengeComplete") }}</h1>
    <div class="game-over__score">{{ score }}</div>
    <p class="game-over__label">{{ t("game.points") }}</p>
    <p class="game-over__details">
      {{ t("game.matched", { count: totalMatches, handle }) }}
    </p>
    <p v-if="totalMistakes > 0" class="game-over__mistakes">
      {{ t("game.mistakes", { count: totalMistakes }) }}
    </p>
    <p v-if="gameMode === 'challenge'" class="game-over__time">
      {{ t("game.inTime", { time: formatTime(elapsedTime) }) }}
    </p>
    <button class="play-again-btn" @click="$emit('playAgain')">{{ t("game.playAgain") }}</button>
  </div>
</template>

<style scoped>
.game-over {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 24px;
  text-align: center;
}

.game-over h1 {
  margin-bottom: 8px;
}

.game-over__score {
  font-family: var(--mono);
  font-size: 72px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.game-over__label {
  font-size: 18px;
  color: var(--text);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.game-over__details {
  margin-top: 20px;
  color: var(--text);
  font-size: 15px;
}

.game-over__mistakes {
  margin-top: 6px;
  color: var(--danger);
  font-size: 14px;
}

.game-over__time {
  margin-top: 6px;
  color: var(--text);
  font-size: 14px;
  font-family: var(--mono);
}

.play-again-btn {
  margin-top: 32px;
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.play-again-btn:hover {
  opacity: 0.9;
}
</style>
