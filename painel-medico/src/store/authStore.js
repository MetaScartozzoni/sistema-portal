// Refatorado para consumir o pacote compartilhado @portal/shared
// Mantemos a mesma API de export (useAuthStore, api) para evitar mudanças em outros arquivos.
import { createAuthStore } from '@portal/shared'; // resolved via workspaces packages/shared

// Personalizações específicas deste portal
const { useAuthStore, api } = createAuthStore({
  persistKey: 'auth-medico',
  guestRole: 'medico'
});

export { useAuthStore, api };
