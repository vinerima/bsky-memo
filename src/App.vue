<script setup lang="ts">
import { useGameState } from "./composables/useGameState"
import HandleInput from "./components/HandleInput.vue"
import LoadingSpinner from "./components/LoadingSpinner.vue"
import GameBoard from "./components/GameBoard.vue"
import GameOver from "./components/GameOver.vue"

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
</script>

<template>
  <div class="app-container">
    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <HandleInput v-if="gameState === 'idle'" @start="startGame" />

    <LoadingSpinner v-else-if="gameState === 'loading'" message="Fetching posts and replies..." />

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

.error-banner {
  background: var(--danger-bg);
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px;
  font-size: 14px;
}
</style>
