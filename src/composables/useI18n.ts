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
    "app.subtitle": "Match replies to their original posts. Pick a game mode, choose a difficulty, and see how well you know the conversation.",
    "app.placeholder": "username.bsky.social",
    "app.start": "Start Game",
    "app.loading": "Fetching posts and replies...",
    "app.feedback": "Feedback",

    "mode.time": "Time",
    "mode.challenge": "Challenge",
    "mode.time.desc": "Score as many matches as possible within the time limit.",
    "mode.challenge.desc": "Match a fixed number of posts. No time limit, but mistakes cost points.",

    "time.quick": "Quick",
    "time.quick.detail": "1 min",
    "time.moderate": "Moderate",
    "time.moderate.detail": "3 min",
    "time.long": "Long",
    "time.long.detail": "5 min",

    "challenge.easy": "Easy",
    "challenge.easy.detail": "5 posts",
    "challenge.medium": "Medium",
    "challenge.medium.detail": "10 posts",
    "challenge.hard": "Hard",
    "challenge.hard.detail": "25 posts",
    "challenge.extreme": "Extreme",
    "challenge.extreme.detail": "50 posts",

    "game.posts": "Posts",
    "game.replies": "Replies",
    "game.hintSelect": "Select a post on the left to start matching",
    "game.hintSelectStacked": "Select a post above to start matching",
    "game.hintMatch": "Now select the replies that belong to the highlighted post",
    "game.pts": "{score} pts",
    "game.elapsed": "Elapsed",
    "game.timesUp": "Time's Up!",
    "game.challengeComplete": "Challenge Complete!",
    "game.points": "points",
    "game.matched": "You matched {count} replies for @{handle}",
    "game.mistakes": "{count} mistakes",
    "game.inTime": "in {time}",
    "game.playAgain": "Play Again",
    "game.share": "Share",
    "game.shareText": "I scored {score} pts matching {count} replies from @{handle} on Bluesky Memo!",
    "game.copied": "Copied to clipboard!",

    "error.notEnoughPosts": "This user doesn't have enough posts with replies to play the game. Try a more active account.",
    "error.notEnoughReplies": "Not enough posts with visible replies found. Try a more active account.",
    "error.unexpected": "An unexpected error occurred",
  },
  de: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Ordne Antworten ihren ursprünglichen Posts zu. Wähle einen Spielmodus, eine Schwierigkeit und zeige, wie gut du die Konversation kennst.",
    "app.placeholder": "benutzername.bsky.social",
    "app.start": "Spiel starten",
    "app.loading": "Posts und Antworten werden geladen...",
    "app.feedback": "Feedback",

    "mode.time": "Zeit",
    "mode.challenge": "Herausforderung",
    "mode.time.desc": "Erziele so viele Treffer wie möglich innerhalb des Zeitlimits.",
    "mode.challenge.desc": "Ordne eine feste Anzahl an Posts zu. Kein Zeitlimit, aber Fehler kosten Punkte.",

    "time.quick": "Schnell",
    "time.quick.detail": "1 Min.",
    "time.moderate": "Mittel",
    "time.moderate.detail": "3 Min.",
    "time.long": "Lang",
    "time.long.detail": "5 Min.",

    "challenge.easy": "Leicht",
    "challenge.easy.detail": "5 Posts",
    "challenge.medium": "Mittel",
    "challenge.medium.detail": "10 Posts",
    "challenge.hard": "Schwer",
    "challenge.hard.detail": "25 Posts",
    "challenge.extreme": "Extrem",
    "challenge.extreme.detail": "50 Posts",

    "game.posts": "Posts",
    "game.replies": "Antworten",
    "game.hintSelect": "Wähle links einen Post aus, um mit dem Zuordnen zu beginnen",
    "game.hintSelectStacked": "Wähle oben einen Post aus, um mit dem Zuordnen zu beginnen",
    "game.hintMatch": "Wähle jetzt die Antworten, die zum markierten Post gehören",
    "game.pts": "{score} Pkt.",
    "game.elapsed": "Dauer",
    "game.timesUp": "Zeit abgelaufen!",
    "game.challengeComplete": "Herausforderung geschafft!",
    "game.points": "Punkte",
    "game.matched": "Du hast {count} Antworten für @{handle} zugeordnet",
    "game.mistakes": "{count} Fehler",
    "game.inTime": "in {time}",
    "game.playAgain": "Nochmal spielen",
    "game.share": "Teilen",
    "game.shareText": "Ich habe {score} Pkt. erzielt und {count} Antworten von @{handle} bei Bluesky Memo zugeordnet!",
    "game.copied": "In die Zwischenablage kopiert!",

    "error.notEnoughPosts": "Dieser Nutzer hat nicht genug Posts mit Antworten für das Spiel. Versuche einen aktiveren Account.",
    "error.notEnoughReplies": "Nicht genug Posts mit sichtbaren Antworten gefunden. Versuche einen aktiveren Account.",
    "error.unexpected": "Ein unerwarteter Fehler ist aufgetreten",
  },
  fr: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Associez les réponses à leurs posts d'origine. Choisissez un mode de jeu, une difficulté, et montrez que vous connaissez la conversation.",
    "app.placeholder": "utilisateur.bsky.social",
    "app.start": "Commencer",
    "app.loading": "Chargement des posts et réponses...",
    "app.feedback": "Feedback",

    "mode.time": "Temps",
    "mode.challenge": "Défi",
    "mode.time.desc": "Associez un maximum de réponses dans le temps imparti.",
    "mode.challenge.desc": "Associez un nombre fixe de posts. Pas de limite de temps, mais les erreurs coûtent des points.",

    "time.quick": "Rapide",
    "time.quick.detail": "1 min",
    "time.moderate": "Modéré",
    "time.moderate.detail": "3 min",
    "time.long": "Long",
    "time.long.detail": "5 min",

    "challenge.easy": "Facile",
    "challenge.easy.detail": "5 posts",
    "challenge.medium": "Moyen",
    "challenge.medium.detail": "10 posts",
    "challenge.hard": "Difficile",
    "challenge.hard.detail": "25 posts",
    "challenge.extreme": "Extrême",
    "challenge.extreme.detail": "50 posts",

    "game.posts": "Posts",
    "game.replies": "Réponses",
    "game.hintSelect": "Sélectionnez un post à gauche pour commencer",
    "game.hintSelectStacked": "Sélectionnez un post ci-dessus pour commencer",
    "game.hintMatch": "Sélectionnez maintenant les réponses qui appartiennent au post mis en évidence",
    "game.pts": "{score} pts",
    "game.elapsed": "Durée",
    "game.timesUp": "Temps écoulé !",
    "game.challengeComplete": "Défi terminé !",
    "game.points": "points",
    "game.matched": "Vous avez associé {count} réponses pour @{handle}",
    "game.mistakes": "{count} erreurs",
    "game.inTime": "en {time}",
    "game.playAgain": "Rejouer",
    "game.share": "Partager",
    "game.shareText": "J'ai obtenu {score} pts en associant {count} réponses de @{handle} sur Bluesky Memo !",
    "game.copied": "Copié dans le presse-papiers !",

    "error.notEnoughPosts": "Cet utilisateur n'a pas assez de posts avec des réponses pour jouer. Essayez un compte plus actif.",
    "error.notEnoughReplies": "Pas assez de posts avec des réponses visibles. Essayez un compte plus actif.",
    "error.unexpected": "Une erreur inattendue s'est produite",
  },
  es: {
    "app.title": "Bluesky Memo",
    "app.subtitle": "Asocia las respuestas con sus publicaciones originales. Elige un modo de juego, una dificultad y demuestra lo bien que conoces la conversación.",
    "app.placeholder": "usuario.bsky.social",
    "app.start": "Empezar",
    "app.loading": "Cargando publicaciones y respuestas...",
    "app.feedback": "Feedback",

    "mode.time": "Tiempo",
    "mode.challenge": "Desafío",
    "mode.time.desc": "Consigue tantas asociaciones como puedas dentro del límite de tiempo.",
    "mode.challenge.desc": "Asocia un número fijo de publicaciones. Sin límite de tiempo, pero los errores cuestan puntos.",

    "time.quick": "Rápido",
    "time.quick.detail": "1 min",
    "time.moderate": "Moderado",
    "time.moderate.detail": "3 min",
    "time.long": "Largo",
    "time.long.detail": "5 min",

    "challenge.easy": "Fácil",
    "challenge.easy.detail": "5 posts",
    "challenge.medium": "Medio",
    "challenge.medium.detail": "10 posts",
    "challenge.hard": "Difícil",
    "challenge.hard.detail": "25 posts",
    "challenge.extreme": "Extremo",
    "challenge.extreme.detail": "50 posts",

    "game.posts": "Publicaciones",
    "game.replies": "Respuestas",
    "game.hintSelect": "Selecciona una publicación a la izquierda para empezar",
    "game.hintSelectStacked": "Selecciona una publicación de arriba para empezar",
    "game.hintMatch": "Ahora selecciona las respuestas que pertenecen a la publicación destacada",
    "game.pts": "{score} pts",
    "game.elapsed": "Tiempo",
    "game.timesUp": "¡Se acabó el tiempo!",
    "game.challengeComplete": "¡Desafío completado!",
    "game.points": "puntos",
    "game.matched": "Asociaste {count} respuestas para @{handle}",
    "game.mistakes": "{count} errores",
    "game.inTime": "en {time}",
    "game.playAgain": "Jugar de nuevo",
    "game.share": "Compartir",
    "game.shareText": "Conseguí {score} pts asociando {count} respuestas de @{handle} en Bluesky Memo!",
    "game.copied": "Copiado al portapapeles!",

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
