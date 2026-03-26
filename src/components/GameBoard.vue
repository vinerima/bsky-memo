<script setup lang="ts">
import type { GamePage } from "../types"
import { useI18n } from "../composables/useI18n"
import PostCard from "./PostCard.vue"

const { t } = useI18n()

defineProps<{
  currentPage: GamePage
  selectedRootUri: string | null
  matchedReplyUris: Set<string>
  matchedRootUris: Set<string>
  wrongSelection: string | null
  score: number
  timeRemaining: number
  progress: { current: number; total: number }
  handle: string
}>()

defineEmits<{
  selectRoot: [uri: string]
  selectReply: [uri: string]
}>()

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}
</script>

<template>
  <div class="game-board">
    <header class="game-header">
      <span class="game-header__handle">@{{ handle }}</span>
      <span class="game-header__progress">{{ progress.current }} / {{ progress.total }}</span>
      <span class="game-header__timer" :class="{ urgent: timeRemaining <= 15 }">
        {{ formatTime(timeRemaining) }}
      </span>
      <span class="game-header__score">{{ t("game.pts", { score }) }}</span>
    </header>

    <p class="game-hint">
      <template v-if="!selectedRootUri">{{ t("game.hintSelect") }}</template>
      <template v-else>{{ t("game.hintMatch") }}</template>
    </p>

    <div class="game-columns">
      <div class="game-column">
        <h2>{{ t("game.posts") }}</h2>
        <PostCard
          v-for="post in currentPage.rootPosts"
          :key="post.uri"
          :post="post"
          variant="root"
          :selected="selectedRootUri === post.uri"
          :matched="matchedRootUris.has(post.uri)"
          @click="$emit('selectRoot', post.uri)"
        />
      </div>
      <div class="game-column">
        <h2>{{ t("game.replies") }}</h2>
        <PostCard
          v-for="reply in currentPage.shuffledReplies"
          :key="reply.uri"
          :post="reply"
          variant="reply"
          :matched="matchedReplyUris.has(reply.uri)"
          :disabled="!selectedRootUri"
          :wrong="wrongSelection === reply.uri"
          @click="$emit('selectReply', reply.uri)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  padding: 0 16px 32px;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.game-header__handle {
  color: var(--text);
  font-size: 14px;
}

.game-header__progress {
  color: var(--text);
  font-size: 14px;
  margin-left: auto;
}

.game-header__timer {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-h);
  min-width: 60px;
  text-align: center;
}

.game-header__timer.urgent {
  color: var(--danger);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.game-header__score {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
}

.game-hint {
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: var(--text);
  font-style: italic;
}

.game-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 768px) {
  .game-columns {
    grid-template-columns: 1fr;
  }
}

.game-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-column h2 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text);
  margin: 0;
}
</style>
