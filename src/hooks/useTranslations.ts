// import { useState, useEffect } from 'react'
// import { useLanguage } from './useLanguage'
// import { getDictionary } from '@/lib/dictionary'

// export function useTranslations() {
//   const { currentLocale } = useLanguage()
//   const [translations, setTranslations] = useState({})

//   useEffect(() => {
//     getDictionary(currentLocale as 'th' | 'en' | 'la')
//       .then(setTranslations)
//   }, [currentLocale])

//   return translations
// } 