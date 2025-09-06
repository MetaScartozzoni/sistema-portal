import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Callback = () => {
    const { handleLoginSuccess } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1)); // Remove o '#'
        const accessToken = params.get('access_token');

        if (accessToken) {
            try {
                handleLoginSuccess(accessToken);
            } catch (e) {
                setError('Ocorreu um erro ao processar seu login. O token pode ser inválido.');
            }
        } else {
            setError('Nenhum token de acesso encontrado. Retornando ao login...');
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [handleLoginSuccess, navigate]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500/50"
                >
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white">Falha na Autenticação</h1>
                    <p className="mt-2 text-red-300">{error}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="text-center p-8"
            >
                <div className="flex items-center justify-center space-x-4">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                    <h1 className="text-3xl font-bold text-white">Autenticando...</h1>
                </div>
                <p className="mt-4 text-gray-400">
                    Processando suas informações de login. Aguarde um momento.
                </p>
            </motion.div>
        </div>
    );
};

export default Callback;