import { useAppContext } from '@/context/AppContext'
import type { Lang } from '@/types/app.types'
import { SUPPORTED_LANGS } from '@/types/app.types'

const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  fa: 'FA',
}

/**
 * Pure component — output is a function of context only.
 * No local state; calls setLang from context on click.
 */
export function LanguageSwitcher() {
  const { lang, setLang } = useAppContext()

  return (
    <div
      className="flex bg-app-bg border border-border rounded-full overflow-hidden"
      role="group"
      aria-label="Language switcher"
    >
      {SUPPORTED_LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-0.5 text-xs font-medium transition-colors border-none cursor-pointer
            ${lang === l
              ? 'bg-accent text-white rounded-full'
              : 'bg-transparent text-slate-500 hover:text-slate-900'
            }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
