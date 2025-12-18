import { create } from 'zustand';
import { tabuWords } from '../data/tabuWords';

const GAME_DURATION = 60;

export const useTabuStore = create((set, get) => ({
  gameState: 'setup', // setup, playing, result
  deck: [],
  currentCard: null,
  score: 0,
  timeLeft: GAME_DURATION,

  setupGame: () => {
    // Shuffle deck
    const shuffled = [...tabuWords].sort(() => Math.random() - 0.5);
    set({
      gameState: 'playing',
      deck: shuffled,
      currentCard: null,
      score: 0,
      timeLeft: GAME_DURATION,
    });
    // Immediately pick first card
    get().nextCard();
  },

  decrementTime: () => {
    const { timeLeft, gameState } = get();
    if (gameState !== 'playing') return;

    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      set({ gameState: 'roundOver' });
    }
  },

  nextTurn: () => {
    set({
      gameState: 'playing',
      score: 0,
      timeLeft: GAME_DURATION,
    });
    get().nextCard();
  },

  nextCard: () => {
    const { deck } = get();
    if (deck.length === 0) {
      // Reshuffle if empty (infinite play)
      const newDeck = [...tabuWords].sort(() => Math.random() - 0.5);
      const card = newDeck.pop();
      set({ deck: newDeck, currentCard: card });
    } else {
      const newDeck = [...deck];
      const card = newDeck.pop();
      set({ deck: newDeck, currentCard: card });
    }
  },

  correctGuess: () => {
    set((state) => ({ score: state.score + 1 }));
    get().nextCard();
  },

  skipCard: () => {
    // Usually Tabu penalizes or just skips.
    // Simplified: Just skip, no point change? Or maybe -1?
    // Let's assume standard "Pasapalabra" style or just next.
    // User said "Simple". I'll just go next without point penalty for now unless specified.
    get().nextCard();
  },

  resetGame: () => {
    set({
      gameState: 'setup',
      score: 0,
      timeLeft: GAME_DURATION,
      currentCard: null,
    });
  },
}));
