import Link from 'next/link';
import React from 'react';
import { FaBlog, FaInfoCircle, FaEnvelope, FaUserCircle } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
        <a href="/" className="text-xl font-bold p-4 hover:bg-gray-700 cursor-pointer">
          Learn Next JS
        </a>
      <ul>
        <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
          <a href="/blog" className="flex items-center">
            <FaBlog className="mr-2" />
            Blog
          </a>
          
        </li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
          <a href="/about" className="flex items-center">
            <FaInfoCircle className="mr-2" />
            About
          </a>
        </li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
            <a href='/contact' className="flex items-center">
              <FaEnvelope className="mr-2" />
              Contact
            </a>
        </li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
            <a href='/user' className="flex items-center">
              <FaUserCircle className="mr-2" />
              User Management
            </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

