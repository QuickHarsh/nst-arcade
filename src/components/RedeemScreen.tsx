import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';

interface RedeemScreenProps {
    prize: string;
    onReset: () => void;
}

export const RedeemScreen = ({ prize, onReset }: RedeemScreenProps) => {
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
                        <p className="font-mono text-xs text-gray-500">Code: TEK-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded border-2 border-gray-200">
                        <p className="font-bold mb-4 font-sans uppercase text-sm">To Claim Your Prize:</p>
                        <button className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-gray-800 transition-colors">
                            <Download size={18} />
                            Download App
                        </button>
                        <button className="w-full mt-2 bg-white border-2 border-black text-black py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors">
                            <Share2 size={18} />
                            Share Win
                        </button>
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
