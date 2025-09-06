import React, { useState, useEffect, useRef } from 'react';

const useIdleTimer = (onIdle, idleTimeInSeconds = 300) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, idleTimeInSeconds * 1000);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    
    const handleActivity = () => {
      if (isIdle) {
        setIsIdle(false);
      }
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isIdle, onIdle, idleTimeInSeconds]);

  return isIdle;
};

export default useIdleTimer;