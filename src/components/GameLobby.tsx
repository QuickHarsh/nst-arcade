import { motion } from 'framer-motion';
import type { IGame } from '../types';
import { GameCard } from './GameCard';

interface GameLobbyProps {
    games: IGame[];
    onSelectGame: (gameId: string) => void;
    onBack: () => void;
}

export const GameLobby = ({ games, onSelectGame, onBack }: GameLobbyProps) => {
    return (
        <div className="h-screen bg-arcade-dark p-6 md:p-12 overflow-y-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h1 className="text-3xl md:text-5xl font-arcade text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                        ARCADE LOBBY
                    </h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm tracking-wider">SELECT A GAME TO WIN YOUR PRIZE</p>
                </motion.div>

                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-white font-arcade text-xs underline"
                >
                    EXIT
                </button>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20">
                {games.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GameCard game={game} onSelect={onSelectGame} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
