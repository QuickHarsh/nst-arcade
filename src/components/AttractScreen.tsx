import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useArcadeSound } from '../hooks/useArcadeSound';

interface AttractScreenProps {
    onStart: () => void;
}

export const AttractScreen = ({ onStart }: AttractScreenProps) => {
    const { playSound } = useArcadeSound();

    const handleClick = () => {
        playSound('coin');
        onStart();
    };

    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-arcade-dark overflow-hidden cursor-pointer selection:bg-neon-pink selection:text-white"
            onClick={handleClick}
        >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,12,41,0.9)_2px,transparent_2px),linear-gradient(90deg,rgba(15,12,41,0.9)_2px,transparent_2px)] bg-[size:50px_50px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-20 pointer-events-none" />

            {/* Decorative Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-1000" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center space-y-12">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-6xl md:text-8xl font-arcade text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_5px_5px_rgba(0,255,255,0.5)]">
                        TEKRON
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-arcade text-neon-pink mt-4 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
                        ARCADE
                    </h2>
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="bg-black/40 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                >
                    <div className="flex items-center space-x-4">
                        <Gamepad2 className="w-8 h-8 text-neon-blue" />
                        <span className="font-arcade text-xl md:text-2xl text-white tracking-widest animate-pulse">
                            TAP TO START
                        </span>
                        <Gamepad2 className="w-8 h-8 text-neon-blue" />
                    </div>
                </motion.div>

                <p className="text-gray-400 font-sans text-sm tracking-widest uppercase opacity-60">
                    Coin inserted: 0/1
                </p>
            </div>
        </div>
    );
};
