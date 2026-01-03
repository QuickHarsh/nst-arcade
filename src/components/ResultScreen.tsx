import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useArcadeSound } from '../hooks/useArcadeSound';

interface ResultScreenProps {
    prize: string;
    onRedeem: () => void;
}

export const ResultScreen = ({ prize, onRedeem }: ResultScreenProps) => {
    const { playSound } = useArcadeSound();

    useEffect(() => {
        playSound('win');

        // Fire confetti on mount
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff00ff', '#00ffff', '#ffd700']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff00ff', '#00ffff', '#ffd700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center w-full max-w-md"
            >
                <h1 className="text-5xl md:text-7xl font-arcade text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_5px_10px_rgba(255,215,0,0.5)] mb-8">
                    WINNER!
                </h1>

                <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-2xl border-4 border-neon-pink shadow-[0_0_50px_#ff00ff] w-full text-center mb-10 transform -rotate-2 hover:rotate-0 transition-transform">
                    <p className="text-gray-400 font-sans text-sm tracking-widest uppercase mb-2">You Won</p>
                    <h2 className="text-3xl md:text-4xl font-arcade text-white shadow-black drop-shadow-lg leading-tight">
                        {prize}
                    </h2>
                </div>

                <button
                    onClick={onRedeem}
                    className="group relative px-8 py-5 bg-transparent overflow-hidden rounded-lg"
                >
                    <div className="absolute inset-0 w-full h-full bg-neon-blue opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 border-2 border-neon-blue rounded-lg blur-[2px]" />
                    <div className="absolute inset-0 border-2 border-neon-blue rounded-lg" />
                    <span className="relative font-arcade text-xl text-neon-blue group-hover:text-white transition-colors flex items-center gap-3">
                        CLAIM REWARD &rarr;
                    </span>
                </button>
            </motion.div>
        </div>
    );
};
