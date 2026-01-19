import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';
import { useJuice } from '../../hooks/useJuice';
import { triggerConfetti, triggerSchoolPride } from '../../utils/confetti';
import { getRandomPrize } from '../../utils/prizes';

const SYMBOLS = ['🍕', '💎', '7️⃣', '🍒', '🔔', '⭐'];

export const LuckySlots = ({ onEnd, onExit }: GameProps) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [teaseIndex, setTeaseIndex] = useState<number | null>(null);

    // Animation controls for each reel
    const controls0 = useAnimation();
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const reelControls = [controls0, controls1, controls2];

    const { playSound } = useArcadeSound();
    const { shake, triggerShake } = useJuice();

    const spinReel = async (index: number, duration: number, isTease: boolean = false) => {
        // Spin visuals (blur effect handled via CSS class potentially, or just speed)
        await reelControls[index].start({
            y: [0, -128 * 20], // Spin through 20 items worth of height (128px per item)
            transition: {
                duration: duration + (isTease ? 2 : 0), // Tease spins longer
                ease: isTease ? "easeInOut" : "easeOut",
                repeat: Infinity
            }
        });
    };

    const stopReel = async (index: number, symbolIndex: number) => {
        await reelControls[index].start({
            y: -symbolIndex * 128, // Using 128px (h-32)
            transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 20 }
        });
        playSound('click');
        triggerShake(5);
    };

    // Simplified logic for this step to avoid complex reel math in one go.
    // We will simulate the visual spin by just animating y position of a strip.

    const handleSpin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setTeaseIndex(null);
        playSound('mix-kit-spin'); // Or any longer spin sound

        // Predetermine result
        const r1 = Math.floor(Math.random() * SYMBOLS.length);
        const r2 = Math.floor(Math.random() * SYMBOLS.length);
        // FORCE TEASE: If r1 == r2, we might win or lose, but we tease r3
        // To make it fun, let's bump chances of r3 matching if r1==r2
        let r3 = Math.floor(Math.random() * SYMBOLS.length);

        const isTease = r1 === r2;

        // Start all spinning
        spinReel(0, 2);
        spinReel(1, 2);
        spinReel(2, 2, isTease); // Reel 3 might spin longer for tease

        // Stop Reel 1
        await new Promise(r => setTimeout(r, 1000));
        await stopReel(0, r1);

        // Stop Reel 2
        await new Promise(r => setTimeout(r, 800));
        await stopReel(1, r2);

        // Tease Logic
        if (isTease) {
            setTeaseIndex(2); // Highlight 3rd reel
            playSound('retro-jump'); // Suspense rising sound placeholder
            await new Promise(r => setTimeout(r, 2000)); // Long wait
        } else {
            await new Promise(r => setTimeout(r, 500));
        }

        // Stop Reel 3
        await stopReel(2, r3);
        setTeaseIndex(null);

        // Check Win
        if (r1 === r2 && r2 === r3) {
            playSound('win');
            triggerSchoolPride();
            triggerShake(30);
            setTimeout(() => onEnd({ success: true, score: 500, prize: 'JACKPOT' }), 1000);
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            playSound('coin');
            triggerConfetti();
            setTimeout(() => onEnd({ success: true, score: 100, prize: getRandomPrize() }), 1000);
        } else {
            setTimeout(() => setIsSpinning(false), 500);
        }


    };

    return (
        <motion.div
            animate={{ x: Math.random() * shake - shake / 2, y: Math.random() * shake - shake / 2 }}
            className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark"
        >
            <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-xl border-4 border-neon-purple shadow-[0_0_40px_rgba(180,0,255,0.4)] flex gap-4">
                {[0, 1, 2].map(i => (
                    <div key={i} className={`relative w-32 h-32 bg-white/10 rounded-lg overflow-hidden border-2 ${teaseIndex === i ? 'border-neon-yellow shadow-[inset_0_0_20px_#ffd700]' : 'border-gray-600'}`}>
                        <motion.div animate={reelControls[i]} initial={{ y: 0 }} className="flex flex-col items-center">
                            {/* Duplicate list for infinite scroll illusion */}
                            {[...SYMBOLS, ...SYMBOLS, ...SYMBOLS, ...SYMBOLS].map((s, idx) => (
                                <div key={idx} className="h-32 flex items-center justify-center text-6xl">
                                    {s}
                                </div>
                            ))}
                        </motion.div>
                        {teaseIndex === i && (
                            <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay animate-pulse" />
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="px-12 py-6 bg-red-600 border-b-8 border-red-800 rounded-full text-white font-arcade text-2xl active:translate-y-2 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(255,0,0,0.5)]"
            >
                SPIN
            </button>

            <button onClick={onExit} className="mt-12 text-gray-500 hover:text-white underline">EXIT</button>
        </motion.div>
    );
};
