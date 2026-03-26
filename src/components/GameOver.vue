<script setup lang="ts">
import { useI18n } from "../composables/useI18n"

const { t } = useI18n()

defineProps<{
  score: number
  totalMatches: number
  handle: string
}>()

defineEmits<{
  playAgain: []
}>()
</script>

<template>
  <div class="game-over">
    <h1>{{ t("game.timesUp") }}</h1>
    <div class="game-over__score">{{ score }}</div>
    <p class="game-over__label">{{ t("game.points") }}</p>
    <p class="game-over__details">
      {{ t("game.matched", { count: totalMatches, handle }) }}
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
