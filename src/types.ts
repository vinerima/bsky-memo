export interface BskyAuthor {
  did: string
  handle: string
  displayName: string
  avatar: string
}

export interface BskyFacetFeature {
  $type: string
  uri?: string
  did?: string
  tag?: string
}

export interface BskyFacet {
  index: { byteStart: number; byteEnd: number }
  features: BskyFacetFeature[]
}

export interface BskyPostRecord {
  text: string
  createdAt: string
  facets?: BskyFacet[]
  langs?: string[]
}

export interface BskyPost {
  uri: string
  cid: string
  author: BskyAuthor
  record: BskyPostRecord
  embed?: { $type: string } & Record<string, unknown>
  likeCount: number
  replyCount: number
  repostCount: number
  indexedAt: string
}

export interface FeedItem {
  post: BskyPost
  reason?: { $type: string }
}

export interface GamePage {
  rootPosts: BskyPost[]
  shuffledReplies: BskyPost[]
  replyToRootMap: Map<string, string>
}

export type GameState = "idle" | "loading" | "playing" | "gameOver"
