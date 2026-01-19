import { useState } from 'react';
import { AttractScreen } from './components/AttractScreen';
import { GameLobby } from './components/GameLobby';
import { ResultScreen } from './components/ResultScreen';
import { RedeemScreen } from './components/RedeemScreen';

// Game Imports
import { SpinWheel } from './components/SpinWheel';
import { CyberWhack } from './components/games/CyberWhack';
import { PatternMaster } from './components/games/PatternMaster';
import { LuckySlots } from './components/games/LuckySlots';
import { ReactionGrid } from './components/games/ReactionGrid';
import type { IGame, GameResult } from './types';

// Image Imports
import spinWinImg from './assets/games/spin-win.png';
import cyberWhackImg from './assets/games/cyber-whack.png';
import patternMasterImg from './assets/games/pattern-master.png';
import luckySlotsImg from './assets/games/lucky-slots.png';
import reactionGridImg from './assets/games/reaction-grid.png';

// Types for our app state
export type AppPhase = 'attract' | 'lobby' | 'game' | 'result' | 'redeem';

// --- GAME REGISTRY ---
const GAMES: IGame[] = [
  {
    id: 'spin-wheel',
    title: 'Spin & Win',
    description: 'Classic wheel of fortune. Test your luck!',
    goal: 'Spin to win',
    image: spinWinImg,
    thumbnailColor: '#ff00ff',
    component: SpinWheel,
  },
  {
    id: 'cyber-whack',
    title: 'Cyber Whack',
    description: 'Hit the glitching nodes! Fastest reflexes win.',
    goal: 'Score 1000pts',
    image: cyberWhackImg,
    thumbnailColor: '#0aff00',
    component: CyberWhack,
  },
  {
    id: 'pattern-master',
    title: 'Pattern Master',
    description: 'Memorize the sequence. Repeat the pattern.',
    goal: 'Complete 8 rounds',
    image: patternMasterImg,
    thumbnailColor: '#ffd700',
    component: PatternMaster,
  },
  {
    id: 'lucky-slots',
    title: 'Lucky Slots',
    description: 'Line up the symbols for a jackpot.',
    goal: 'Match 3 symbols',
    image: luckySlotsImg,
    thumbnailColor: '#302b63',
    component: LuckySlots,
  },
  {
    id: 'reaction-grid',
    title: 'Reaction Grid',
    description: 'Test your reaction speed. Click green fast!',
    goal: 'Avg < 350ms',
    image: reactionGridImg,
    thumbnailColor: '#ff00ff',
    component: ReactionGrid,
  },
];

function App() {
  const [phase, setPhase] = useState<AppPhase>('attract');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const activeGame = GAMES.find(g => g.id === activeGameId);

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    setPhase('result');
  };

  return (
    <div className="min-h-screen bg-arcade-dark text-white font-arcade overflow-hidden">
      {phase === 'attract' && (
        <AttractScreen onStart={() => setPhase('lobby')} />
      )}

      {phase === 'lobby' && (
        <GameLobby
          games={GAMES}
          onSelectGame={(id) => {
            setActiveGameId(id);
            setPhase('game');
          }}
          onBack={() => setPhase('attract')}
        />
      )}

      {phase === 'game' && activeGame && (
        <activeGame.component
          onEnd={handleGameEnd}
          onExit={() => setPhase('lobby')}
        />
      )}

      {phase === 'result' && gameResult && (
        <ResultScreen
          prize={gameResult.prize || 'MYSTERY PRIZE'} // Use game prize or default
          onRedeem={() => setPhase('redeem')}
        />
      )}

      {phase === 'redeem' && gameResult && (
        <RedeemScreen
          prize={gameResult.prize || 'MYSTERY PRIZE'}
          onReset={() => {
            setPhase('attract');
            setActiveGameId(null);
            setGameResult(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
