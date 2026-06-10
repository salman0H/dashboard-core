import { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import i18n from '@/config/i18n'

/**
 * Syncs document.documentElement dir/lang with the active language.
 * Must be called once — at the root layout level.
 * All DOM writes are inside useEffect — never during render.
 */
export function useDirection(): void {
  const { lang, dir } = useAppContext()

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    document.documentElement.dataset['dir'] = dir

    // Tell i18next to switch language — triggers new locale file fetch
    // from /locales/{lang}/{ns}.json via Vite static serving.
    void i18n.changeLanguage(lang)
  }, [lang, dir])
}
