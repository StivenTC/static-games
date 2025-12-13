import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// MVP Word Bank
const WORDS = [
  'Pizza', 'Facebook', 'Playa', 'Hospital', 'Escuela', 
  'Guitarra', 'Vampiro', 'Titanic', 'Pokemon', 'Python',
  'Elon Musk', 'Mess', 'Minecraft', 'Navidad', 'Tiburón'
];

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

const INITIAL_ROUND_STATE = {
  phase: 'SETUP',
  currentPlayerIndex: 0,
  secretWord: '',
  impostorIndex: -1,
  round: 1,
  votes: {},
  votingPlayerIndex: 0,
  mostVotedId: null
};

export const useImpostorStore = create(
  persist(
    (set, get) => ({
      // State
      players: [], // { id, name, role, color }
      phase: 'SETUP', // SETUP, REVEAL, DEBATE, VOTING, RESULT
      currentPlayerIndex: 0,
      secretWord: '',
      impostorIndex: -1,
      
      // New State for Complex Flow
      round: 1,
      votes: {}, // { [voterId]: candidateId }
      votingPlayerIndex: 0,
      mostVotedId: null,

      // Actions
      addPlayer: (name) => set((state) => {
        // Assign a color based on the number of players (cycle through available colors)
        const colorIndex = state.players.length % PLAYER_COLORS.length;
        const color = PLAYER_COLORS[colorIndex];
        
        return {
          players: [...state.players, { id: Date.now(), name, role: null, color }]
        };
      }),

      removePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id)
      })),

      startGame: () => {
        const { players } = get();
        if (players.length < 3) return;

        // Shuffle Players (Fisher-Yates)
        const shuffledPlayers = [...players];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
        }

        // Select Impostor
        const impostorIdx = Math.floor(Math.random() * shuffledPlayers.length);
        
        // Select Word
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];

        // Assign Roles
        const newPlayers = shuffledPlayers.map((p, index) => ({
          ...p,
          role: index === impostorIdx ? 'IMPOSTOR' : 'CITIZEN'
        }));

        set({
          players: newPlayers,
          impostorIndex: impostorIdx,
          secretWord: word,
          currentPlayerIndex: 0,
          phase: 'REVEAL'
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
          round: 1 
        });
      },

      nextTurn: () => {
        const { currentPlayerIndex, players, round } = get();
        if (currentPlayerIndex + 1 >= players.length) {
          // End of round, start next one
          set({ 
            currentPlayerIndex: 0, 
            round: round + 1 
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
          mostVotedId: null
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
            votingPlayerIndex: votingPlayerIndex + 1 
          });
        }
      },

      calculateResults: (finalVotes) => {
        // Count votes
        const voteCounts = {};
        Object.values(finalVotes).forEach(candidateId => {
          voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
        });

        // Find max
        let maxVotes = 0;
        
        Object.values(voteCounts).forEach(count => {
          if (count > maxVotes) maxVotes = count;
        });
        
        // Find all candidates with maxVotes
        const winners = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
        
        // Tie handling: if multiple winners, no single winner
        // Ensure ID is number if there is a single winner
        const mostVotedId = winners.length === 1 ? Number(winners[0]) : null;

        set({
          votes: finalVotes,
          mostVotedId: mostVotedId,
          phase: 'RESULT'
        });
      },



// ... inside Actions
      resetGame: () => set({
        // Keep players
        ...INITIAL_ROUND_STATE
      }),

      restartGame: () => {
        set({
          ...INITIAL_ROUND_STATE
        })
      }
    }),
    {
      name: 'impostor-storage',
    }
  )
);
