import { ref, computed, onUnmounted } from "vue"
import type { BskyPost, GamePage, GameState } from "../types"
import { useBlueskyApi } from "./useBlueskyApi"

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

  const gameState = ref<GameState>("idle")
  const handle = ref("")
  const score = ref(0)
  const timeRemaining = ref(120)
  const pages = ref<GamePage[]>([])
  const currentPageIndex = ref(0)
  const selectedRootUri = ref<string | null>(null)
  const matchedReplyUris = ref<Set<string>>(new Set())
  const matchedRootUris = ref<Set<string>>(new Set())
  const error = ref<string | null>(null)
  const totalMatches = ref(0)
  const wrongSelection = ref<string | null>(null)

  let timerInterval: ReturnType<typeof setInterval> | null = null

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

  function startTimer() {
    timerInterval = setInterval(() => {
      timeRemaining.value--
      if (timeRemaining.value <= 0) {
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

  async function startGame(inputHandle: string) {
    error.value = null
    gameState.value = "loading"

    try {
      const cleaned = inputHandle.replace(/^@/, "").trim()
      handle.value = cleaned

      const did = await api.resolveHandle(cleaned)
      const rootPosts = await api.fetchAuthorPosts(did)
      const repliesMap = await api.fetchRepliesBatched(rootPosts.map((p) => p.uri))

      const postsWithReplies = rootPosts
        .map((root) => ({
          root,
          replies: repliesMap.get(root.uri) ?? [],
        }))
        .filter(({ replies }) => replies.length > 0)

      if (postsWithReplies.length < 3) {
        throw new Error(
          "Not enough posts with visible replies found. Try a more active account."
        )
      }

      pages.value = buildPages(postsWithReplies)
      score.value = 0
      timeRemaining.value = 120
      currentPageIndex.value = 0
      totalMatches.value = 0
      matchedReplyUris.value = new Set()
      matchedRootUris.value = new Set()
      selectedRootUri.value = null

      gameState.value = "playing"
      startTimer()
    } catch (e) {
      error.value = e instanceof Error ? e.message : "An unexpected error occurred"
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
    handle.value = ""
    score.value = 0
    timeRemaining.value = 120
    pages.value = []
    currentPageIndex.value = 0
    selectedRootUri.value = null
    matchedReplyUris.value = new Set()
    matchedRootUris.value = new Set()
    error.value = null
    totalMatches.value = 0
    wrongSelection.value = null
  }

  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })

  return {
    gameState,
    handle,
    score,
    timeRemaining,
    pages,
    currentPageIndex,
    selectedRootUri,
    matchedReplyUris,
    matchedRootUris,
    error,
    totalMatches,
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
