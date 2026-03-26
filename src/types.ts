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

export type GameMode = "time" | "challenge"

export type TimeDifficulty = "quick" | "moderate" | "long"
export type ChallengeDifficulty = "easy" | "medium" | "hard" | "extreme"

export interface GameConfig {
  mode: GameMode
  timeDifficulty?: TimeDifficulty
  challengeDifficulty?: ChallengeDifficulty
}

export const TIME_LIMITS: Record<TimeDifficulty, number> = {
  quick: 60,
  moderate: 180,
  long: 300,
}

export const CHALLENGE_COUNTS: Record<ChallengeDifficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 25,
  extreme: 50,
}

export const MAX_REPLIES_PER_POST = 3
