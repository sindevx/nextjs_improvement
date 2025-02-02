'use client'
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
const ContactPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
            <p className="mt-4 text-xl text-gray-600">
                {t('contact.title')}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Email Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-500" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">{t('contact.emailUs')}</h3>  
            </div>
            <p className="mt-4 text-gray-600">
              {t('contact.sendUsAnEmail')}
            </p>
            <a 
              href="mailto:contact@company.com" 
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              {t('contact.email')}
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-green-500" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">{t('contact.callUs')}</h3>
            </div>
            <p className="mt-4 text-gray-600">
              {t('contact.availableMondayToFriday')}
            </p>
            <p className="mt-2 text-gray-900 font-medium">
              {t('contact.phoneNumber')}
            </p>
          </div>

          {/* Office Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-red-500" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">{t('contact.visitUs')}</h3>
            </div>
            <p className="mt-4 text-gray-600">
              {t('contact.address')}
              <br />
              {t('contact.suite')}
              <br />
              {t('contact.city')}
            </p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('contact.connectWithUs')}</h2>
          <div className="mt-6 flex justify-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              aria-label="Facebook"
            >
              <Facebook className="h-8 w-8" />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-400 transition-colors duration-300"
              aria-label="Twitter"
            >
              <Twitter className="h-8 w-8" />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-green-500 transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;