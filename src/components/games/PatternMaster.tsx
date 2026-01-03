import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';

const COLORS = ['#ff00ff', '#00ffff', '#0aff00', '#ffd700'];

export const PatternMaster = ({ onEnd, onExit }: GameProps) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerInput, setPlayerInput] = useState<number[]>([]);
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [message, setMessage] = useState('WATCH');
    const { playSound } = useArcadeSound();

    // Start game logic
    useEffect(() => {
        addToSequence();
    }, []);

    const addToSequence = () => {
        setMessage('WATCH');
        setIsPlayingSequence(true);
        setPlayerInput([]);
        const nextColor = Math.floor(Math.random() * 4);
        setSequence(prev => [...prev, nextColor]);
    };

    useEffect(() => {
        if (isPlayingSequence && sequence.length > 0) {
            let i = 0;
            const interval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setIsPlayingSequence(false);
                    setActiveButton(null);
                    setMessage('REPEAT');
                    return;
                }

                setActiveButton(sequence[i]);
                playSound('coin'); // Reusing coin sound as a 'tone'

                setTimeout(() => setActiveButton(null), 400);
                i++;
            }, 800);

            return () => clearInterval(interval);
        }
    }, [sequence, isPlayingSequence]);

    const handleColorClick = (index: number) => {
        if (isPlayingSequence) return;

        playSound('click');
        const newInput = [...playerInput, index];
        setPlayerInput(newInput);

        // Check correctness
        if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
            // Wrong
            setMessage('GAME OVER');
            setTimeout(() => onEnd({ success: false, score: sequence.length - 1 }), 1000);
            return;
        }

        // Sequence complete?
        if (newInput.length === sequence.length) {
            if (sequence.length >= 8) {
                // Win condition
                onEnd({ success: true, score: 8, prize: 'MEMORY MASTER' });
            } else {
                // Next round
                setMessage('GOOD!');
                setTimeout(addToSequence, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4">
            <div className="text-3xl font-arcade text-white mb-8 animate-pulse">{message}</div>
            <div className="text-sm font-mono text-gray-500 mb-8">Round: {sequence.length}/8</div>

            <div className="grid grid-cols-2 gap-4">
                {COLORS.map((color, index) => (
                    <motion.div
                        key={index}
                        whileTap={{ scale: 0.9 }}
                        className={`w-32 h-32 rounded-2xl cursor-pointer transition-all duration-200 ${activeButton === index ? 'brightness-150 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.8)]' : 'brightness-100 opacity-80'
                            }`}
                        style={{
                            backgroundColor: color,
                            boxShadow: activeButton === index ? `0 0 30px ${color}` : 'none'
                        }}
                        onClick={() => handleColorClick(index)}
                    />
                ))}
            </div>

            <button onClick={onExit} className="mt-12 text-gray-500 hover:text-white underline">EXIT</button>
        </div>
    );
};
