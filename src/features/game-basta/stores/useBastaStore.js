import { create } from 'zustand';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore';
import { BASTA_CATEGORIES } from '../data/categories';

export const ALPHABET = 'ABCDEFGHIJKLMNOPRSTW'.split('');

const CATEGORIES = BASTA_CATEGORIES;

export const useBastaStore = create((set, get) => ({
  // Game Configuration
  turnDuration: 20,
  categories: CATEGORIES,

  // Game State
  gameStatus: 'setup', // setup, playing, finished
  currentCategory: '',
  availableLetters: [...ALPHABET],
  usedLetters: [],
  currentPlayerId: null,
  gamePlayers: [], // Shuffled local copy
  winnerTeam: null, // 'players' (if all letters used) or 'time' (if timer runs out)

  // Actions
  setTurnDuration: (seconds) => set({ turnDuration: seconds }),

  startGame: () => {
    const globalPlayers = usePlayerStore.getState().players;
    if (globalPlayers.length === 0) return;

    // Shuffle Players (Fisher-Yates)
    const shuffledPlayers = [...globalPlayers];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [
        shuffledPlayers[j],
        shuffledPlayers[i],
      ];
    }

    const startId = shuffledPlayers[0].id;
    const randomCategory =
      CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    set((state) => ({
      gameStatus: 'playing',
      currentCategory: randomCategory,
      availableLetters: [...ALPHABET],
      usedLetters: [],
      gamePlayers: shuffledPlayers,
      currentPlayerId: startId,
      timer: state.turnDuration,
      winnerTeam: null,
    }));
  },

  selectLetter: (letter) => {
    const {
      availableLetters,
      usedLetters,
      turnDuration,
      currentPlayerId,
      gamePlayers,
    } = get();

    // Fallback if gamePlayers is empty for some reason (shouldn't happen in normal flow)
    const players =
      gamePlayers.length > 0 ? gamePlayers : usePlayerStore.getState().players;

    // Toggle behavior: If letter is already used, make it available again (correction)
    // Toggle behavior: Allow undoing ONLY the last selected letter
    if (usedLetters.includes(letter)) {
      // Check if it's the last one
      const lastUsed = usedLetters[usedLetters.length - 1];
      if (letter !== lastUsed) return; // Cannot undo older letters

      const newUsed = usedLetters.slice(0, -1);
      const newAvailable = [...availableLetters, letter]; // Order doesn't matter for UI mapping

      // Revert player logic
      let prevPlayerId = currentPlayerId;
      if (players.length > 0) {
        const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
        const idx = currentIndex === -1 ? 0 : currentIndex;
        // Move backwards
        const prevIndex = (idx - 1 + players.length) % players.length;
        prevPlayerId = players[prevIndex].id;
      }

      set({
        usedLetters: newUsed,
        availableLetters: newAvailable,
        currentPlayerId: prevPlayerId,
        timer: turnDuration, // Reset timer for the player getting their turn back
      });
      return;
    }

    if (!availableLetters.includes(letter)) return; // Should catch this above, but safe guard

    const newUsed = [...usedLetters, letter];
    const newAvailable = availableLetters.filter((l) => l !== letter);

    if (newAvailable.length === 0) {
      // Players won!
      set({
        gameStatus: 'finished',
        winnerTeam: 'players',
        availableLetters: [],
        usedLetters: newUsed,
      });
      return;
    }

    // Next player logic
    let nextPlayerId = currentPlayerId;
    if (players.length > 0) {
      const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
      // If current player not found (e.g. removed?), default to 0
      const idx = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = (idx + 1) % players.length;
      nextPlayerId = players[nextIndex].id;
    }

    set({
      availableLetters: newAvailable,
      usedLetters: newUsed,
      currentPlayerId: nextPlayerId,
      timer: turnDuration, // Reset timer for next player: "y sigue el siguiente jugador"
    });
  },

  tickTimer: () => {
    const { timer, gameStatus } = get();
    if (gameStatus !== 'playing') return;

    if (timer <= 0) {
      set({ gameStatus: 'finished', winnerTeam: 'time' });
    } else {
      set({ timer: timer - 1 });
    }
  },

  resetGame: () => {
    set({ gameStatus: 'setup' });
  },
}));
