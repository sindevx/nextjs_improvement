// // hooks/useLanguage.ts
// import { useCallback } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { getDictionary } from '@/lib/dictionary'

// export function useLanguage() {
//   const router = useRouter()
//   const pathname = usePathname()
  
//   // ดึงภาษาปัจจุบันจาก pathname
//   const getCurrentLocale = useCallback(() => {
//     const segments = pathname.split('/')
//     return segments[1] || 'th' // default to 'th' if no locale in path
//   }, [pathname])

//   // ฟังก์ชันสำหรับเปลี่ยนภาษา
//   const changeLanguage = useCallback(async (newLocale: string) => {
//     const segments = pathname.split('/')
//     segments[1] = newLocale
//     const newPath = segments.join('/')
    
//     // บันทึกภาษาที่เลือกลง cookie
//     document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    
//     router.push(newPath)
//   }, [pathname, router])

//   // ฟังก์ชันสำหรับแปลข้อความ
//   const t = useCallback((key: string) => {
//     // Return key immediately as fallback while dictionary loads
//     return key
//   }, [getCurrentLocale])

//   return {
//     currentLocale: getCurrentLocale(),
//     changeLanguage,
//     t
//   }
// }

// hooks/useLanguage.ts
import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// นำเข้าไฟล์แปลโดยตรง
import th from '@/locales/th/common.json'
import en from '@/locales/en/common.json'

const dictionaries = {
  th,
  en
} as const

type Locale = keyof typeof dictionaries

export function useLanguage() {
  const router = useRouter()
  const pathname = usePathname()
  
  // ดึงภาษาปัจจุบันจาก pathname
  const getCurrentLocale = useCallback(() => {
    const segments = pathname.split('/')
    return (segments[1] as Locale) || 'th'
  }, [pathname])

  // ฟังก์ชันสำหรับเปลี่ยนภาษา
  const changeLanguage = useCallback(async (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    // บันทึกภาษาที่เลือกลง cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    
    router.push(newPath)
  }, [pathname, router])

  // ฟังก์ชันสำหรับแปลข้อความแบบ synchronous
  const t = useCallback((key: string) => {
    try {
      const currentLocale = getCurrentLocale()
      const dictionary = dictionaries[currentLocale] || dictionaries.th
      
      // แยก key ด้วยจุด และหาค่าใน dictionary
      const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], dictionary)
      return value || key
    } catch (error) {
      console.error('Translation error:', error)
      return key
    }
  }, [getCurrentLocale])

  return {
    currentLocale: getCurrentLocale(),
    changeLanguage,
    t
  }
}