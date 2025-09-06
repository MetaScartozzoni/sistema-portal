import { useEffect } from 'react';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function onClick(e) {
      const el = ref?.current;
      if (!el || el.contains(e.target)) return;
      handler?.(e);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [ref, handler]);
}

