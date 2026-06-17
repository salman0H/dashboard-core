import { Segmented } from 'antd'
import { useAppContext } from '@/context/AppContext'
import type { Lang } from '@/types/app.types'
import { SUPPORTED_LANGS } from '@/types/app.types'
import i18n from '@/config/i18n'

const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  fa: 'FA',
}

export function LanguageSwitcher() {
  const { lang, setLang } = useAppContext()

  const handleChange = async (value: Lang) => {
    setLang(value)
    await i18n.changeLanguage(value)
    await i18n.reloadResources()
  }

  return (
    <Segmented
      options={SUPPORTED_LANGS.map((l) => ({
        label: LANG_LABELS[l],
        value: l,
      }))}
      value={lang}
      onChange={handleChange}
      size="small"
      className="!bg-app-bg !border !border-border !rounded-full"
    />
  )
}