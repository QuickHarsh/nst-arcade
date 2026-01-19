import { DARES } from '../data/dares';

export const getRandomPrize = (): string => {
    // Probabilities (Total 100%)
    // CHOCOLATE: 10%
    // JACKPOT: 5%
    // DARE: 85%
    // TRY AGAIN: 0% (We assume winners of games don't get 'Try Again')

    const rand = Math.random() * 100;

    if (rand < 10) {
        return 'CHOCOLATE BAR';
    } else if (rand < 15) {
        return 'JACKPOT! MEGA PRIZE';
    } else {
        const randomDare = DARES[Math.floor(Math.random() * DARES.length)];
        return `DARE: ${randomDare}`;
    }
};
