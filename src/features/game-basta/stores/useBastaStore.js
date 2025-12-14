import { create } from 'zustand';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const CATEGORIES = [
  'Nombres',
  'Paises',
  'Frutas',
  'Colores',
  'Animales',
  'Marcas',
  'Cosas de cocina',
  'Superhéroes',
  'Deportes',
  'Películas',
  'Canciones',
  'Ciudades',
  'Comidas',
  'Profesiones',
  'Instrumentos musicales',
];

export const useBastaStore = create((set, get) => ({
  // Game Configuration
  turnDuration: 15,
  categories: CATEGORIES,

  // Game State
  gameStatus: 'setup', // setup, playing, finished
  currentCategory: '',
  availableLetters: [...ALPHABET],
  usedLetters: [],
  currentPlayerId: null,
  timer: 15,
  winnerTeam: null, // 'players' (if all letters used) or 'time' (if timer runs out)

  // Actions
  setTurnDuration: (seconds) => set({ turnDuration: seconds }),

  startGame: (firstPlayerId) => {
    const players = usePlayerStore.getState().players;
    // If no specific first player, default to the first one in the list
    const startId = firstPlayerId || players[0]?.id;

    if (!startId && players.length > 0) {
      // fallback
    }

    const randomCategory =
      CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    set((state) => ({
      gameStatus: 'playing',
      currentCategory: randomCategory,
      availableLetters: [...ALPHABET],
      usedLetters: [],
      currentPlayerId: startId,
      timer: state.turnDuration,
      winnerTeam: null,
    }));
  },

  selectLetter: (letter) => {
    const { availableLetters, usedLetters, turnDuration, currentPlayerId } =
      get();
    const players = usePlayerStore.getState().players;

    if (!availableLetters.includes(letter)) return; // Already used

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
