import { useState, useCallback } from 'react';

export const useJuice = () => {
    const [shake, setShake] = useState(0);

    const triggerShake = useCallback((intensity: number = 10) => {
        setShake(intensity);
        if (navigator.vibrate) navigator.vibrate(intensity * 5); // Haptic feedback
        setTimeout(() => setShake(0), 200);
    }, []);

    return { shake, triggerShake };
};
