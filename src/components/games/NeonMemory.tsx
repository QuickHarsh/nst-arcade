import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';

const ICONS = ['🚀', '🌟', '💎', '🎮', '👾', '🔥'];
const CARDS = [...ICONS, ...ICONS].map((icon, i) => ({ id: i, icon, matched: false }));

export const NeonMemory = ({ onEnd, onExit }: GameProps) => {
    const [cards, setCards] = useState(CARDS.sort(() => Math.random() - 0.5));
    const [flipped, setFlipped] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const { playSound } = useArcadeSound();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer);
                    onEnd({ success: false, score: 0 });
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onEnd]);

    useEffect(() => {
        if (flipped.length === 2) {
            const [first, second] = flipped;
            if (cards[first].icon === cards[second].icon) {
                playSound('coin');
                setCards((prev) =>
                    prev.map((c, i) => (i === first || i === second ? { ...c, matched: true } : c))
                );
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    }, [flipped, cards, playSound]);

    useEffect(() => {
        if (cards.every((c) => c.matched)) {
            onEnd({ success: true, score: timeLeft * 100, prize: 'SMART COOKIE' });
        }
    }, [cards, onEnd, timeLeft]);

    const handleCardClick = (index: number) => {
        if (flipped.length < 2 && !flipped.includes(index) && !cards[index].matched) {
            playSound('click');
            setFlipped([...flipped, index]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4">
            <div className="flex justify-between w-full max-w-md mb-8">
                <div className="text-neon-blue font-arcade">TIME: {timeLeft}s</div>
                <button onClick={onExit} className="text-gray-500 hover:text-white underline">EXIT</button>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full max-w-md">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: card.matched || flipped.includes(index) ? 180 : 0 }}
                        className="aspect-square relative cursor-pointer"
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="absolute inset-0 bg-arcade-purple border-2 border-neon-pink rounded-lg flex items-center justify-center text-3xl backface-hidden">
                            ?
                        </div>
                        <div
                            className="absolute inset-0 bg-neon-blue rounded-lg flex items-center justify-center text-4xl backface-hidden"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
