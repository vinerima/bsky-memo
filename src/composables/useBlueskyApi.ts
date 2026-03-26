import type { BskyPost, FeedItem } from "../types"

const API_BASE = "https://public.api.bsky.app/xrpc"

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}/${path}`)
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`API error ${response.status}: ${body || response.statusText}`)
  }
  return response.json() as Promise<T>
}

export function useBlueskyApi() {
  async function resolveHandle(handle: string): Promise<string> {
    const data = await apiGet<{ did: string }>(
      `com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`
    )
    return data.did
  }

  async function fetchAuthorPosts(actor: string, minPosts = 3): Promise<BskyPost[]> {
    const posts: BskyPost[] = []
    let cursor: string | undefined

    for (let page = 0; page < 3; page++) {
      const params = new URLSearchParams({
        actor,
        filter: "posts_no_replies",
        limit: "50",
      })
      if (cursor) {
        params.set("cursor", cursor)
      }

      const data = await apiGet<{ feed: FeedItem[]; cursor?: string }>(
        `app.bsky.feed.getAuthorFeed?${params.toString()}`
      )

      const filtered = data.feed
        .filter((item) => item.reason?.$type !== "app.bsky.feed.defs#reasonRepost")
        .filter((item) => item.post.replyCount > 0)
        .map((item) => item.post)

      posts.push(...filtered)

      if (!data.cursor || posts.length >= minPosts) {
        break
      }
      cursor = data.cursor
    }

    if (posts.length < minPosts) {
      throw new Error(
        "This user doesn't have enough posts with replies to play the game. Try a more active account."
      )
    }

    return posts
  }

  async function fetchReplies(postUri: string): Promise<BskyPost[]> {
    const data = await apiGet<{
      thread: {
        replies?: Array<{ $type: string; post?: BskyPost }>
      }
    }>(`app.bsky.feed.getPostThread?uri=${encodeURIComponent(postUri)}&depth=1`)

    if (!data.thread.replies) {
      return []
    }

    return data.thread.replies
      .filter((r) => r.$type === "app.bsky.feed.defs#threadViewPost" && r.post)
      .map((r) => r.post as BskyPost)
  }

  async function fetchRepliesBatched(
    postUris: string[],
    concurrency = 5
  ): Promise<Map<string, BskyPost[]>> {
    const results = new Map<string, BskyPost[]>()
    const chunks: string[][] = []

    for (let i = 0; i < postUris.length; i += concurrency) {
      chunks.push(postUris.slice(i, i + concurrency))
    }

    for (const chunk of chunks) {
      const batchResults = await Promise.all(
        chunk.map(async (uri) => {
          const replies = await fetchReplies(uri)
          return { uri, replies }
        })
      )
      for (const { uri, replies } of batchResults) {
        results.set(uri, replies)
      }
    }

    return results
  }

  return {
    resolveHandle,
    fetchAuthorPosts,
    fetchReplies,
    fetchRepliesBatched,
  }
}
