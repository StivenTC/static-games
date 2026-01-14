import { create } from 'zustand';

const COLORS = ['green', 'red', 'yellow', 'blue'];

export const useMemoryStore = create((set, get) => ({
  gameState: 'setup',
  sequence: [],
  playerInput: [],
  currentPlayerId: null,
  scores: {},
  round: 0,

  setupGame: (players) => {
    set({
      gameState: 'watching',
      sequence: [],
      playerInput: [],
      scores: {},
      round: 1,
      currentPlayerId: players[0].id,
    });
    get().addToSequence();
  },

  addToSequence: () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    set((state) => ({
      sequence: [...state.sequence, randomColor],
      playerInput: [],
      gameState: 'watching',
    }));
  },

  handleInput: (color) => {
    const { sequence, playerInput } = get();
    const expectedColor = sequence[playerInput.length];

    if (color !== expectedColor) {
      set({ gameState: 'gameover' });
      return false;
    }

    const newInput = [...playerInput, color];
    set({ playerInput: newInput });

    if (newInput.length === sequence.length) {
      return true;
    }

    return null;
  },

  nextTurn: (players) => {
    const { currentPlayerId } = get();
    const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;

    set({
      currentPlayerId: players[nextIndex].id,
      round: get().round + 1,
    });
    get().addToSequence();
  },

  setGameState: (state) => set({ gameState: state }),

  resetGame: () => {
    set({
      gameState: 'setup',
      sequence: [],
      playerInput: [],
      currentPlayerId: null,
      round: 0,
    });
  },
}));
