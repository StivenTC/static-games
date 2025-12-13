import { create } from 'zustand';

// MVP Word Bank
const WORDS = [
  'Pizza', 'Facebook', 'Playa', 'Hospital', 'Escuela', 
  'Guitarra', 'Vampiro', 'Titanic', 'Pokemon', 'Python',
  'Elon Musk', 'Mess', 'Minecraft', 'Navidad', 'Tiburón'
];

export const useImpostorStore = create((set, get) => ({
  // State
  players: [], // { id, name, role }
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
  addPlayer: (name) => set((state) => ({
    players: [...state.players, { id: Date.now(), name, role: null }]
  })),

  removePlayer: (id) => set((state) => ({
    players: state.players.filter(p => p.id !== id)
  })),

  startGame: () => {
    const { players } = get();
    if (players.length < 3) return;

    // Select Impostor
    const impostorIdx = Math.floor(Math.random() * players.length);
    
    // Select Word
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];

    // Assign Roles
    const newPlayers = players.map((p, index) => ({
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
    let mostVoted = null;
    
    // Simple tie-breaking: first one found (can be improved)
    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVoted = id; // string id
      }
    });
    
    // If tie or no votes (unlikely), handle? Assume valid vote.
    // Ensure ID is number if stored as number, but keys are strings
    const mostVotedId = mostVoted ? Number(mostVoted) : null;

    set({
      votes: finalVotes,
      mostVotedId: mostVotedId,
      phase: 'RESULT'
    });
  },

  resetGame: () => set({
    players: [],
    phase: 'SETUP',
    currentPlayerIndex: 0,
    secretWord: '',
    impostorIndex: -1,
    round: 1,
    votes: {},
    votingPlayerIndex: 0,
    mostVotedId: null
  }),

  restartGame: () => {
    set({
      phase: 'SETUP',
      currentPlayerIndex: 0,
      secretWord: '',
      impostorIndex: -1,
      round: 1,
      votes: {},
      votingPlayerIndex: 0,
      mostVotedId: null
    })
  }
}));
