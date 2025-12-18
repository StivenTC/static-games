import { create } from 'zustand';
import { tabuWords } from '../data/tabuWords';

const GAME_DURATION = 60;

export const useTabuStore = create((set, get) => ({
  gameState: 'setup', // setup, playing, roundOver
  deck: [],
  currentCard: null,
  currentPlayerId: null,
  scores: {}, // { playerId: points }
  score: 0, // Deprecated, but keeping for compatibility if referenced, though we move to scores map
  timeLeft: GAME_DURATION,

  setupGame: (players) => {
    // Shuffle deck
    const shuffled = [...tabuWords].sort(() => Math.random() - 0.5);
    // Initialize scores
    const initialScores = {};
    players.forEach((p) => {
      initialScores[p.id] = 0;
    });

    set({
      gameState: 'playing',
      deck: shuffled,
      currentCard: null,
      scores: initialScores,
      timeLeft: GAME_DURATION,
    });
    // Pick first player and card
    get().nextTurn(players);
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

  nextTurn: (players) => {
    // Pick random player to describe
    const randomPlayer = players[Math.floor(Math.random() * players.length)];

    set({
      gameState: 'playing',
      timeLeft: GAME_DURATION,
      currentPlayerId: randomPlayer.id,
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

  correctGuess: (guesserId) => {
    set((state) => ({
      scores: {
        ...state.scores,
        [guesserId]: (state.scores[guesserId] || 0) + 1,
      },
      gameState: 'roundOver',
    }));
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
      scores: {},
      timeLeft: GAME_DURATION,
      currentCard: null,
      currentPlayerId: null,
    });
  },
}));
