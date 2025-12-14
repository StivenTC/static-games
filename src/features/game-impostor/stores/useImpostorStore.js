import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore'; // Adjust path if needed
import { WORD_CATEGORIES } from '../data/words';

const INITIAL_ROUND_STATE = {
  phase: 'SETUP',
  currentPlayerIndex: 0,
  secretWord: '',
  secretCategory: '', // New state
  impostorIndex: -1,
  round: 1,
  votes: {},
  votingPlayerIndex: 0,
  mostVotedId: null,
};

export const useImpostorStore = create(
  persist(
    (set, get) => ({
      // State
      players: [], // { id, name, role, color } - Local copy for the game session
      phase: 'SETUP', // SETUP, REVEAL, DEBATE, VOTING, RESULT
      currentPlayerIndex: 0,
      secretWord: '',
      secretCategory: '',
      impostorIndex: -1,

      // New State for Complex Flow
      round: 1,
      votes: {}, // { [voterId]: candidateId }
      votingPlayerIndex: 0,
      mostVotedId: null,

      // Actions
      // removed addPlayer, removePlayer - handled by usePlayerStore

      startGame: () => {
        const globalPlayers = usePlayerStore.getState().players;

        if (globalPlayers.length < 3) return; // Min 3 players for Impostor

        // Shuffle Players (Fisher-Yates)
        const shuffledPlayers = [...globalPlayers];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPlayers[i], shuffledPlayers[j]] = [
            shuffledPlayers[j],
            shuffledPlayers[i],
          ];
        }

        // Select Impostor
        const impostorIdx = Math.floor(Math.random() * shuffledPlayers.length);

        // Select Category and Word
        const categories = Object.values(WORD_CATEGORIES);
        const selectedCategory =
          categories[Math.floor(Math.random() * categories.length)];
        const word =
          selectedCategory.words[
            Math.floor(Math.random() * selectedCategory.words.length)
          ];

        // Assign Roles
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
          // End of Reveal Phase -> Start Debate
          get().startDebate();
        } else {
          set({ currentPlayerIndex: currentPlayerIndex + 1 });
        }
      },

      startDebate: () => {
        // Random starting player for debate? or just 0
        // Let's start with 0 for now
        set({
          phase: 'DEBATE',
          currentPlayerIndex: 0,
          round: 1,
        });
      },

      nextTurn: () => {
        const { currentPlayerIndex, players, round } = get();
        if (currentPlayerIndex + 1 >= players.length) {
          // End of round, start next one
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
          // All voted -> Calculate Results
          get().calculateResults(newVotes);
        } else {
          set({
            votes: newVotes,
            votingPlayerIndex: votingPlayerIndex + 1,
          });
        }
      },

      calculateResults: (finalVotes) => {
        // Count votes
        const voteCounts = {};
        Object.values(finalVotes).forEach((candidateId) => {
          voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
        });

        // Find max
        let maxVotes = 0;

        Object.values(voteCounts).forEach((count) => {
          if (count > maxVotes) maxVotes = count;
        });

        // Find all candidates with maxVotes
        const winners = Object.keys(voteCounts).filter(
          (id) => voteCounts[id] === maxVotes
        );

        // Tie handling: if multiple winners, no single winner
        // Ensure ID is number if there is a single winner
        const mostVotedId = winners.length === 1 ? Number(winners[0]) : null;

        set({
          votes: finalVotes,
          mostVotedId: mostVotedId,
          phase: 'RESULT',
        });
      },

      resetGame: () =>
        set({
          // Keep players? No, if we reset we might want to go back to Setup which uses global store.
          // But if we are IN game, we use local players.
          // If we reset to SETUP phase, local players state is irrelevant as Setup uses Global.
          ...INITIAL_ROUND_STATE,
        }),

      restartGame: () => {
        // Restart with SAME players logic just calls startGame which refetches global.
        // But wait, players in state have roles. We need to clear roles first or just overwrite them.
        // Ideally we grab names/colors/ids and re-run startGame logic but strictly with THESE players, not fetching from global again?
        // Or just re-fetch from global? The user might have changed global players? No, global players change in Setup.
        // If we are in Game, we are not in Setup.
        // If we want "Play Again" with same players, we should reuse `startGame` logic but passing current players?

        // Simpler: Just call startGame() again and it fetches from global store.
        // If users haven't changed global store, it's the same list.
        get().startGame();
      },
    }),
    {
      name: 'impostor-storage',
    }
  )
);
