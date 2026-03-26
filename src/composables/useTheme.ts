import { ref, watch } from "vue"

export type Theme = "light" | "dark"

function detectTheme(): Theme {
  const saved = localStorage.getItem("bsky-memo-theme") as Theme | null
  if (saved === "light" || saved === "dark") return saved
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme)
}

const theme = ref<Theme>(detectTheme())
applyTheme(theme.value)

export function useTheme() {
  watch(theme, (val) => {
    applyTheme(val)
    localStorage.setItem("bsky-memo-theme", val)
  })

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light"
  }

  return {
    theme,
    toggleTheme,
  }
}
