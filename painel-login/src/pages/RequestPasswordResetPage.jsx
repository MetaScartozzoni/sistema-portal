import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../services/auth/authApi';

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null); setError(null);
    if (!email) { setError('Informe o email.'); return; }
    setIsSubmitting(true);
    const resp = await authApi.requestPasswordReset(email);
    setIsSubmitting(false);
    if (resp.success) setStatus(resp.message || 'Se o email existir, enviamos instruções.');
    else setError(resp.message || 'Erro ao solicitar.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg border shadow p-8">
        <h1 className="text-xl font-semibold mb-4">Recuperar Senha</h1>
        <p className="text-sm text-gray-600 mb-6">Digite seu email para receber o link de redefinição.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-field" placeholder="voce@exemplo.com" disabled={isSubmitting} required />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          {status && <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">{status}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3">{isSubmitting ? 'Enviando...' : 'Enviar link'}</button>
        </form>
        <button onClick={()=>navigate('/login')} className="mt-6 w-full text-sm text-gray-500 hover:text-gray-700">Voltar ao login</button>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;
