// src/app/components/Header.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaGlobe, FaCaretDown } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  
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


  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow-md p-4 z-10">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:text-gray-600"
              onClick={toggleLanguagePopup}
            >
              <FaGlobe className="text-xl" />
              <span className="text-sm">{selectedLanguage}</span>
            </button>
            
            {isLanguagePopupOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                <ul className="text-sm">
                  {["English", "Thai", "Spanish"].map((lang) => (
                    <li
                      key={lang}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile & Logout */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:text-gray-600"
              onClick={toggleProfilePopup}
            >
              <FaUserCircle className="text-xl" />
              <span className="text-sm">Admin</span>
              <FaCaretDown className="text-sm" />
            </button>

            {isProfilePopupOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => router.push('/profile')}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => router.push('/settings')}
                >
                  Setting
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
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