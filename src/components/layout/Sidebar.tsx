"use client"

import React from 'react';
import {FaBlog, FaInfoCircle, FaEnvelope, FaUserCircle, FaNewspaper} from 'react-icons/fa';
import Link from "next/link";
import { useLanguage } from '@/hooks/useLanguage';

const Sidebar: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="w-64 h-screen bg-gray-800 text-white fixed">
            <h1 className="text-xl font-bold p-4">Learn Next JS</h1>
            <ul>
                <Link href="/blog">

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaBlog className="mr-2"/>
                        {t('sidebar.blog')}

                    </li>
                </Link>

                <Link href="/posts">

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaNewspaper className="mr-2"/>
                        {t('sidebar.posts')}

                    </li>
                </Link>
                <a href="/about" className="flex items-center">

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaInfoCircle className="mr-2"/>
                        {t('sidebar.about')}
                    </li>
                </a>
                <Link href='/contact'>

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaEnvelope className="mr-2"/>
                        {t('sidebar.contact')}
                    </li>
                </Link>
                <Link href='/user'>

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaUserCircle className="mr-2"/>
                        {t('sidebar.userManagement')}
                    </li>
                </Link>

            </ul>
        </div>
    )
        ;
};

export default Sidebar;

