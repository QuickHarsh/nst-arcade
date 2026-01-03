import { useRef } from 'react';

type SoundType = 'click' | 'spin-tick' | 'win' | 'coin' | 'hit' | 'combo' | 'retro-jump' | 'mix-kit-spin' | 'lose';

export const useArcadeSound = () => {
    const audioContext = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContext.current.state === 'suspended') {
            audioContext.current.resume();
        }
    };

    const playSound = (type: SoundType, options: { pitch?: number } = {}) => {
        initAudio(); // Ensure context is ready
        if (!audioContext.current) return;

        const ctx = audioContext.current;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        const pitch = options.pitch ?? 1;

        switch (type) {
            case 'click':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400 * pitch, now);
                osc.frequency.exponentialRampToValueAtTime(100 * pitch, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'spin-tick':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'coin':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.linearRampToValueAtTime(2000, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;

            case 'win':
                // Simple arpeggio
                [440, 554, 659, 880, 1108, 1318].forEach((freq, i) => {
                    const oscWin = ctx.createOscillator();
                    const gainWin = ctx.createGain();
                    oscWin.connect(gainWin);
                    gainWin.connect(ctx.destination);

                    oscWin.type = 'square';
                    oscWin.frequency.value = freq;

                    const startTime = now + i * 0.1;
                    gainWin.gain.setValueAtTime(0.1, startTime);
                    gainWin.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

                    oscWin.start(startTime);
                    oscWin.stop(startTime + 0.2);
                });
                break;

            case 'hit':
                // Low punch/thud
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'combo':
                // High chime
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.linearRampToValueAtTime(1760, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'retro-jump':
                // Rising slide
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'mix-kit-spin':
                // Long spin accumulation sound
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(800, now + 1.0);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
                osc.start(now);
                osc.stop(now + 1.0);
                break;

            case 'lose':
                // Descending slide / thud
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
        }
    };

    return { playSound };
};
