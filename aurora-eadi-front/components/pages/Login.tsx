import React, { useState } from 'react';
import { useLogin } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Loader2, Eye, EyeOff, AlertCircle as AlertIcon } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface LoginProps {
  setView: (v: 'login' | 'register') => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  const { mutate: login, isPending: isLoading } = useLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setError('');
    
    // Sempre loga como fornecedor por padrão
    const role = UserRole.SUPPLIER;
    
    login({ email, password, role }, {
      onError: (err) => {
        setError(err.message || 'Erro ao tentar login.');
      }
    });
  };

  const prefillDemo = () => {
    setError('');
    setEmail('joao@tech.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-600 p-12 flex-col justify-between relative overflow-hidden">

        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Logística Integrada e Inteligente
          </h1>
          <p className="text-white/90 text-lg">
            Controle total sobre armazém alfandegado, frota e operações de comércio exterior.
          </p>
        </div>

        <div className="relative z-10 text-white/70 text-sm">
          © 2025 Aurora EADI. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
              <p className="text-gray-500 text-sm">Acesse sua conta para gerenciar operações logísticas</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertIcon size={16} className="shrink-0" /> <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all pr-11 bg-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Entrando...
                  </>
                ) : (
                  'Acessar Portal'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-3">
                Sua empresa ainda não tem cadastro?
              </p>
              <button 
                onClick={() => setView('register')}
                className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                Cadastrar Fornecedor
              </button>
            </div>

            {/* Demo Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold text-center mb-3 tracking-wider">
                Para demonstração
              </p>
              <button
                onClick={prefillDemo}
                className="w-full text-xs py-2.5 px-3 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
              >
                Preencher com dados demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};