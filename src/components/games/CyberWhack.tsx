import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';
import { useJuice } from '../../hooks/useJuice';

export const CyberWhack = ({ onEnd, onExit }: GameProps) => {
    const [score, setScore] = useState(0);
    const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
    const [timeLeft, setTimeLeft] = useState(30);
    const { playSound } = useArcadeSound();
    const { shake, triggerShake } = useJuice();
    const scoreRef = useRef(0);

    // Sync ref for closure
    useEffect(() => { scoreRef.current = score; }, [score]);

    useEffect(() => {
        // Game Timer
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer);
                    onEnd({
                        success: scoreRef.current >= 1000,
                        score: scoreRef.current,
                        prize: scoreRef.current >= 1000 ? 'REFLEX KING' : undefined
                    });
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        // Mole Logic
        const moveMole = () => {
            const nextTime = Math.max(400, 1000 - scoreRef.current / 2); // Gets faster

            // Clear moles
            setMoles(Array(9).fill(false));

            // Pick new mole
            const newIndex = Math.floor(Math.random() * 9);
            setMoles(prev => {
                const next = [...prev];
                next[newIndex] = true;
                return next;
            });

            moleTimeoutRef.current = setTimeout(moveMole, nextTime);
        };

        const moleTimeoutRef = { current: setTimeout(moveMole, 500) };

        return () => {
            clearInterval(timer);
            clearTimeout(moleTimeoutRef.current);
        };
    }, [onEnd]);

    const handleWhack = (index: number) => {
        if (moles[index]) {
            playSound('hit');
            triggerShake(10);
            setScore(s => s + 100);
            setMoles(prev => {
                const next = [...prev];
                next[index] = false;
                return next;
            });
        } else {
            setScore(s => Math.max(0, s - 50));
        }
    };

    return (
        <motion.div
            animate={{ x: Math.random() * shake - shake / 2, y: Math.random() * shake - shake / 2 }}
            className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4"
        >
            <div className="flex justify-between w-full max-w-sm mb-8 font-arcade text-xl">
                <div className="text-neon-pink">PTS: {score}</div>
                <div className="text-neon-blue">TIME: {timeLeft}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {moles.map((isActive, index) => (
                    <motion.div
                        key={index}
                        className={`aspect-square rounded-full border-4 ${isActive
                            ? 'bg-neon-green border-white shadow-[0_0_20px_#0aff00]'
                            : 'bg-black/50 border-gray-800'
                            } cursor-pointer transition-colors relative overflow-hidden`}
                        onMouseDown={() => handleWhack(index)}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl select-none animate-bounce">
                                👾
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <button onClick={onExit} className="mt-8 text-gray-500 hover:text-white underline">EXIT</button>
        </motion.div>
    );
};
