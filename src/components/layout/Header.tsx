'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaGlobe, FaCaretDown } from 'react-icons/fa';
import { useLanguage } from '@/hooks/useLanguage';

interface Language {
  code: Locale;
  name: string;
  flag: string;
  localName: string;
}

import th from '@/locales/th/common.json'
import en from '@/locales/en/common.json'
import jp from '@/locales/jp/common.json'
import la from '@/locales/la/common.json'

const dictionaries = {
  th,
  en,
  jp,
  la,
} as const

type Locale = keyof typeof dictionaries

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    localName: 'English'
  },
  {
    code: 'th',
    name: 'ไทย',
    flag: '🇹🇭',
    localName: 'ไทย'
  },
  {
    code: 'la',
    name: 'ລາວ',
    flag: '🇱🇦',
    localName: 'ລາວ'
  },
  {
    code: 'jp',
    name: '日本語',
    flag: '🇯🇵',
    localName: '日本語'
  }
];

const Header: React.FC = () => {
  const { t, currentLocale, changeLanguage } = useLanguage();
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const router = useRouter();

  const getCurrentLanguageDetails = () => {
    return languages.find(lang => lang.code === currentLocale) || languages[0];
  };

  const toggleLanguagePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
    setIsProfilePopupOpen(false);
  };

  const toggleProfilePopup = () => {
    setIsProfilePopupOpen(!isProfilePopupOpen);
    setIsLanguagePopupOpen(false);
  };

  const handleLanguageChange = (languageCode: Locale) => {
    changeLanguage(languageCode as Locale);
    setIsLanguagePopupOpen(false);
  };

  const handleLogout = async () => {
    const res = await fetch('/api/auth', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      router.push('/login');
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsLanguagePopupOpen(false);
        setIsProfilePopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = getCurrentLanguageDetails();

  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow-md z-50">
      <div className="flex justify-between items-center h-16 px-6">
        <h2 className="text-lg font-bold text-gray-800">{t('header.dashboard')}</h2>

        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-2 hover:text-gray-600 py-2 px-3 rounded-md hover:bg-gray-50"
              onClick={toggleLanguagePopup}
            >
              {/* <FaGlobe className="text-xl" /> */}
              <span className="text-sm flex items-center">
                <span className="mr-2">{currentLang.flag}</span>
                {currentLang.name}
              </span>
            </button>

            {isLanguagePopupOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-xl">{lang.flag}</span>
                      {lang.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {lang.localName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile & Logout */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-2 hover:text-gray-600 py-2 px-3 rounded-md hover:bg-gray-50"
              onClick={toggleProfilePopup}
            >
              <FaUserCircle className="text-xl" />
              <span className="text-sm">Admin</span>
              <FaCaretDown className={`text-sm transition-transform duration-200 ${isProfilePopupOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfilePopupOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => router.push('/profile')}
                >
                  {t('header.profile')}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => router.push('/settings')}
                >
                  {t('header.settings')}
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;