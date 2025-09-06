import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ApiContext = createContext();

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};

// Base de API: em desenvolvimento usa proxy '/api' apontando para VITE_API_BASE_URL.
// Em produção usa VITE_API_BASE_URL diretamente (ex.: https://api.seuservidor.com/api).
const ENV_API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || '';
const IS_DEV = !!import.meta?.env?.DEV;
const API_BASE_URL = (IS_DEV && ENV_API_BASE_URL)
  ? '/api'
  : (ENV_API_BASE_URL || '/api');

export const ApiProvider = ({ children }) => {
    const { toast } = useToast();
    const { token, user } = useAuth();

    const apiFetch = useCallback(async (endpoint, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const isAbsolute = /^https?:\/\//i.test(endpoint);
            const url = isAbsolute
              ? endpoint
              : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido na API' }));
                throw new Error(errorData.message || `Erro: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro de comunicação com a API',
                description: error.message,
            });
            throw error;
        }
    }, [toast, token]);

    const value = useMemo(() => ({
        apiFetch, // Expor o fetch genérico
        getAppointmentsForDay: (date) => apiFetch(`/appointments?date=${date}`),
        addAppointment: (data) => apiFetch('/appointments', { method: 'POST', body: JSON.stringify(data) }),
        updateAppointment: (id, data) => apiFetch(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
        searchPatients: (query) => apiFetch(`/patients?search=${query}`),
        getPatientJourneys: (patientId) => apiFetch(`/patients/${patientId}/journeys`),
        updateJourneyStage: (journeyId, stageId, data) => apiFetch(`/journeys/${journeyId}/stages/${stageId}`, { method: 'PATCH', body: JSON.stringify(data) }),
        getContacts: () => apiFetch('/contacts'),
        addContact: (data) => apiFetch('/contacts', { method: 'POST', body: JSON.stringify(data) }),
        convertContactToPatient: (contactId) => apiFetch(`/contacts/${contactId}/convert`, { method: 'POST' }),
    }), [apiFetch]);

    return (
        <ApiContext.Provider value={{...value, auth: { user }}}>
            {children}
        </ApiContext.Provider>
    );
};
