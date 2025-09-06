// src/types/auth.js (placeholder JS - mantido simples)
// Fornece apenas shape de referência para documentação.
// Em JS não é utilizado pelo runtime; pode remover se não quiser.
export const AuthShapes = {
  User: {
    id: 'number',
    email: 'string',
    name: 'string',
    role: 'admin|medico|secretaria|paciente',
    created_at: 'string'
  }
};
