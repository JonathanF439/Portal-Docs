'use client'
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import { LogOut, FileText, Shield, User as UserIcon, Home } from 'lucide-react';
import { UserRole } from '../../types';
import { Logo } from '../ui/Logo';

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
      {/* Sidebar / Navbar */}
      <div className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center justify-center md:justify-start border-b border-gray-100">
          <Logo size="md" />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
              <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Fornecedor'}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {/* Módulos Home */}
            <button
              onClick={() => router.push('/modules')}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-colors
                ${isActive('/modules')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Home size={18} />
              Módulos
            </button>

            {/* Menu Atual (Admin ou Supplier) */}
            {currentUser.role === UserRole.ADMIN && (
              <button
                onClick={() => router.push('/admin')}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-colors
                  ${isActive('/admin')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Shield size={18} />
                Gestão de Compras
              </button>
            )}

            {currentUser.role === UserRole.SUPPLIER && (
              <button
                onClick={() => router.push('/supplier')}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-colors
                  ${isActive('/supplier')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <FileText size={18} />
                Meus Documentos
              </button>
            )}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};