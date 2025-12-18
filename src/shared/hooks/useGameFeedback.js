import { useCallback } from 'react';

/**
 * Hook to handle game feedback (vibration and sound).
 *
 * Usage:
 * const { triggerFeedback } = useGameFeedback();
 * triggerFeedback('success'); // plays sound and vibrates
 */
export const useGameFeedback = () => {
  const triggerVibration = useCallback((pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const playSound = useCallback((type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (type) {
        case 'tick':
          // High, short blip for timer
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        case 'click': // select
        case 'select':
          // Crisp click
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          gainNode.gain.setValueAtTime(0.05, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'reroll':
          // Slide up
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.15);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        // Simon Tones
        case 'simon-green': // E4
          osc.type = 'sine';
          osc.frequency.setValueAtTime(329.63, now);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case 'simon-red': // A4
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440.0, now);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case 'simon-yellow': // C#4
          osc.type = 'sine';
          osc.frequency.setValueAtTime(277.18, now);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case 'simon-blue': // E3
          osc.type = 'sine';
          osc.frequency.setValueAtTime(164.81, now);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case 'success': {
          // Major chord arpeggio
          const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
          notes.forEach((freq, i) => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc2.type = 'sine';
            osc2.frequency.value = freq;

            const time = now + i * 0.1;
            gain2.gain.setValueAtTime(0.0, time);
            gain2.gain.linearRampToValueAtTime(0.1, time + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

            osc2.start(time);
            osc2.stop(time + 0.4);
          });
          break;
        }

        case 'error':
          // Low buzz
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.linearRampToValueAtTime(100, now + 0.2);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;

        case 'gameover':
        case 'timeout':
          // Descending chime / Time's up buzzer
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(100, now + 0.8);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
          break;

        default:
          break;
      }
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }, []);

  const triggerFeedback = useCallback(
    (type) => {
      switch (type) {
        case 'tick':
          triggerVibration(50);
          playSound('tick');
          break;
        case 'select':
          triggerVibration(10);
          playSound('click');
          break;
        case 'success':
          triggerVibration([50, 50, 50]);
          playSound('success');
          break;
        case 'error':
          triggerVibration([100, 50, 100]);
          playSound('error');
          break;
        case 'gameover':
          triggerVibration([200, 100, 200, 100, 500]);
          playSound('gameover');
          break;
        case 'reroll':
          triggerVibration(30);
          playSound('reroll');
          break;
        case 'simon-green':
        case 'simon-red':
        case 'simon-yellow':
        case 'simon-blue':
          triggerVibration(50);
          playSound(type);
          break;
        default:
          break;
      }
    },
    [triggerVibration, playSound]
  );

  return { triggerFeedback };
};
