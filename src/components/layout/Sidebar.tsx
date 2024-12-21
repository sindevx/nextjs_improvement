import React from 'react';
import {FaBlog, FaInfoCircle, FaEnvelope, FaUserCircle, FaNewspaper} from 'react-icons/fa';
import Link from "next/link";

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white fixed">
            <h1 className="text-xl font-bold p-4">Learn Next JS</h1>
            <ul>
                <Link href="/blog">

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaBlog className="mr-2"/>
                        Blog

                    </li>
                </Link>

                <Link href="/posts">

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaNewspaper className="mr-2"/>
                        Posts

                    </li>
                </Link>
                <a href="/about" className="flex items-center">

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaInfoCircle className="mr-2"/>
                        About
                    </li>
                </a>
                <Link href='/contact'>

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaEnvelope className="mr-2"/>
                        Contact
                    </li>
                </Link>
                <Link href='/user'>

                    <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
                        <FaUserCircle className="mr-2"/>
                        User Management
                    </li>
                </Link>

            </ul>
        </div>
    )
        ;
};

export default Sidebar;

