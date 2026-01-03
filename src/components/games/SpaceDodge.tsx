import { useRef, useEffect, useState } from 'react';
import type { GameProps } from '../../types';
import { useArcadeSound } from '../../hooks/useArcadeSound';

export const SpaceDodge = ({ onEnd, onExit }: GameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameOver, setGameOver] = useState(false);
    const { playSound } = useArcadeSound();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let player = { x: canvas.width / 2, y: canvas.height / 2, size: 20 };
        let enemies = Array(5).fill(0).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: 15
        }));

        let animationFrameId: number;
        let startTime = Date.now();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            player.x = e.clientX - rect.left;
            player.y = e.clientY - rect.top;
        };

        // Touch support
        const handleTouchMove = (e: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            player.x = e.touches[0].clientX - rect.left;
            player.y = e.touches[0].clientY - rect.top;
            e.preventDefault();
        };

        window.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

        const loop = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, 15 - elapsed);
            setTimeLeft(Math.ceil(remaining));

            if (remaining <= 0) {
                setGameOver(true);
                onEnd({ success: true, score: 15, prize: 'SURVIVOR' });
                return;
            }

            ctx.fillStyle = '#0f0c29'; // arcade dark
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Player
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

            // Update and Draw Enemies
            ctx.fillStyle = '#ff0000';
            ctx.shadowColor = '#ff0000';
            enemies.forEach(enemy => {
                enemy.x += enemy.vx;
                enemy.y += enemy.vy;

                // Bounce
                if (enemy.x < 0 || enemy.x > canvas.width) enemy.vx *= -1;
                if (enemy.y < 0 || enemy.y > canvas.height) enemy.vy *= -1;

                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
                ctx.fill();

                // Collision
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < (player.size / 2 + enemy.size)) {
                    setGameOver(true);
                    onEnd({ success: false, score: Math.round(elapsed) });
                    playSound('click'); // playing 'loss' sound if available effectively
                }
            });

            if (!gameOver) {
                animationFrameId = requestAnimationFrame(loop);
            }
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [onEnd, playSound]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-arcade-dark p-4 touch-none">
            <div className="text-neon-blue font-arcade mb-4 text-2xl">SURVIVE: {timeLeft}s</div>
            <canvas
                ref={canvasRef}
                width={350}
                height={350}
                className="border-4 border-neon-pink rounded-lg bg-black cursor-none touch-none shadow-[0_0_30px_#ff00ff]"
            />
            <p className="text-gray-500 mt-4 text-sm font-mono">Use mouse/finger to dodge red orbs</p>
            <button onClick={onExit} className="mt-8 text-gray-500 hover:text-white underline">EXIT</button>
        </div>
    );
};
