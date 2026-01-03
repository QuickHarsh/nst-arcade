import { useState, useEffect, useRef } from 'react';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';

export const ReactionGrid = ({ onEnd, onExit }: GameProps) => {
    const [gameState, setGameState] = useState<'waiting' | 'ready' | 'clicked' | 'finished'>('waiting');
    const [activeCell, setActiveCell] = useState<number | null>(null);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [message, setMessage] = useState('WAIT FOR GREEN...');
    const startTimeRef = useRef<number>(0);
    const { playSound } = useArcadeSound();

    const GRID_SIZE = 16;
    const ATTEMPTS = 5;

    useEffect(() => {
        if (gameState === 'waiting') {
            const timeout = setTimeout(() => {
                setActiveCell(Math.floor(Math.random() * GRID_SIZE));
                setGameState('ready');
                startTimeRef.current = Date.now();
                setMessage('CLICK NOW!');
                playSound('coin');
            }, 1000 + Math.random() * 2000); // Random delay 1-3s

            return () => clearTimeout(timeout);
        }
    }, [gameState, playSound]);

    const handleClick = (index: number) => {
        if (gameState === 'ready' && index === activeCell) {
            const time = Date.now() - startTimeRef.current;
            playSound('click');
            const newTimes = [...reactionTimes, time];
            setReactionTimes(newTimes);

            if (newTimes.length >= ATTEMPTS) {
                setGameState('finished');
                const avg = newTimes.reduce((a, b) => a + b, 0) / ATTEMPTS;
                const win = avg < 350; // 350ms threshold
                setMessage(`AVG: ${Math.round(avg)}ms`);
                setTimeout(() => onEnd({
                    success: win,
                    score: Math.round(avg),
                    prize: win ? 'SPEEDSTER' : undefined
                }), 1000);
            } else {
                setMessage(`${time}ms`);
                setGameState('clicked');
                setActiveCell(null);
                setTimeout(() => {
                    setGameState('waiting');
                    setMessage('WAIT FOR GREEN...');
                }, 1000);
            }
        } else if (gameState === 'waiting') {
            // Penalty for early click?
            setMessage('TOO EARLY!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4">
            <div className="text-2xl font-arcade text-white mb-8">{message}</div>
            <div className="text-sm font-mono text-gray-500 mb-8">Attempt: {reactionTimes.length + 1}/{ATTEMPTS}</div>

            <div className="grid grid-cols-4 gap-4 w-full max-w-md aspect-square">
                {Array(GRID_SIZE).fill(null).map((_, index) => (
                    <div
                        key={index}
                        onMouseDown={() => handleClick(index)}
                        className={`rounded-lg transition-colors cursor-pointer ${activeCell === index && gameState === 'ready'
                            ? 'bg-neon-green shadow-[0_0_30px_#0aff00]'
                            : 'bg-white/10 hover:bg-white/20'
                            }`}
                    />
                ))}
            </div>

            <button onClick={onExit} className="mt-12 text-gray-500 hover:text-white underline">EXIT</button>
        </div>
    );
};
