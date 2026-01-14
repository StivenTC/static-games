import { create } from 'zustand';
import { tabuWords } from '../data/tabuWords';

const GAME_DURATION = 60;

export const useTabuStore = create((set, get) => ({
  gameState: 'setup', // setup, playing, roundOver
  deck: [],
  currentCard: null,
  currentPlayerId: null,
  scores: {}, // { playerId: points }
  playedIds: [], // Track players who have taken a turn in the current cycle
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
      playedIds: [],
      timeLeft: GAME_DURATION,
    });
    // Pick first player and card
    get().nextTurn(players);
  },

  decrementTime: () => {
    const { timeLeft, gameState } = get();
    if (gameState !== 'playing') return;

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      set({ timeLeft: 0, gameState: 'roundOver' });
    }
  },

  nextTurn: (players) => {
    const { playedIds } = get();

    // Filter out players who have already played in this cycle
    let candidates = players.filter((p) => !playedIds.includes(p.id));

    // If everyone has played, reset the cycle
    if (candidates.length === 0) {
      candidates = [...players];
      set({ playedIds: [] });
    }

    // Pick random candidate
    const randomPlayer =
      candidates[Math.floor(Math.random() * candidates.length)];

    // Update state
    set((state) => ({
      gameState: 'turnReady', // Changed from 'playing' to 'turnReady'
      timeLeft: GAME_DURATION,
      currentPlayerId: randomPlayer.id,
      playedIds:
        candidates.length === players.length
          ? [randomPlayer.id]
          : [...state.playedIds, randomPlayer.id],
    }));

    get().nextCard();
  },

  startTurn: () => {
    set({ gameState: 'playing' });
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
    const { currentPlayerId } = get();
    set((state) => ({
      scores: {
        ...state.scores,
        [guesserId]: (state.scores[guesserId] || 0) + 1,
        [currentPlayerId]: (state.scores[currentPlayerId] || 0) + 1,
      },
      gameState: 'roundOver',
    }));
  },

  skipCard: () => {
    get().nextCard();
  },

  resetGame: () => {
    set({
      gameState: 'setup',
      scores: {},
      playedIds: [],
      timeLeft: GAME_DURATION,
      currentCard: null,
      currentPlayerId: null,
    });
  },
}));
