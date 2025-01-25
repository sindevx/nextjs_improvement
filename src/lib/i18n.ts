import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

// นำเข้าไฟล์แปลภาษา
import laTranslation from '@/locales/en/common.json'
import enTranslation from '@/locales/en/common.json'

i18next
    .use(initReactI18next)
    .init({
        resources: {
            la: {
                common: laTranslation
            },
            en: {
                common: enTranslation
            }
        },
        lng: 'en', // ภาษาเริ่มต้น
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })

export default i18next