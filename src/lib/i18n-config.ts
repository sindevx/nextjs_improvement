export const i18n = {
    defaultLocale: 'th',
    locales: ['th', 'en', 'la'],
    localeDetection: false, 
  }

  export type Locale = (typeof i18n)['locales'][number]