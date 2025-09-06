import React, { useEffect, useState } from 'react';

const isUnset = (value) => !value || /^YOUR-/i.test(String(value));
const DISMISS_KEY = 'portal-secretaria.envBanner.dismissed';

export default function EnvWarningBanner() {
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const anon = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  const missing = [];
  if (isUnset(url)) missing.push('VITE_SUPABASE_URL');
  if (isUnset(anon)) missing.push('VITE_SUPABASE_ANON_KEY');

  const [dismissed, setDismissed] = useState(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem(DISMISS_KEY) === '1'
  );

  useEffect(() => {
    // If env is complete, clear any previous dismissal
    if (!missing.length && typeof localStorage !== 'undefined') {
      localStorage.removeItem(DISMISS_KEY);
    }
  }, [missing.length]);

  if (!missing.length || dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
    setDismissed(true);
  };

  return (
    <div className="w-full bg-yellow-600 text-white text-sm px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <span>
          Ambiente incompleto: defina {missing.join(', ')} em <code>.env</code>. Consulte <code>.env.example</code>.
        </span>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dispensar aviso de ambiente"
          className="shrink-0 px-2 py-1 rounded bg-yellow-700 hover:bg-yellow-800 text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
