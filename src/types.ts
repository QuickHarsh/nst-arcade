import type { ComponentType } from 'react';

export type GameResult = {
    success: boolean;
    score: number;
    prize?: string; // Optional override for the prize
};

export interface GameProps {
    onEnd: (result: GameResult) => void;
    onExit: () => void;
}

export interface IGame {
    id: string;
    title: string;
    description: string;
    goal: string;
    thumbnailColor: string; // CSS color string for now, could be image URL later
    component: ComponentType<GameProps>;
}
