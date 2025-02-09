"use client"
// hooks/useLanguage.ts
import { useCallback, useState, useEffect } from 'react'
import { useRouter, usePathname, useParams } from 'next/navigation'

import th from '@/locales/th/common.json'
import en from '@/locales/en/common.json'
import jp from '@/locales/jp/common.json'
import la from '@/locales/la/common.json'

// สร้าง type สำหรับ dictionary
type NestedDictionary = {
  [key: string]: string | NestedDictionary
}

const dictionaries = {
  th,
  en,
  jp,
  la,
} as const

type Locale = keyof typeof dictionaries

export function useLanguage() {
  const router = useRouter()
  const pathname = usePathname()

  const params = useParams();
  const [language, setLanguage] = useState(params.locale || 'en');

  useEffect(() => {
    if (params.locale) {
      setLanguage(params.locale);
    }
  }, [params.locale]);

  const getCurrentLocale = useCallback(() => {
    const segments = pathname.split('/')
    return (segments[1] as Locale) || 'th'
  }, [pathname])

  const changeLanguage = useCallback(async (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`

    router.push(newPath)
  }, [pathname, router])

  // แก้ไขฟังก์ชัน t โดยใช้ NestedDictionary type แทน any
  const t = useCallback((key: string) => {
    try {
      const currentLocale = getCurrentLocale()
      const dictionary = dictionaries[currentLocale] || dictionaries.th

      const value = key.split('.').reduce((obj: NestedDictionary, k: string) => {
        return (obj?.[k] as NestedDictionary) ?? {}
      }, dictionary as unknown as NestedDictionary)

      return typeof value === 'string' ? value : key
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