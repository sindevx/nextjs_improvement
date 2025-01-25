'use client'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

export const useLanguage = () => {
    const { t, i18n } = useTranslation('common')
    const router = useRouter()

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
        // อัพเดท URL หรือ state อื่นๆ ตามต้องการ
    }

    return {
        t,
        currentLanguage: i18n.language,
        changeLanguage
    }
}