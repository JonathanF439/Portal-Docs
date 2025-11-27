import React, { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';

import { Search, Users, UserCheck, Clock } from 'lucide-react';

export function FaturamentoDashboard() {
  const { currentUser } = useAuthContext();
  

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-500">Gerencie o acesso das empresas e modere documentos.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Empresas</p>
            <p className="text-2xl font-bold text-gray-900"></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendentes de Acesso</p>
            <p className="text-2xl font-bold text-gray-900"></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cadastros Ativos</p>
            <p className="text-2xl font-bold text-gray-900"></p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar fornecedor por Razão Social, CNPJ ou Responsável..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Main Table: Supplier List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      </div>


    </div>
  );
};