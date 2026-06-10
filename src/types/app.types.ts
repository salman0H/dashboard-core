export type Lang = 'en' | 'fa'
export type Dir = 'ltr' | 'rtl'

export const LANG_TO_DIR: Record<Lang, Dir> = {
  en: 'ltr',
  fa: 'rtl',
}

export const SUPPORTED_LANGS: Lang[] = ['en', 'fa']
