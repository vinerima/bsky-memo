<script setup lang="ts">
import { ref } from "vue"
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

const copied = ref(false)
const appUrl = import.meta.env.VITE_APP_URL || ""

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function getShareText(): string {
  const text = t("game.shareText", { score: props.score, count: props.totalMatches, handle: props.handle })
  return appUrl ? `${text}\n${appUrl}` : text
}

async function share() {
  const text = getShareText()

  if (navigator.share) {
    try {
      await navigator.share({ text })
      return
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Clipboard unavailable
  }
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

    <div class="game-over__actions">
      <button class="share-btn" @click="share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {{ copied ? t("game.copied") : t("game.share") }}
      </button>
      <button class="play-again-btn" @click="$emit('playAgain')">{{ t("game.playAgain") }}</button>
    </div>
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

.game-over__actions {
  display: flex;
  gap: 10px;
  margin-top: 32px;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  color: var(--text-h);
  border: 2px solid var(--border);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
}

.share-btn:hover {
  border-color: var(--accent-border);
}

.play-again-btn {
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
