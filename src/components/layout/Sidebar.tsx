"use client"

import React from 'react';
import {FaBlog, FaInfoCircle, FaEnvelope, FaUserCircle, FaNewspaper, FaTags, FaTypo3} from 'react-icons/fa';
import Link from "next/link";
import { useLanguage } from '@/hooks/useLanguage';


const Sidebar: React.FC = () => {
    const { t } = useLanguage();

    //current locale
    const { currentLocale } = useLanguage();

    return (
        <div className="w-64 h-screen bg-gray-800 text-white fixed">
            <h1 className="text-xl font-bold p-4">{t('sidebar.applicationName')}</h1>
            <ul>

                <Link href={`/${currentLocale}/posts`}>

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaNewspaper className="mr-2"/>
                        {t('sidebar.posts')}

                    </li>
                </Link>
              
                <Link href={`/${currentLocale}/categories`}>
                <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaTypo3 className="mr-2"/>
                    {t('sidebar.categories')}
                </li>
                </Link>
                <Link href={`/${currentLocale}/tags`}>

                <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaTags className="mr-2"/>
                    {t('sidebar.tags')}
                </li>
                </Link>
                <Link href={`/${currentLocale}/user`}>

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaUserCircle className="mr-2"/>
                        {t('sidebar.userManagement')}
                    </li>
                </Link>

                <Link href={`/${currentLocale}/about`}>

                <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaInfoCircle className="mr-2"/>
                    {t('sidebar.about')}
                </li>
                </Link>
                <Link href={`/${currentLocale}/contact`}>

                <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaEnvelope className="mr-2"/>
                    {t('sidebar.contact')}
                </li>
                </Link>

            </ul>
        </div>
    )
        ;
};

export default Sidebar;

