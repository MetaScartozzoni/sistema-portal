// src/pages/UpdatePasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';
import authApi from '../services/auth/authApi';

export const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    const resp = await authApi.updatePassword({ currentPassword, newPassword: password });
    setIsSubmitting(false);
    if (resp.success) {
      setSuccess(resp.message || 'Senha atualizada com sucesso.');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(resp.message || 'Falha ao atualizar senha.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-xl border border-white/20 shadow-xl p-8 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-300 hover:text-white flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" /> <span>Voltar</span>
        </button>
        <div className="flex flex-col items-center text-center mb-6 space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Atualizar Senha</h1>
            <p className="text-sm text-gray-300">Defina uma nova senha para sua conta.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Senha Atual</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="input-field pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20"
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20"
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-field pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20"
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded-md p-2">{error}</div>}
          {success && <div className="text-sm text-green-300 bg-green-900/30 border border-green-500/30 rounded-md p-2">{success}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60"
          >
            {isSubmitting ? 'Enviando...' : 'Atualizar Senha'}
          </button>
        </form>
        <p className="mt-6 text-xs text-center text-gray-400">
          Recurso placeholder. Integrar com endpoint /auth/update-password quando disponível.
        </p>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;