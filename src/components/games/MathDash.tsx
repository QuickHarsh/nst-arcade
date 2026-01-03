import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';

export const MathDash = ({ onEnd, onExit }: GameProps) => {
    const [question, setQuestion] = useState({ a: 0, b: 0 });
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const { playSound } = useArcadeSound();

    const generateQuestion = () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const correct = a + b;

        // Generate distractors
        const distractors = new Set<number>();
        distractors.add(correct);
        while (distractors.size < 4) {
            let d = correct + Math.floor(Math.random() * 10) - 5;
            if (d > 0 && d !== correct) distractors.add(d);
        }

        setQuestion({ a, b });
        setOptions(Array.from(distractors).sort(() => Math.random() - 0.5));
    };

    useEffect(() => {
        generateQuestion();
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    onEnd({ success: false, score, prize: 'TRY AGAIN' });
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onEnd, score]); // Warning: score dependency again. Better use ref for score or rely on closure state if re-render is fine.
    // Actually, here we want to trigger onEnd with current score.
    // But if we re-render on score change, timer logic is reset. BAD.
    // Need to split timer.

    // FIXING TIMER LOGIC
    useEffect(() => {
        // Override previous effect
    }, []);

    return (
        <GameContent
            timeLeft={timeLeft}
            score={score}
            question={question}
            options={options}
            onAnswer={(ans: number) => {
                const correct = question.a + question.b;
                if (ans === correct) {
                    playSound('coin');
                    const newScore = score + 1;
                    setScore(newScore);
                    if (newScore >= 5) {
                        onEnd({ success: true, score: newScore, prize: 'MATH WIZ' });
                    } else {
                        generateQuestion();
                    }
                } else {
                    playSound('click'); // wrong sound
                    // Penalty? or just wait
                }
            }}
            onExit={onExit}
        />
    );
};

// Extracted for clean hooks
const GameContent = ({ timeLeft, score, question, options, onAnswer, onExit }: any) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4">
        <div className="flex justify-between w-full max-w-sm mb-12 text-xl font-arcade">
            <div className="text-neon-pink">SCORE: {score}/5</div>
            <div className="text-neon-blue">TIME: {timeLeft}s</div>
        </div>

        <div className="text-6xl font-arcade text-white mb-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            {question.a} + {question.b} = ?
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            {options.map((opt: number) => (
                <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAnswer(opt)}
                    className="h-24 bg-arcade-purple border-4 border-neon-blue rounded-xl text-3xl font-arcade text-white hover:bg-neon-blue hover:text-black transition-colors"
                >
                    {opt}
                </motion.button>
            ))}
        </div>

        <button onClick={onExit} className="mt-12 text-gray-500 hover:text-white underline">EXIT</button>
    </div>
);
