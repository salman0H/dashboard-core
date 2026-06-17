import { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import i18n from '@/config/i18n'

export function useDirection(): void {
  const { lang, dir } = useAppContext()

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    document.documentElement.dataset['dir'] = dir

    const loadResources = async () => {
      await i18n.changeLanguage(lang)
      await i18n.reloadResources()
    }
    loadResources()
  }, [lang, dir])
}