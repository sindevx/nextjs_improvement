// components/Header.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaGlobe, FaCaretDown } from 'react-icons/fa';
import { useLanguage } from '@/hooks/useLanguage';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  //log selectedLanguage
  console.log('selectedLanguage', selectedLanguage);

  const router = useRouter();

  const toggleLanguagePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
    setIsProfilePopupOpen(false);
  };

  const toggleProfilePopup = () => {
    setIsProfilePopupOpen(!isProfilePopupOpen);
    setIsLanguagePopupOpen(false);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
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
                <FaGlobe className="text-xl" />
                <span className="text-sm">{t('header.language')}</span>
              </button>

              {isLanguagePopupOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    {["English", "Thai", "Spanish"].map((lang) => (
                        <button
                            key={lang}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                            onClick={() => handleLanguageChange(lang)}
                        >
                          {lang}
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