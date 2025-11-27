'use client'
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import { LogOut, FileText, Shield, User as UserIcon, Home } from 'lucide-react';
import { UserRole } from '../../types';
import { Logo } from '../ui/Logo';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logoutUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  if (!currentUser) return <>{children}</>;

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};