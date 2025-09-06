import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const { handleLoginCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const hash = location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove '#'
    const accessToken = params.get('access_token');

    if (accessToken) {
      const result = handleLoginCallback(accessToken);
      if(result.success) {
        toast({
          title: "Autenticação bem-sucedida!",
          description: "Bem-vindo de volta ao Portal Admin.",
        });
        navigate('/', { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Falha na autenticação",
          description: result.error || "Não foi possível validar o seu token de acesso.",
        });
        navigate('/login', { replace: true });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Token não encontrado",
        description: "Nenhum token de acesso foi encontrado no retorno da autenticação.",
      });
      navigate('/login', { replace: true });
    }
  }, [handleLoginCallback, navigate, location, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl">Autenticando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;