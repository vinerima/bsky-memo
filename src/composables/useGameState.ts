import { ref, computed, onUnmounted } from "vue"
import type { BskyPost, GamePage, GameState, GameMode, GameConfig } from "../types"
import { TIME_LIMITS, CHALLENGE_COUNTS, MAX_REPLIES_PER_POST } from "../types"
import { useBlueskyApi } from "./useBlueskyApi"
import { useI18n } from "./useI18n"

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function buildPages(postsWithReplies: Array<{ root: BskyPost; replies: BskyPost[] }>): GamePage[] {
  const pages: GamePage[] = []
  const chunkSize = 3

  for (let i = 0; i < postsWithReplies.length; i += chunkSize) {
    const chunk = postsWithReplies.slice(i, i + chunkSize)
    const replyToRootMap = new Map<string, string>()
    const allReplies: BskyPost[] = []

    for (const { root, replies } of chunk) {
      for (const reply of replies) {
        replyToRootMap.set(reply.uri, root.uri)
        allReplies.push(reply)
      }
    }

    pages.push({
      rootPosts: chunk.map((c) => c.root),
      shuffledReplies: shuffle(allReplies),
      replyToRootMap,
    })
  }

  return pages
}

export function useGameState() {
  const api = useBlueskyApi()
  const { t } = useI18n()

  const gameState = ref<GameState>("idle")
  const gameMode = ref<GameMode>("time")
  const handle = ref("")
  const score = ref(0)
  const timer = ref(0)
  const pages = ref<GamePage[]>([])
  const currentPageIndex = ref(0)
  const selectedRootUri = ref<string | null>(null)
  const matchedReplyUris = ref<Set<string>>(new Set())
  const matchedRootUris = ref<Set<string>>(new Set())
  const error = ref<string | null>(null)
  const totalMatches = ref(0)
  const totalMistakes = ref(0)
  const wrongSelection = ref<string | null>(null)

  let timerInterval: ReturnType<typeof setInterval> | null = null
  let timeLimit = 0

  const currentPage = computed<GamePage | null>(() => pages.value[currentPageIndex.value] ?? null)

  const isPageComplete = computed(() => {
    const page = currentPage.value
    if (!page) return false
    return page.shuffledReplies.every((r) => matchedReplyUris.value.has(r.uri))
  })

  const progress = computed(() => ({
    current: currentPageIndex.value + 1,
    total: pages.value.length,
  }))

  const timeRemaining = computed(() => {
    if (gameMode.value === "time") {
      return timeLimit - timer.value
    }
    return timer.value
  })

  function startTimer() {
    timerInterval = setInterval(() => {
      timer.value++
      if (gameMode.value === "time" && timer.value >= timeLimit) {
        endGame()
      }
    }, 1000)
  }

  function endGame() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    gameState.value = "gameOver"
  }

  function advancePage() {
    currentPageIndex.value++
    matchedReplyUris.value = new Set()
    matchedRootUris.value = new Set()
    selectedRootUri.value = null

    if (currentPageIndex.value >= pages.value.length) {
      endGame()
    }
  }

  async function startGame(inputHandle: string, config: GameConfig) {
    error.value = null
    gameState.value = "loading"
    gameMode.value = config.mode

    try {
      const cleaned = inputHandle.replace(/^@/, "").trim()
      handle.value = cleaned

      let targetPostCount: number
      if (config.mode === "time") {
        timeLimit = TIME_LIMITS[config.timeDifficulty ?? "quick"]
        targetPostCount = 50
      } else {
        timeLimit = 0
        targetPostCount = CHALLENGE_COUNTS[config.challengeDifficulty ?? "easy"]
      }

      const did = await api.resolveHandle(cleaned)
      const rootPosts = await api.fetchAuthorPosts(did, targetPostCount)
      const repliesMap = await api.fetchRepliesBatched(rootPosts.map((p) => p.uri))

      const postsWithReplies = rootPosts
        .map((root) => ({
          root,
          replies: shuffle(repliesMap.get(root.uri) ?? []).slice(0, MAX_REPLIES_PER_POST),
        }))
        .filter(({ replies }) => replies.length > 0)

      if (postsWithReplies.length < 3) {
        throw new Error(t("error.notEnoughReplies"))
      }

      const finalPosts =
        config.mode === "challenge"
          ? postsWithReplies.slice(0, CHALLENGE_COUNTS[config.challengeDifficulty ?? "easy"])
          : postsWithReplies

      pages.value = buildPages(finalPosts)
      score.value = 0
      timer.value = 0
      currentPageIndex.value = 0
      totalMatches.value = 0
      totalMistakes.value = 0
      matchedReplyUris.value = new Set()
      matchedRootUris.value = new Set()
      selectedRootUri.value = null

      gameState.value = "playing"
      startTimer()
    } catch (e) {
      error.value = e instanceof Error ? e.message : t("error.unexpected")
      gameState.value = "idle"
    }
  }

  function selectRoot(uri: string) {
    if (gameState.value !== "playing") return
    if (matchedRootUris.value.has(uri)) return
    selectedRootUri.value = uri
  }

  function selectReply(replyUri: string) {
    if (gameState.value !== "playing" || !selectedRootUri.value) return
    if (matchedReplyUris.value.has(replyUri)) return

    const page = currentPage.value
    if (!page) return

    const correctRootUri = page.replyToRootMap.get(replyUri)

    if (correctRootUri === selectedRootUri.value) {
      matchedReplyUris.value = new Set([...matchedReplyUris.value, replyUri])
      score.value += 10
      totalMatches.value++
      wrongSelection.value = null

      const allRepliesForRoot = [...page.replyToRootMap.entries()]
        .filter(([, rootUri]) => rootUri === selectedRootUri.value)
        .map(([replyUri]) => replyUri)

      const allMatched = allRepliesForRoot.every((uri) => matchedReplyUris.value.has(uri))

      if (allMatched) {
        matchedRootUris.value = new Set([...matchedRootUris.value, selectedRootUri.value])
        selectedRootUri.value = null

        if (isPageComplete.value) {
          setTimeout(() => advancePage(), 500)
        }
      }
    } else {
      score.value -= 5
      totalMistakes.value++
      wrongSelection.value = replyUri
      setTimeout(() => {
        wrongSelection.value = null
      }, 600)
    }
  }

  function resetGame() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    gameState.value = "idle"
    gameMode.value = "time"
    handle.value = ""
    score.value = 0
    timer.value = 0
    timeLimit = 0
    pages.value = []
    currentPageIndex.value = 0
    selectedRootUri.value = null
    matchedReplyUris.value = new Set()
    matchedRootUris.value = new Set()
    error.value = null
    totalMatches.value = 0
    totalMistakes.value = 0
    wrongSelection.value = null
  }

  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })

  return {
    gameState,
    gameMode,
    handle,
    score,
    timer,
    timeRemaining,
    pages,
    currentPageIndex,
    selectedRootUri,
    matchedReplyUris,
    matchedRootUris,
    error,
    totalMatches,
    totalMistakes,
    wrongSelection,
    currentPage,
    isPageComplete,
    progress,
    startGame,
    selectRoot,
    selectReply,
    resetGame,
  }
}
