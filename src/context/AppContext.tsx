import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Lang, Dir } from '@/types/app.types'
import { LANG_TO_DIR } from '@/types/app.types'

interface AppContextValue {
  lang: Lang
  dir: Dir
  setLang: (lang: Lang) => void
}

// Context is initialized with a sentinel — consumers must be inside AppProvider.
const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang | null) ?? 'en'
  )

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem('lang', next)
  }, [])

  const dir: Dir = LANG_TO_DIR[lang]

  const value: AppContextValue = { lang, dir, setLang }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook — throws if used outside provider (fast failure).
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>')
  return ctx
}
