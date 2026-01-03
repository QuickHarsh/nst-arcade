import { useRef, useEffect, useState } from 'react';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';

export const EmojiRain = ({ onEnd, onExit }: GameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const { playSound } = useArcadeSound();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let playerX = canvas.width / 2;
        const playerWidth = 60;
        const playerHeight = 10;
        let localItems: any[] = [];
        let localScore = 0;

        let gameOver = false;
        let animationFrameId: number;

        const SPAWN_RATE = 500;
        let lastSpawn = 0;

        const GOOD_ITEMS = ['🍎', '💎', '⭐', '🍕'];
        const BAD_ITEMS = ['💣', '💩'];

        const handleMove = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            playerX = Math.max(playerWidth / 2, Math.min(canvas.width - playerWidth / 2, clientX - rect.left));
            if ('touches' in e) e.preventDefault();
        };

        window.addEventListener('mousemove', handleMove as any);
        canvas.addEventListener('touchmove', handleMove as any, { passive: false });

        const loop = (timestamp: number) => {
            if (gameOver) return;

            if (timestamp - lastSpawn > SPAWN_RATE) {
                const isGood = Math.random() > 0.3; // 70% good items
                localItems.push({
                    x: Math.random() * canvas.width,
                    y: -30,
                    speed: 2 + Math.random() * 3,
                    content: isGood
                        ? GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)]
                        : BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)],
                    isGood
                });
                lastSpawn = timestamp;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Player
            ctx.fillStyle = '#ff00ff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff00ff';
            ctx.fillRect(playerX - playerWidth / 2, canvas.height - 30, playerWidth, playerHeight);

            // Update and Draw Items
            ctx.font = '24px serif';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 0;

            for (let i = localItems.length - 1; i >= 0; i--) {
                const item = localItems[i];
                item.y += item.speed;

                ctx.fillText(item.content, item.x, item.y);

                // Check catch
                if (item.y > canvas.height - 40 && item.y < canvas.height - 20 &&
                    Math.abs(item.x - playerX) < playerWidth / 2 + 10) {

                    if (item.isGood) {
                        localScore++;
                        playSound('coin');
                        setScore(localScore);
                        if (localScore >= 20) {
                            gameOver = true;
                            onEnd({ success: true, score: 20, prize: 'CATCHER' });
                        }
                    } else {
                        localScore = Math.max(0, localScore - 5);
                        playSound('click'); // loss sound
                        setScore(localScore);
                    }
                    localItems.splice(i, 1);
                } else if (item.y > canvas.height) {
                    localItems.splice(i, 1);
                }
            }

            if (!gameOver) animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', handleMove as any);
            canvas.removeEventListener('touchmove', handleMove as any);
            cancelAnimationFrame(animationFrameId);
        };
    }, [playSound, onEnd]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4 touch-none">
            <div className="text-neon-pink font-arcade mb-4 text-2xl">CAUGHT: {score}/20</div>
            <canvas
                ref={canvasRef}
                width={350}
                height={500}
                className="border-4 border-neon-blue rounded-lg bg-black/50 cursor-none touch-none shadow-[0_0_30px_#00ffff]"
            />
            <p className="text-gray-500 mt-4 text-sm font-mono">Catch good items, avoid bombs!</p>
            <button onClick={onExit} className="mt-8 text-gray-500 hover:text-white underline">EXIT</button>
        </div>
    );
};
