<script setup lang="ts">
import { computed } from "vue"
import type { BskyPost } from "../types"

const props = defineProps<{
  post: BskyPost
  variant: "root" | "reply"
  selected?: boolean
  matched?: boolean
  disabled?: boolean
  wrong?: boolean
}>()

defineEmits<{
  click: []
}>()

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function escapeAttr(text: string): string {
  return text.replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

const renderedText = computed(() => {
  const text = props.post.record.text
  const facets = props.post.record.facets

  if (!facets || facets.length === 0) {
    return escapeHtml(text).replace(/\n/g, "<br>")
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const bytes = encoder.encode(text)
  const sorted = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart)

  let html = ""
  let cursor = 0

  for (const facet of sorted) {
    const before = decoder.decode(bytes.slice(cursor, facet.index.byteStart))
    html += escapeHtml(before).replace(/\n/g, "<br>")

    const facetText = escapeHtml(decoder.decode(bytes.slice(facet.index.byteStart, facet.index.byteEnd)))
    const feature = facet.features[0]

    if (feature?.$type === "app.bsky.richtext.facet#link" && feature.uri) {
      html += `<a class="facet-link" href="${escapeAttr(feature.uri)}" target="_blank" rel="noopener" @click.stop>${facetText}</a>`
    } else if (feature?.$type === "app.bsky.richtext.facet#mention") {
      html += `<span class="facet-mention">${facetText}</span>`
    } else if (feature?.$type === "app.bsky.richtext.facet#tag") {
      html += `<span class="facet-tag">${facetText}</span>`
    } else {
      html += facetText
    }

    cursor = facet.index.byteEnd
  }

  const remaining = decoder.decode(bytes.slice(cursor))
  html += escapeHtml(remaining).replace(/\n/g, "<br>")

  return html
})

const relativeTime = computed(() => {
  const now = Date.now()
  const then = new Date(props.post.record.createdAt).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return `${Math.floor(diff / 604800)}w`
})

const images = computed(() => {
  const embed = props.post.embed
  if (!embed) return []

  if (embed.$type === "app.bsky.embed.images#view") {
    return (embed as unknown as { images: Array<{ thumb: string; fullsize: string; alt: string }> }).images
  }

  if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
    const media = (embed as unknown as { media?: { $type: string; images?: Array<{ thumb: string; fullsize: string; alt: string }> } }).media
    if (media?.$type === "app.bsky.embed.images#view" && media.images) {
      return media.images
    }
  }

  return []
})

const externalEmbed = computed(() => {
  const embed = props.post.embed
  if (!embed) return null

  if (embed.$type === "app.bsky.embed.external#view") {
    return (embed as unknown as { external: { uri: string; title: string; description: string; thumb?: string } }).external
  }

  if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
    const media = (embed as unknown as { media?: { $type: string; external?: { uri: string; title: string; description: string; thumb?: string } } }).media
    if (media?.$type === "app.bsky.embed.external#view") {
      return media.external ?? null
    }
  }

  return null
})

function handleClick() {
  if (props.disabled || props.matched) return
}
</script>

<template>
  <article
    class="post-card"
    :class="[variant, { selected, matched, disabled, wrong }]"
    @click="handleClick(); $emit('click')"
    role="button"
    :tabindex="disabled || matched ? -1 : 0"
    @keydown.enter="handleClick(); $emit('click')"
  >
    <header class="post-card__header">
      <img :src="post.author.avatar" :alt="post.author.displayName" class="post-card__avatar" />
      <div class="post-card__author">
        <span class="post-card__name">{{ post.author.displayName || post.author.handle }}</span>
        <span class="post-card__handle">@{{ post.author.handle }}</span>
      </div>
      <time class="post-card__time">{{ relativeTime }}</time>
    </header>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="post-card__body" v-html="renderedText"></div>

    <div v-if="images.length" class="post-card__images" :class="{ 'single': images.length === 1 }">
      <img
        v-for="img in images"
        :key="img.thumb"
        :src="img.thumb"
        :alt="img.alt || 'Post image'"
        loading="lazy"
      />
    </div>

    <div v-if="externalEmbed" class="post-card__external">
      <img v-if="externalEmbed.thumb" :src="externalEmbed.thumb" :alt="externalEmbed.title" loading="lazy" />
      <div class="post-card__external-text">
        <strong>{{ externalEmbed.title }}</strong>
        <small>{{ externalEmbed.description }}</small>
      </div>
    </div>

    <footer class="post-card__footer">
      <span class="post-card__stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {{ post.replyCount }}
      </span>
      <span class="post-card__stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        {{ post.repostCount }}
      </span>
      <span class="post-card__stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        {{ post.likeCount }}
      </span>
    </footer>
  </article>
</template>

<style scoped>
.post-card {
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg);
  text-align: left;
  user-select: none;
}

.post-card:hover:not(.matched):not(.disabled) {
  border-color: var(--accent-border);
}

.post-card.root {
  border-left: 4px solid var(--accent);
}

.post-card.selected {
  border-color: var(--accent);
  background: var(--accent-bg);
  box-shadow: 0 0 0 1px var(--accent);
}

.post-card.matched {
  opacity: 0.45;
  pointer-events: none;
  border-color: var(--success);
  background: var(--success-bg);
}

.post-card.disabled:not(.matched) {
  opacity: 0.7;
  cursor: default;
}

.post-card.wrong {
  animation: shake 0.4s ease;
  border-color: var(--danger);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

.post-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.post-card__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.post-card__author {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 1px;
}

.post-card__name {
  font-weight: 600;
  color: var(--text-h);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-card__handle {
  color: var(--text);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-card__time {
  margin-left: auto;
  color: var(--text);
  font-size: 13px;
  flex-shrink: 0;
}

.post-card__body {
  line-height: 1.5;
  word-break: break-word;
  font-size: 14px;
  color: var(--text-h);
}

.post-card__body :deep(.facet-link) {
  color: var(--accent);
  text-decoration: none;
}

.post-card__body :deep(.facet-mention),
.post-card__body :deep(.facet-tag) {
  color: var(--accent);
}

.post-card__images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.post-card__images.single {
  grid-template-columns: 1fr;
}

.post-card__images img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
}

.post-card__external {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.post-card__external > img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.post-card__external-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.post-card__external-text strong {
  font-size: 13px;
  color: var(--text-h);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__external-text small {
  font-size: 12px;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__footer {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  font-size: 13px;
  color: var(--text);
}

.post-card__stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-card__stat svg {
  opacity: 0.6;
}
</style>
