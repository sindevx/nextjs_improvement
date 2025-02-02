'use client'
import React from 'react';
import { Code, Github, Linkedin, Mail, Terminal, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
const AboutPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">{t('about.title')}</h1>
            <p className="mt-4 text-xl text-gray-600">
              {t('about.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* About Me Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-6">
            <Terminal className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">{t('about.title')}</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            {t('about.description')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-6">
            <Code className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">{t('about.technicalSkills')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">{t('about.frontend')}</span>
              <p className="text-sm text-gray-600">React, Next.js, Tailwind</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
                <span className="font-medium">{t('about.backend')}</span>
              <p className="text-sm text-gray-600">Node.js, Express, APIs</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">{t('about.database')}</span>
              <p className="text-sm text-gray-600">MongoDB, PostgreSQL</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">{t('about.tools')}</span>
              <p className="text-sm text-gray-600">Git, Docker, VS Code</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">{t('about.languages')}</span>
              <p className="text-sm text-gray-600">JavaScript, TypeScript, Python</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">{t('about.cloud')}</span>
              <p className="text-sm text-gray-600">AWS, Vercel, Netlify</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">{t('about.featuredProjects')}</h2>
          </div>
          <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900">{t('about.projectOne')}</h3>
              <p className="text-gray-600">{t('about.projectOneDescription')}</p>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900">{t('about.projectTwo')}</h3>
              <p className="text-gray-600">{t('about.projectTwoDescription')}</p>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900">{t('about.projectThree')}</h3>
              <p className="text-gray-600">{t('about.projectThreeDescription')}</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="mailto:your-email@example.com" 
              className="text-gray-600 hover:text-red-500 transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;