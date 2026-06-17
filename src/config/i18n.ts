import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const savedLang = localStorage.getItem('lang') ?? 'en'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: 'en',
    ns: ['common', 'nav', 'dashboard', 'flow', 'tree', 'substation'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-store',
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    cache: { enabled: false },
  })

export default i18n