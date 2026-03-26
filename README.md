# Bluesky Memo

A matching game built on Bluesky posts. Enter any Bluesky handle, and the app fetches their posts along with the replies to each one. Your job: match every reply to its parent post.

Repository: https://github.com/vinerima/bsky-memo

## How it works

1. Enter a Bluesky handle (e.g. `someone.bsky.social`)
2. Pick a game mode and difficulty
3. The app fetches the user's recent posts (excluding reposts and replies) and their direct replies via the public AT Protocol API
4. A game page shows up to 3 root posts on the left and their replies (shuffled, max 3 per post) on the right
5. Click a root post to select it, then click the replies that belong to it
6. Each correct match scores 10 points. Each wrong pick costs 5 points.
7. When all replies on a page are matched, the next page loads automatically

## Game modes

### Time

Race the clock. Score as many correct matches as possible before time runs out.

- Quick -- 1 minute
- Moderate -- 3 minutes
- Long -- 5 minutes

### Challenge

Complete a fixed number of posts. No time limit, but mistakes still cost points. Elapsed time is tracked.

- Easy -- 5 posts
- Medium -- 10 posts
- Hard -- 25 posts
- Extreme -- 50 posts

## Scoring

- Correct match: +10 points
- Wrong match: -5 points (score can go negative)

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)

## Setup

```sh
git clone https://github.com/vinerima/bsky-memo.git
cd bsky-memo
pnpm install
```

## Development

```sh
pnpm dev
```

Opens the app at `http://localhost:5173`.

## Build

```sh
pnpm build
```

Outputs a production bundle to `dist/`. Type-checks with `vue-tsc` before building.

## Preview production build

```sh
pnpm preview
```

## Project structure

```
src/
  App.vue                         Root component, state machine, settings bar
  main.ts                         App entry point
  style.css                       Global styles, CSS custom properties, light/dark theme
  types.ts                        TypeScript interfaces, game mode configs, constants
  composables/
    useBlueskyApi.ts              Bluesky public API calls (resolve handle, fetch posts, fetch replies)
    useGameState.ts               Game engine (modes, timer, scoring, page management, matching)
    useI18n.ts                    Internationalization (en, de, fr, es)
    useTheme.ts                   Light/dark theme toggle with localStorage persistence
  components/
    HandleInput.vue               Start screen with handle input, mode and difficulty selection
    GameBoard.vue                 Two-column game layout with timer and score
    PostCard.vue                  Individual post card with rich text, images, embeds
    GameOver.vue                  Final score, stats, and play-again screen
    LoadingSpinner.vue            Loading indicator
```

## Features

- Two game modes: timed and challenge (fixed post count)
- No authentication required -- uses the public Bluesky API (`public.api.bsky.app`)
- Posts render with avatars, display names, rich text (links, mentions, hashtags via byte-accurate facet parsing), image thumbnails, external link cards, and engagement counts
- Max 3 replies per root post to keep the board readable
- Reposts are filtered out client-side (the API's `posts_no_replies` filter does not exclude them)
- Reply fetching is batched (5 concurrent requests) to stay within rate limits
- Light and dark theme with system preference detection and manual toggle
- Localized in English (default), German, French, and Spanish
- Language and theme preferences persist in localStorage
- Responsive two-column layout that collapses to single column on narrow screens

## API endpoints used

All requests go to `https://public.api.bsky.app/xrpc/` with no authentication.

| Endpoint                              | Purpose                                                |
| ------------------------------------- | ------------------------------------------------------ |
| `com.atproto.identity.resolveHandle`  | Resolve a handle to a DID                              |
| `app.bsky.feed.getAuthorFeed`         | Fetch a user's posts (with `filter=posts_no_replies`)  |
| `app.bsky.feed.getPostThread`         | Fetch direct replies to a post (`depth=1`)             |

## Tech stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript (strict mode)
- Vite 8

No external UI libraries, state management, or i18n packages. Everything is built with Vue composables and plain CSS custom properties.

## License

MIT
