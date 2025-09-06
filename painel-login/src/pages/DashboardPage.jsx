// src/pages/DashboardPage.tsx
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { LogOut, User, Shield, Clock } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      medico: 'Médico',
      secretaria: 'Secretária',
      paciente: 'Paciente',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      medico: 'bg-blue-100 text-blue-800',
      secretaria: 'bg-green-100 text-green-800',
      paciente: 'bg-purple-100 text-purple-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Marcio Plastic Surgery
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">Portal de Login</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{user.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Login realizado com sucesso!
            </h2>
            <p className="text-gray-600">
              Você será redirecionado para o portal apropriado em alguns segundos...
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Perfil: {getRoleDisplayName(user.role)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Último acesso: {new Date().toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">Portal Administrativo</h4>
              <p className="text-sm text-gray-600 mb-3">
                Gestão completa do sistema, usuários e configurações
              </p>
              <a
                href="https://portal.marcioplasticsurgery.com/portal-admin"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Acessar →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">Portal Médico</h4>
              <p className="text-sm text-gray-600 mb-3">
                Agenda, consultas, prontuários e prescrições
              </p>
              <a
                href="https://portal.marcioplasticsurgery.com/portal-medico"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Acessar →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">Portal Secretária</h4>
              <p className="text-sm text-gray-600 mb-3">
                Agendamentos, calendário e atendimento
              </p>
              <a
                href="https://portal.marcioplasticsurgery.com/portal-secretaria"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Acessar →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">Portal Paciente</h4>
              <p className="text-sm text-gray-600 mb-3">
                Consultas, histórico médico e documentos
              </p>
              <a
                href="https://portal.marcioplasticsurgery.com/portal-paciente"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Acessar →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">Portal Orçamento</h4>
              <p className="text-sm text-gray-600 mb-3">
                Gestão financeira, propostas e pagamentos
              </p>
              <a
                href="https://portal.marcioplasticsurgery.com/portal-orcamento"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Acessar →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">Portal Bot</h4>
              <p className="text-sm text-gray-600 mb-3">
                Automações, chatbot e fluxos de conversa
              </p>
              <a
                href="https://portal.marcioplasticsurgery.com/portal-bot"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Acessar →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};