import { create } from 'zustand';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import { BASTA_CATEGORIES } from '../data/categories';

export const ALPHABET = 'ABCDEFGHIJKLMNOPRSTW'.split('');

const CATEGORIES = BASTA_CATEGORIES;

export const useBastaStore = create((set, get) => ({
  turnDuration: 20,
  categories: CATEGORIES,
  gameStatus: 'setup',
  currentCategory: '',
  availableLetters: [...ALPHABET],
  usedLetters: [],
  currentPlayerId: null,
  gamePlayers: [],
  winnerTeam: null,

  setTurnDuration: (seconds) => set({ turnDuration: seconds }),

  startGame: () => {
    const globalPlayers = usePlayerStore.getState().players;
    if (globalPlayers.length === 0) return;

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

  rerollCategory: () => {
    const { currentCategory } = get();
    let newCategory = currentCategory;
    while (newCategory === currentCategory) {
      newCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    }
    set({ currentCategory: newCategory });
  },

  selectLetter: (letter) => {
    const {
      availableLetters,
      usedLetters,
      turnDuration,
      currentPlayerId,
      gamePlayers,
    } = get();

    const players =
      gamePlayers.length > 0 ? gamePlayers : usePlayerStore.getState().players;

    if (usedLetters.includes(letter)) {
      const lastUsed = usedLetters[usedLetters.length - 1];
      if (letter !== lastUsed) return; // Only allow undoing the immediate last move

      const newUsed = usedLetters.slice(0, -1);
      const newAvailable = [...availableLetters, letter];

      let prevPlayerId = currentPlayerId;
      if (players.length > 0) {
        const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
        const idx = currentIndex === -1 ? 0 : currentIndex;
        const prevIndex = (idx - 1 + players.length) % players.length;
        prevPlayerId = players[prevIndex].id;
      }

      set({
        usedLetters: newUsed,
        availableLetters: newAvailable,
        currentPlayerId: prevPlayerId,
        timer: turnDuration,
      });
      return;
    }

    if (!availableLetters.includes(letter)) return;

    const newUsed = [...usedLetters, letter];
    const newAvailable = availableLetters.filter((l) => l !== letter);

    if (newAvailable.length === 0) {
      set({
        gameStatus: 'finished',
        winnerTeam: 'players',
        availableLetters: [],
        usedLetters: newUsed,
      });
      return;
    }

    let nextPlayerId = currentPlayerId;
    if (players.length > 0) {
      const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
      const idx = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = (idx + 1) % players.length;
      nextPlayerId = players[nextIndex].id;
    }

    set({
      availableLetters: newAvailable,
      usedLetters: newUsed,
      currentPlayerId: nextPlayerId,
      timer: turnDuration,
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
