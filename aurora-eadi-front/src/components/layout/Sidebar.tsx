'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/button';
import { ScrollArea } from '@/src/components/ui/scroll-area';

import { LogOut, Home, Shield, FileText, User as UserIcon } from 'lucide-react';
import { UserRole } from '@/src/types';
import { Logo } from '@/src/components/ui/Logo';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  path: string;
  active: boolean;
  onClick: () => void;
}

export function SidebarItem({ label, icon, active, onClick }: SidebarItemProps) {
  return (
    <Button

      variant={active ? "secondary" : "ghost"}
      className={`
        w-full justify-start gap-3 
        
        // Cores padrão (Não Ativo): Texto claro, Hover sutil no fundo escuro
        text-slate-300 hover:bg-slate-800 hover:text-white

        ${active ? 

          "bg-primary-600 text-white hover:bg-primary-700" 
          : ""
        }
      `}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
};

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logoutUser } = useAuthContext();

  if (!currentUser) return null;

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (

    <div className="w-full md:w-64 bg-slate-900 border-b md:border-r border-slate-700 flex flex-col">

      <div className="p-6 flex items-center justify-center md:justify-start border-b border-slate-800">
        <Logo size="md" />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">

          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-primary-400">
              <UserIcon size={20} />
            </div>
            <div>

              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>

              <p className="text-xs text-slate-400 capitalize">
                {currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Fornecedor'}
              </p>
            </div>
          </div>


          <nav className="space-y-1">

            <SidebarItem
              label="Home"
              icon={<Home size={18} />}
              path="/modules"
              active={isActive('/modules')}
              onClick={() => router.push('/modules')}
            />

            {currentUser.role === UserRole.ADMIN && (
              <SidebarItem
                label="Gestão de Documentos"
                icon={<Shield size={18} />}
                path="/admin"
                active={isActive('/admin')}
                onClick={() => router.push('/admin')}
              />
            )}

            {currentUser.role === UserRole.SUPPLIER && (
              <SidebarItem
                label="Meus Documentos"
                icon={<FileText size={18} />}
                path="/supplier"
                active={isActive('/supplier')}
                onClick={() => router.push('/supplier')}
              />
            )}
          </nav>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-500 hover:bg-red-900/20 gap-2"
        >
          <LogOut size={18} />
          Sair
        </Button>
      </div>
    </div>
  );
};