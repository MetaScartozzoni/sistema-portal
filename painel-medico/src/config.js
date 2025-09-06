/**
 * Módulo de Configuração Centralizado
 * 
 * Este arquivo importa todas as variáveis de ambiente do arquivo .env
 * e as exporta para serem usadas em toda a aplicação.
 * Isso garante um único ponto de verdade para as configurações.
 * 
 * Para acessar uma variável no código, importe-a deste arquivo:
 * import { API_BASE_URL } from '@/config';
 */

// 🌐 Configuração da API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY;
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;

// 🔐 Controle de Acesso
export const ROLE_REQUIRED = import.meta.env.VITE_ROLE_REQUIRED;
export const PERMISSIONS = import.meta.env.VITE_PERMISSIONS?.split(',');

// 🎯 Funcionalidades Habilitadas
export const FEATURES = import.meta.env.VITE_FEATURES?.split(',');

// 📋 Configurações Clínicas
export const DEFAULT_CONSULTATION_DURATION = Number(import.meta.env.VITE_DEFAULT_CONSULTATION_DURATION);
export const ENABLE_TELEMEDICINE = import.meta.env.VITE_ENABLE_TELEMEDICINE === 'true';
export const ENABLE_PRESCRIPTIONS = import.meta.env.VITE_ENABLE_PRESCRIPTIONS === 'true';
export const ENABLE_EXAM_REQUESTS = import.meta.env.VITE_ENABLE_EXAM_REQUESTS === 'true';

// 📧 Notificações
export const EMAIL_NOTIFICATIONS = import.meta.env.VITE_EMAIL_NOTIFICATIONS === 'true';
export const SMS_NOTIFICATIONS = import.meta.env.VITE_SMS_NOTIFICATIONS === 'true';
export const PUSH_NOTIFICATIONS = import.meta.env.VITE_PUSH_NOTIFICATIONS === 'true';

// 🎨 Personalização
export const THEME = import.meta.env.VITE_THEME;
export const CALENDAR_VIEW = import.meta.env.VITE_CALENDAR_VIEW;
export const TIMEZONE = import.meta.env.VITE_TIMEZONE;

// 🚀 Desenvolvimento
export const NODE_ENV = import.meta.env.VITE_NODE_ENV;
export const IS_DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

// Credenciais de teste
export const TEST_MEDICO_ID = import.meta.env.VITE_TEST_MEDICO_ID;
export const TEST_PATIENT_ID = import.meta.env.VITE_TEST_PATIENT_ID;