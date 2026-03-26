import { ref, computed } from "vue"

export type Locale = "en" | "de" | "fr" | "es"

export const availableLocales: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
]

const messages: Record<Locale, Record<string, string>> = {
  en: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Match replies to their original posts before time runs out. Each correct match scores 10 points. You have 120 seconds.",
    "app.placeholder": "username.bsky.social",
    "app.start": "Start Game",
    "app.loading": "Fetching posts and replies...",
    "game.posts": "Posts",
    "game.replies": "Replies",
    "game.hintSelect": "Select a post on the left to start matching",
    "game.hintMatch": "Now select the replies that belong to the highlighted post",
    "game.pts": "{score} pts",
    "game.timesUp": "Time's Up!",
    "game.points": "points",
    "game.matched": "You matched {count} replies for @{handle}",
    "game.playAgain": "Play Again",
    "error.notEnoughPosts": "This user doesn't have enough posts with replies to play the game. Try a more active account.",
    "error.notEnoughReplies": "Not enough posts with visible replies found. Try a more active account.",
    "error.unexpected": "An unexpected error occurred",
  },
  de: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Ordne Antworten ihren ursprünglichen Posts zu, bevor die Zeit abläuft. Jede richtige Zuordnung bringt 10 Punkte. Du hast 120 Sekunden.",
    "app.placeholder": "benutzername.bsky.social",
    "app.start": "Spiel starten",
    "app.loading": "Posts und Antworten werden geladen...",
    "game.posts": "Posts",
    "game.replies": "Antworten",
    "game.hintSelect": "Wähle links einen Post aus, um mit dem Zuordnen zu beginnen",
    "game.hintMatch": "Wähle jetzt die Antworten, die zum markierten Post gehören",
    "game.pts": "{score} Pkt.",
    "game.timesUp": "Zeit abgelaufen!",
    "game.points": "Punkte",
    "game.matched": "Du hast {count} Antworten für @{handle} zugeordnet",
    "game.playAgain": "Nochmal spielen",
    "error.notEnoughPosts": "Dieser Nutzer hat nicht genug Posts mit Antworten für das Spiel. Versuche einen aktiveren Account.",
    "error.notEnoughReplies": "Nicht genug Posts mit sichtbaren Antworten gefunden. Versuche einen aktiveren Account.",
    "error.unexpected": "Ein unerwarteter Fehler ist aufgetreten",
  },
  fr: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Associez les réponses à leurs posts d'origine avant la fin du temps imparti. Chaque bonne association rapporte 10 points. Vous avez 120 secondes.",
    "app.placeholder": "utilisateur.bsky.social",
    "app.start": "Commencer",
    "app.loading": "Chargement des posts et réponses...",
    "game.posts": "Posts",
    "game.replies": "Réponses",
    "game.hintSelect": "Sélectionnez un post à gauche pour commencer",
    "game.hintMatch": "Sélectionnez maintenant les réponses qui appartiennent au post mis en évidence",
    "game.pts": "{score} pts",
    "game.timesUp": "Temps écoulé !",
    "game.points": "points",
    "game.matched": "Vous avez associé {count} réponses pour @{handle}",
    "game.playAgain": "Rejouer",
    "error.notEnoughPosts": "Cet utilisateur n'a pas assez de posts avec des réponses pour jouer. Essayez un compte plus actif.",
    "error.notEnoughReplies": "Pas assez de posts avec des réponses visibles. Essayez un compte plus actif.",
    "error.unexpected": "Une erreur inattendue s'est produite",
  },
  es: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Asocia las respuestas con sus publicaciones originales antes de que se acabe el tiempo. Cada acierto vale 10 puntos. Tienes 120 segundos.",
    "app.placeholder": "usuario.bsky.social",
    "app.start": "Empezar",
    "app.loading": "Cargando publicaciones y respuestas...",
    "game.posts": "Publicaciones",
    "game.replies": "Respuestas",
    "game.hintSelect": "Selecciona una publicación a la izquierda para empezar",
    "game.hintMatch": "Ahora selecciona las respuestas que pertenecen a la publicación destacada",
    "game.pts": "{score} pts",
    "game.timesUp": "¡Se acabó el tiempo!",
    "game.points": "puntos",
    "game.matched": "Asociaste {count} respuestas para @{handle}",
    "game.playAgain": "Jugar de nuevo",
    "error.notEnoughPosts": "Este usuario no tiene suficientes publicaciones con respuestas para jugar. Prueba con una cuenta más activa.",
    "error.notEnoughReplies": "No se encontraron suficientes publicaciones con respuestas visibles. Prueba con una cuenta más activa.",
    "error.unexpected": "Ocurrió un error inesperado",
  },
}

function detectLocale(): Locale {
  const saved = localStorage.getItem("bsky-memo-locale") as Locale | null
  if (saved && saved in messages) return saved

  const browserLang = navigator.language.slice(0, 2)
  if (browserLang in messages) return browserLang as Locale

  return "en"
}

const locale = ref<Locale>(detectLocale())

export function useI18n() {
  function setLocale(newLocale: Locale) {
    locale.value = newLocale
    localStorage.setItem("bsky-memo-locale", newLocale)
    document.documentElement.lang = newLocale
  }

  function t(key: string, params?: Record<string, string | number>): string {
    let text = messages[locale.value]?.[key] ?? messages.en[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  return {
    locale: computed(() => locale.value),
    setLocale,
    t,
    availableLocales,
  }
}
