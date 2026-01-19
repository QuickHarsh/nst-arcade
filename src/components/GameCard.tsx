import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { IGame } from '../types';
import { useArcadeSound } from '../hooks/useArcadeSound';

interface GameCardProps {
    game: IGame;
    onSelect: (gameId: string) => void;
}

export const GameCard = ({ game, onSelect }: GameCardProps) => {
    const { playSound } = useArcadeSound();

    const handleHover = () => {
        playSound('spin-tick');
    };

    const handleClick = () => {
        playSound('click');
        onSelect(game.id);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={handleHover}
            onClick={handleClick}
            className="relative group cursor-pointer bg-white/5 border-2 border-transparent hover:border-neon-pink rounded-xl overflow-hidden backdrop-blur-sm transition-colors duration-300"
        >
            {/* Thumbnail Area */}
            <div
                className="h-40 w-full flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(45deg, #000000 0%, ${game.thumbnailColor} 100%)` }}
            >
                {game.image ? (
                    <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </>
                )}
            </div>

            {/* Info Area */}
            <div className="p-4">
                <h3 className="text-xl font-arcade text-white group-hover:text-neon-pink truncate mb-2 drop-shadow-md">
                    {game.title}
                </h3>
                <p className="text-xs font-mono text-gray-400 h-10 overflow-hidden line-clamp-2 mb-3">
                    {game.description}
                </p>

                {/* Goal Badge */}
                <div className="flex items-center gap-2 bg-black/30 w-fit px-2 py-1 rounded border border-white/10">
                    <span className="text-[10px] text-neon-blue font-bold uppercase">Goal:</span>
                    <span className="text-[10px] text-white font-mono">{game.goal}</span>
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-neon-pink/50 rounded-xl pointer-events-none transition-colors" />
        </motion.div>
    );
};
