import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const PLAYER_COLORS = [
  '#00ffea', // Neon Blue
  '#ff0055', // Neon Red
  '#00ff00', // Neon Green
  '#ff00ff', // Neon Purple
  '#ffff00', // Neon Yellow
  '#ff9900', // Neon Orange
  '#00ccff', // Cyan
  '#ff3399', // Pink
  '#e056fd', // Lavender
  '#55efc4', // Mint
  '#f1c40f', // Gold
  '#4834d4', // Indigo
  '#be2edd', // Orchid
  '#22a6b3', // Teal
  '#eb4d4b', // Salmon
];

export const usePlayerStore = create(
  persist(
    (set) => ({
      players: [],

      addPlayer: (name) =>
        set((state) => {
          const colorIndex = state.players.length % PLAYER_COLORS.length;
          const color = PLAYER_COLORS[colorIndex];

          return {
            players: [...state.players, { id: Date.now(), name, color }],
          };
        }),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),

      resetPlayers: () => set({ players: [] }),

      updatePlayer: (id, data) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
    }),
    {
      name: 'player-storage',
    }
  )
);
