# Bluesky Memo

A timed matching game built on Bluesky posts. Enter any Bluesky handle, and the app fetches their posts along with the replies to each one. Your job: match every reply to its parent post before the clock runs out.

Repository: https://github.com/vinerima/bsky-memo

## How it works

1. Enter a Bluesky handle (e.g. `someone.bsky.social`)
2. The app fetches the user's recent posts (excluding reposts and replies) and their direct replies via the public AT Protocol API
3. A game page shows 3 root posts on the left and all their replies (shuffled) on the right
4. Click a root post to select it, then click the replies that belong to it
5. Each correct match scores 10 points. Wrong picks shake but don't deduct points.
6. When all replies on a page are matched, the next page loads automatically
7. The game ends after 120 seconds

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
  types.ts                        TypeScript interfaces (BskyPost, GamePage, etc.)
  composables/
    useBlueskyApi.ts              Bluesky public API calls (resolve handle, fetch posts, fetch replies)
    useGameState.ts               Game engine (timer, scoring, page management, matching logic)
    useI18n.ts                    Internationalization (en, de, fr, es)
    useTheme.ts                   Light/dark theme toggle with localStorage persistence
  components/
    HandleInput.vue               Start screen with handle input
    GameBoard.vue                 Two-column game layout with timer and score
    PostCard.vue                  Individual post card with rich text, images, embeds
    GameOver.vue                  Final score and play-again screen
    LoadingSpinner.vue            Loading indicator
```

## Features

- No authentication required -- uses the public Bluesky API (`public.api.bsky.app`)
- Posts render with avatars, display names, rich text (links, mentions, hashtags via byte-accurate facet parsing), image thumbnails, external link cards, and engagement counts
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
