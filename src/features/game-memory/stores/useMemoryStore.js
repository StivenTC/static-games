import { create } from 'zustand';

const COLORS = ['green', 'red', 'yellow', 'blue'];

export const useMemoryStore = create((set, get) => ({
  gameState: 'setup', // setup, watching, playing, gameover
  sequence: [],
  playerInput: [],
  currentPlayerId: null,
  scores: {}, // Track rounds survived? Or just rounds?
  round: 0,

  setupGame: (players) => {
    set({
      gameState: 'watching',
      sequence: [],
      playerInput: [],
      scores: {},
      round: 1,
      currentPlayerId: players[0].id, // Start with first player? Random?
    });
    // Start first sequence
    get().addToSequence();
  },

  addToSequence: () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    set((state) => ({
      sequence: [...state.sequence, randomColor],
      playerInput: [],
      gameState: 'watching', // Switch to watching mode so component plays sequence
    }));
  },

  handleInput: (color) => {
    const { sequence, playerInput } = get();
    const expectedColor = sequence[playerInput.length];

    if (color !== expectedColor) {
      // Mistake!
      set({ gameState: 'gameover' });
      return false; // Result needed for UI audio?
    }

    const newInput = [...playerInput, color];
    set({ playerInput: newInput });

    // Check if sequence complete
    if (newInput.length === sequence.length) {
      // Success!
      // Delay slightly before next turn to allow success sound?
      // Actually component should handle "Success" audio then call nextTurn?
      // Store just updates state.
      return true; // Sequence completed
    }

    return null; // Correct but not done
  },

  nextTurn: (players) => {
    // Rotate player
    const { currentPlayerId } = get();
    const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;

    set({
      currentPlayerId: players[nextIndex].id,
      round: get().round + 1,
    });
    get().addToSequence();
  },

  setGameState: (state) => set({ gameState: state }), // e.g., to switch from 'watching' to 'playing' after sequence plays

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
