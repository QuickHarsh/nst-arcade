import { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameProps } from '../types';
import { useArcadeSound } from '../hooks/useArcadeSound';
import { useJuice } from '../hooks/useJuice';
import { triggerConfetti, triggerSchoolPride } from '../utils/confetti';

import { DARES } from '../data/dares';

const PRIZES = [
    { label: 'CHOCOLATE', value: 'CHOCOLATE BAR', color: '#d2691e' },
    { label: 'DARE 1', type: 'dare', color: '#ff0055' },
    { label: 'DARE 2', type: 'dare', color: '#9d00ff' },
    { label: 'JACKPOT', value: 'JACKPOT! MEGA PRIZE', color: '#ffd700' },
    { label: 'DARE 3', type: 'dare', color: '#00ffff' },
    { label: 'TRY AGAIN', value: 'TRY AGAIN', color: '#ff0000' },
];

export const SpinWheel = ({ onEnd, onExit }: GameProps) => {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const { playSound } = useArcadeSound();
    const { shake, triggerShake } = useJuice();

    // Track last rotation to ensure we always spin forward
    const lastRotation = useRef(0);

    const handleSpin = async () => {
        if (isSpinning) return;

        setIsSpinning(true);
        playSound('click');

        // 1. Pick a winner FIRST (Deterministic)
        const winningIndex = Math.floor(Math.random() * PRIZES.length);
        const prize = PRIZES[winningIndex];

        // 2. Calculate rotation to land exactly on this prize
        // Logic:
        // Segment Angle = 360 / len
        // Prize Center = index * angle + angle/2
        // Pointer is at Top (0 deg)
        // We want Prize Center to be at 0 deg.
        // Rotation R: (PrizeCenter + R) % 360 = 0
        // R = -PrizeCenter = 360 - PrizeCenter

        const segmentAngle = 360 / PRIZES.length;
        const prizeCenterAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);

        // Target 270 degrees (12 o'clock / Top) to match the physical pointer
        let targetRotation = 270 - prizeCenterAngle;

        // Add random jitter WITHIN the segment (keep it safe, +/- 40% of width)
        const jitter = (Math.random() - 0.5) * (segmentAngle * 0.8);
        targetRotation += jitter;

        // Add 5 full spins (1800 degrees) to the LAST rotation position
        // Ensure we always move forward by at least 5 spins
        const minSpin = 360 * 5;

        // Current visual rotation is lastRotation.current
        // We want to arrive at `targetRotation` (mod 360)
        // But the absolute value must be > lastRotation.current + minSpin

        let newTotalRotation = lastRotation.current + minSpin;

        // Calculate remainder to align with target
        const currentMod = newTotalRotation % 360;
        const diff = targetRotation - currentMod;

        // Add diff (normalize positive if needed, though we want nearest forward)
        newTotalRotation += (diff >= 0 ? diff : diff + 360);

        lastRotation.current = newTotalRotation;

        // Phase 1: High speed
        await controls.start({
            rotate: newTotalRotation - 30, // Undershoot slightly for suspense
            transition: {
                duration: 2.5,
                ease: "circIn",
            }
        });

        // Phase 2: The "Sniper" crawl
        playSound('spin-tick');
        triggerShake(5);
        await controls.start({
            rotate: newTotalRotation,
            transition: {
                duration: 1.5,
                ease: "easeOut",
            }
        });

        // 3. Handle Result
        // @ts-ignore
        if (prize.label.includes('JACKPOT') || prize.type === 'dare' || prize.label === 'CHOCOLATE') {
            playSound('win');
            triggerSchoolPride();
            triggerShake(30);
        } else if (prize.label !== 'TRY AGAIN') {
            playSound('coin');
            triggerConfetti();
            triggerShake(10);
        } else {
            playSound('lose');
            triggerShake(5);
        }

        setTimeout(() => {
            if (prize.label === 'TRY AGAIN') {
                setIsSpinning(false);
            } else {
                let finalPrize = prize.value || prize.label;

                // If it's a dare or mystery, pick a random dare
                // @ts-ignore
                if (prize.type === 'dare') {
                    const randomDare = DARES[Math.floor(Math.random() * DARES.length)];
                    finalPrize = `DARE: ${randomDare}`;
                }

                onEnd({
                    success: true,
                    score: 100,
                    prize: finalPrize
                });
                setIsSpinning(false);
            }
        }, 1000);
    };

    return (
        <motion.div
            animate={{ x: Math.random() * shake - shake / 2, y: Math.random() * shake - shake / 2 }}
            className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark overflow-hidden"
        >
            <div className="relative">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] filter" />

                <motion.div
                    animate={controls}
                    className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-8 border-gray-800 shadow-[0_0_50px_rgba(255,0,255,0.2)] bg-gray-900 relative overflow-hidden"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {PRIZES.map((prize, i) => {
                            const segmentAngle = 360 / PRIZES.length;
                            const startAngle = i * segmentAngle;
                            const midAngle = startAngle + segmentAngle / 2;

                            // Calculate text position (polar to cartesian)
                            // Mid angle in radians
                            const rad = (deg: number) => (deg * Math.PI) / 180;
                            // Radius 35 (0-50 scale, so 70% out)
                            const textX = 50 + 35 * Math.cos(rad(midAngle));
                            const textY = 50 + 35 * Math.sin(rad(midAngle));

                            return (
                                <g key={i}>
                                    {/* Wedge */}
                                    <path
                                        d={`M50 50 L${50 + 50 * Math.cos(rad(startAngle))} ${50 + 50 * Math.sin(rad(startAngle))} A50 50 0 0 1 ${50 + 50 * Math.cos(rad(startAngle + segmentAngle))} ${50 + 50 * Math.sin(rad(startAngle + segmentAngle))} Z`}
                                        fill={prize.color}
                                        stroke="#1a1a1a"
                                        strokeWidth="0.5"
                                    />
                                    {/* Text */}
                                    <text
                                        x={textX}
                                        y={textY}
                                        fill="white"
                                        fontSize="4"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                                        style={{ fontFamily: '"Press Start 2P"', textShadow: '1px 1px 0px black' }}
                                    >
                                        {prize.label}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Gloss Reflection */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                </motion.div>

                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-gray-700 to-black rounded-full border-4 border-gray-500 shadow-xl flex items-center justify-center">
                    <div className="w-12 h-12 bg-arcade-dark rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎰</span>
                    </div>
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-arcade text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue mt-8 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)] animate-pulse-fast">
                SPIN & WIN
            </h1>

            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-8 md:mt-12 px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-arcade-purple to-neon-pink text-white font-arcade text-xl md:text-2xl rounded-lg border-b-8 border-b-[rgba(0,0,0,0.5)] active:border-b-0 active:translate-y-2 transition-all shadow-lg hover:shadow-neon-pink disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSpinning ? '...' : 'SPIN!'}
            </button>

            <button onClick={onExit} className="mt-8 text-sm text-gray-500 hover:text-white underline">
                Back to Lobby
            </button>
        </motion.div>
    );
};
