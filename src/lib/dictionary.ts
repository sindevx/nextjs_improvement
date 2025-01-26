// // lib/dictionary.ts
// import type { Locale } from './i18n-config'

// const dictionaries = {
//   th: () => import('@/locales/dictionaries/th.json').then((module) => module.default),
//   en: () => import('@/locales/dictionaries/en.json').then((module) => module.default),
//   jp: () => import('@/locales/dictionaries/jp.json').then((module) => module.default),
//   la: () => import('@/locales/dictionaries/jp.json').then((module) => module.default),
// }

// export const getDictionary = async (locale: keyof typeof dictionaries) => dictionaries[locale]()