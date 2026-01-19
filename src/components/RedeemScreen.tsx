import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';

interface RedeemScreenProps {
    prize: string;
    onReset: () => void;
}

export const RedeemScreen = ({ prize, onReset }: RedeemScreenProps) => {
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleUnlock = () => {
        window.open('https://www.instagram.com/tekronfest/', '_blank');
        // Simulate a check/delay
        setTimeout(() => setIsUnlocked(true), 1000);
    };

    const handleUnstop = () => {
        window.open('https://unstop.com/college-fests/tekron-20-newton-school-of-technology-314358', '_blank');
    };

    return (
        <div className="fixed inset-0 bg-arcade-dark flex flex-col items-center justify-center p-6 z-50">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-white text-black p-8 rounded-lg shadow-2xl relative overflow-hidden"
            >
                {/* Ticket styling */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[linear-gradient(90deg,transparent_50%,#000_50%)] bg-[size:20px_20px]" />
                <div className="absolute bottom-0 left-0 w-full h-2 bg-[linear-gradient(90deg,transparent_50%,#000_50%)] bg-[size:20px_20px]" />

                <div className="text-center space-y-6">
                    <div className="border-b-2 border-black pb-4 border-dashed">
                        <h2 className="font-arcade text-2xl">PRIZE TICKET</h2>
                        <p className="text-sm font-mono text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="py-4">
                        <p className="font-mono text-gray-600 mb-2">REWARD:</p>
                        <h3 className="font-arcade text-3xl text-neon-purple mb-2">{prize}</h3>

                        <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-300">
                            {isUnlocked ? (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                    <p className="font-mono text-xs text-gray-500 mb-1">YOUR CODE:</p>
                                    <p className="font-mono text-xl font-bold tracking-widest text-black select-all">TEK-8DNTKV</p>
                                </motion.div>
                            ) : (
                                <div>
                                    <p className="font-mono text-xs text-gray-500 mb-2">LOCKED REWARD</p>
                                    <button
                                        onClick={handleUnlock}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded text-sm font-bold shadow hover:scale-105 transition-transform flex items-center justify-center gap-2 w-full"
                                    >
                                        <Share2 size={16} />
                                        Follow to Reveal Code
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-gray-100 p-4 rounded border-2 border-gray-200">
                            <p className="font-bold mb-4 font-sans uppercase text-sm">Next Steps:</p>
                            <button
                                onClick={handleUnstop}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-blue-700 transition-colors"
                            >
                                <Download size={18} />
                                Register on Unstop
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-black border-dashed">
                        <button onClick={onReset} className="text-gray-400 underline text-sm hover:text-black">
                            Start New Game
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
