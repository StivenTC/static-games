import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import { WORD_CATEGORIES } from '../data/words';

const INITIAL_ROUND_STATE = {
  phase: 'SETUP',
  currentPlayerIndex: 0,
  secretWord: '',
  secretCategory: '',
  impostorIndex: -1,
  round: 1,
  votes: {},
  votingPlayerIndex: 0,
  mostVotedId: null,
};

export const useImpostorStore = create(
  persist(
    (set, get) => ({
      players: [],
      phase: 'SETUP',
      currentPlayerIndex: 0,
      secretWord: '',
      secretCategory: '',
      impostorIndex: -1,
      round: 1,
      votes: {},
      votingPlayerIndex: 0,
      mostVotedId: null,

      startGame: () => {
        const globalPlayers = usePlayerStore.getState().players;

        if (globalPlayers.length < 3) return;

        const shuffledPlayers = [...globalPlayers];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPlayers[i], shuffledPlayers[j]] = [
            shuffledPlayers[j],
            shuffledPlayers[i],
          ];
        }

        const impostorIdx = Math.floor(Math.random() * shuffledPlayers.length);

        const categories = Object.values(WORD_CATEGORIES);
        const selectedCategory =
          categories[Math.floor(Math.random() * categories.length)];
        const word =
          selectedCategory.words[
            Math.floor(Math.random() * selectedCategory.words.length)
          ];

        const newPlayers = shuffledPlayers.map((p, index) => ({
          ...p,
          role: index === impostorIdx ? 'IMPOSTOR' : 'CITIZEN',
        }));

        set({
          players: newPlayers,
          impostorIndex: impostorIdx,
          secretWord: word,
          secretCategory: selectedCategory.label,
          currentPlayerIndex: 0,
          phase: 'REVEAL',
        });
      },

      nextPlayer: () => {
        const { currentPlayerIndex, players } = get();
        if (currentPlayerIndex + 1 >= players.length) {
          get().startDebate();
        } else {
          set({ currentPlayerIndex: currentPlayerIndex + 1 });
        }
      },

      startDebate: () => {
        set({
          phase: 'DEBATE',
          currentPlayerIndex: 0,
          round: 1,
        });
      },

      nextTurn: () => {
        const { currentPlayerIndex, players, round } = get();
        if (currentPlayerIndex + 1 >= players.length) {
          set({
            currentPlayerIndex: 0,
            round: round + 1,
          });
        } else {
          set({ currentPlayerIndex: currentPlayerIndex + 1 });
        }
      },

      startVoting: () => {
        set({
          phase: 'VOTING',
          votingPlayerIndex: 0,
          votes: {},
          mostVotedId: null,
        });
      },

      castVote: (candidateId) => {
        const { players, votingPlayerIndex, votes } = get();
        const voter = players[votingPlayerIndex];

        const newVotes = { ...votes, [voter.id]: candidateId };

        if (votingPlayerIndex + 1 >= players.length) {
          get().calculateResults(newVotes);
        } else {
          set({
            votes: newVotes,
            votingPlayerIndex: votingPlayerIndex + 1,
          });
        }
      },

      calculateResults: (finalVotes) => {
        const voteCounts = {};
        Object.values(finalVotes).forEach((candidateId) => {
          voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
        });
        let maxVotes = 0;

        Object.values(voteCounts).forEach((count) => {
          if (count > maxVotes) maxVotes = count;
        });

        const winners = Object.keys(voteCounts).filter(
          (id) => voteCounts[id] === maxVotes
        );
        const mostVotedId = winners.length === 1 ? Number(winners[0]) : null;

        set({
          votes: finalVotes,
          mostVotedId: mostVotedId,
          phase: 'RESULT',
        });
      },

      resetGame: () =>
        set({
          ...INITIAL_ROUND_STATE,
        }),

      restartGame: () => {
        get().startGame();
      },
    }),
    {
      name: 'impostor-storage',
    }
  )
);
