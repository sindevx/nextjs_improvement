import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 ml-64 mt-16">
          <div className="bg-white rounded-lg shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;