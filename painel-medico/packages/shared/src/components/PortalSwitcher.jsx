import React from 'react';
import { getAccessiblePortals } from '../auth/portalAccess.js';

/**
 * PortalSwitcher
 * Renderiza lista de portais acessíveis (exclui o portal atual se "currentCode" for informado)
 * Props:
 *  - role: string | undefined
 *  - currentCode?: string (ex: 'orcamento')
 *  - variant?: 'menu' | 'inline'
 */
export const PortalSwitcher = ({ role, currentCode, variant = 'menu', className = '' }) => {
  const portals = getAccessiblePortals(role).filter(p => p.code !== currentCode);
  if (!portals.length) return null;

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {portals.map(p => (
          <a key={p.code} href={p.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 capitalize">
            {p.code}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <button className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors">
        Portais
      </button>
      <div className="absolute left-0 mt-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-md shadow-lg min-w-[160px] z-50">
        <ul className="py-2 text-xs">
          {portals.map(p => (
            <li key={p.code}>
              <a href={p.url} target="_blank" rel="noreferrer" className="flex px-3 py-2 hover:bg-slate-800 text-gray-300 hover:text-white capitalize">
                {p.code}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PortalSwitcher;
