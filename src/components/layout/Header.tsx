// Header.tsx
'use client';
import React, { useState } from 'react';
import { FaUserCircle, FaGlobe } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const toggleLanguagePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguagePopupOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow-md p-4 z-10">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <FaUserCircle className="text-2xl cursor-pointer" />
          
          {/* Language Selector */}
          <div className="relative">
            <FaGlobe
              className="text-2xl cursor-pointer"
              onClick={toggleLanguagePopup}
            />
            {isLanguagePopupOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-md">
                <ul className="text-sm">
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleLanguageChange("English")}
                  >
                    English
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleLanguageChange("Thai")}
                  >
                    Thai
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleLanguageChange("Spanish")}
                  >
                    Spanish
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Selected Language */}
          <div className="text-sm">{selectedLanguage}</div>
          
          {/* Profile & Logout */}
          <div>Profile | Logout</div>
        </div>
      </div>
    </header>
  );
};

export default Header;