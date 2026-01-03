import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';
import { useJuice } from '../../hooks/useJuice';

export const TurboTapper = ({ onEnd, onExit }: GameProps) => {
    const [count, setCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isActive, setIsActive] = useState(false);
    const controls = useAnimation();
    const { playSound } = useArcadeSound();
    const { shake, triggerShake } = useJuice();

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer);
                    onEnd({ success: count >= 50, score: count, prize: count >= 50 ? 'SPEED DEMON' : undefined });
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, count, onEnd]);

    const handleTap = async () => {
        if (!isActive) setIsActive(true);
        if (timeLeft > 0) {
            setCount(c => c + 1);
            // Rising pitch up to 2x (limited at 50 taps)
            const pitch = 1 + Math.min(count, 50) * 0.02;
            playSound(count % 5 === 0 ? 'combo' : 'click', { pitch }); // Combo sound every 5 taps
            const intensity = Math.min(count * 0.5, 15); // Ramp up intensity
            triggerShake(intensity);

            await controls.start({
                scale: [1, 0.9, 1],
                transition: { duration: 0.1 }
            });
        }
    };

    return (
        <motion.div
            animate={{ x: Math.random() * shake - shake / 2, y: Math.random() * shake - shake / 2 }}
            className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4"
        >
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-arcade text-white mb-4">{count}</h2>
                <p className="text-neon-blue font-mono">GOAL: 50 TAPS</p>
                <p className="text-neon-pink font-mono mt-2">TIME: {timeLeft}s</p>
            </div>

            <motion.button
                animate={controls}
                onMouseDown={handleTap}
                className="w-64 h-64 rounded-full bg-gradient-to-br from-neon-pink to-arcade-purple border-8 border-white shadow-[0_0_50px_#ff00ff] flex items-center justify-center active:scale-95 transition-transform"
            >
                <div className="text-center">
                    <div className="text-3xl font-arcade text-white pointer-events-none select-none">TAP!</div>
                    {!isActive && <div className="text-xs text-white/50 mt-2 font-sans uppercase">Tap to start</div>}
                </div>
            </motion.button>

            <button onClick={onExit} className="mt-12 text-gray-500 hover:text-white underline">EXIT</button>
        </motion.div>
    );
};
