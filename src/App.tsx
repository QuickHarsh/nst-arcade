import { useState } from 'react';
import { AttractScreen } from './components/AttractScreen';
import { GameLobby } from './components/GameLobby';
import { ResultScreen } from './components/ResultScreen';
import { RedeemScreen } from './components/RedeemScreen';

// Game Imports
import { SpinWheel } from './components/SpinWheel';
import { NeonMemory } from './components/games/NeonMemory';
import { CyberWhack } from './components/games/CyberWhack';
import { TurboTapper } from './components/games/TurboTapper';
import { PatternMaster } from './components/games/PatternMaster';
import { LuckySlots } from './components/games/LuckySlots';
import { ReactionGrid } from './components/games/ReactionGrid';
import { SpaceDodge } from './components/games/SpaceDodge';
import { MathDash } from './components/games/MathDash';
import { EmojiRain } from './components/games/EmojiRain';
import type { IGame, GameResult } from './types';

// Types for our app state
export type AppPhase = 'attract' | 'lobby' | 'game' | 'result' | 'redeem';

// --- GAME REGISTRY ---
const GAMES: IGame[] = [
  {
    id: 'spin-wheel',
    title: 'Spin & Win',
    description: 'Classic wheel of fortune. Test your luck!',
    goal: 'Spin to win',
    thumbnailColor: '#ff00ff',
    component: SpinWheel,
  },
  {
    id: 'neon-memory',
    title: 'Neon Memory',
    description: 'Match the glowing symbols before time runs out.',
    goal: 'Match all pairs < 60s',
    thumbnailColor: '#00ffff',
    component: NeonMemory,
  },
  {
    id: 'cyber-whack',
    title: 'Cyber Whack',
    description: 'Hit the glitching nodes! Fastest reflexes win.',
    goal: 'Score 1000pts',
    thumbnailColor: '#0aff00',
    component: CyberWhack,
  },
  {
    id: 'turbo-tapper',
    title: 'Turbo Tapper',
    description: 'Mash the button. Do not stop.',
    goal: '50 taps in 10s',
    thumbnailColor: '#ff0000',
    component: TurboTapper,
  },
  {
    id: 'pattern-master',
    title: 'Pattern Master',
    description: 'Memorize the sequence. Repeat the pattern.',
    goal: 'Complete 8 rounds',
    thumbnailColor: '#ffd700',
    component: PatternMaster,
  },
  {
    id: 'lucky-slots',
    title: 'Lucky Slots',
    description: 'Line up the symbols for a jackpot.',
    goal: 'Match 3 symbols',
    thumbnailColor: '#302b63',
    component: LuckySlots,
  },
  {
    id: 'reaction-grid',
    title: 'Reaction Grid',
    description: 'Test your reaction speed. Click green fast!',
    goal: 'Avg < 350ms',
    thumbnailColor: '#ff00ff',
    component: ReactionGrid,
  },
  {
    id: 'space-dodge',
    title: 'Space Dodge',
    description: 'Survive the asteroid field.',
    goal: 'Survive 15s',
    thumbnailColor: '#00ffff',
    component: SpaceDodge,
  },
  {
    id: 'math-dash',
    title: 'Math Dash',
    description: 'Solve equations under pressure.',
    goal: '5 Correct Answers',
    thumbnailColor: '#0aff00',
    component: MathDash,
  },
  {
    id: 'emoji-rain',
    title: 'Emoji Rain',
    description: 'Catch the loot, avoid the bombs.',
    goal: 'Collect 20 items',
    thumbnailColor: '#ff0000',
    component: EmojiRain,
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
