import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authApi from '../services/auth/authApi';

const ResetPasswordPage = () => {
  const [sp] = useSearchParams();
  const token = sp.get('token') || '';
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setStatus(null);
    if (!token) { setError('Token inválido ou ausente.'); return; }
    if (newPassword !== confirm) { setError('As senhas não coincidem.'); return; }
    setIsSubmitting(true);
    const resp = await authApi.resetPassword({ token, newPassword });
    setIsSubmitting(false);
    if (resp.success) { setStatus(resp.message || 'Senha redefinida.'); setTimeout(()=>navigate('/login'), 1800); }
    else setError(resp.message || 'Erro ao redefinir.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg border shadow p-8">
        <h1 className="text-xl font-semibold mb-4">Redefinir Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">Nova Senha</label>
            <input id="newPassword" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="input-field" required disabled={isSubmitting} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirm">Confirmar Senha</label>
            <input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="input-field" required disabled={isSubmitting} />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          {status && <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">{status}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3">{isSubmitting ? 'Processando...' : 'Redefinir Senha'}</button>
        </form>
        <button onClick={()=>navigate('/login')} className="mt-6 w-full text-sm text-gray-500 hover:text-gray-700">Voltar</button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
