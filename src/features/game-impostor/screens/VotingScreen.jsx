import { useState } from 'react';
import { useImpostorStore } from '../stores/useImpostorStore';
import styles from './VotingScreen.module.scss';
import Button from '../../../shared/ui/Button';
import Timer from '../../../shared/ui/Timer';
import { UserCheck, ScanFace } from 'lucide-react';

export default function VotingScreen() {
  const { players, votingPlayerIndex, castVote } = useImpostorStore();
  const [isReady, setIsReady] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const voter = players[votingPlayerIndex];
  
  // Filter out self from candidates
  const candidates = players.filter(p => p.id !== voter.id);

  const handleVote = () => {
    if (selectedId) {
      castVote(selectedId);
      setIsReady(false);
      setSelectedId(null);
      setShowWarning(false);
    }
  };

  const handleTimeout = () => {
      // Timeout: Vote for self
      castVote(voter.id);
      setIsReady(false);
      setSelectedId(null);
      setShowWarning(false);
  };

  const handleTick = (secondsLeft) => {
      if (secondsLeft <= 5 && !showWarning) {
          setShowWarning(true);
      }
  };

  if (!isReady) {
    return (
      <div className={styles.container}>
        <div className={styles.instruction}>
          Pasa el dispositivo a:
          <strong>{voter.name}</strong>
        </div>
        
        <div className={styles.readyArea}>
            <Button 
                variant="primary" 
                onClick={() => setIsReady(true)}
                style={{ width: '200px', height: '200px', borderRadius: '50%', fontSize: '1.5rem' }}
            >
                SOY <br/> {voter.name}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.instruction}>
        ¿Quién es el Impostor?
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Timer 
            initialSeconds={30} 
            isRunning={true} 
            onTick={handleTick}
            onComplete={handleTimeout}
        />
        {showWarning && (
            <div style={{ color: '#ff0055', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
                ¡Si no votas, el voto será para ti!
            </div>
        )}
      </div>

      <div className={styles.votingArea}>
        <div className={styles.candidateList}>
          {candidates.map(candidate => (
            <button 
              key={candidate.id}
              type="button"
              className={`${styles.candidateCard} ${selectedId === candidate.id ? styles.selected : ''}`}
              onClick={() => setSelectedId(candidate.id)}
            >
              <ScanFace size={32} style={{ opacity: 0.8 }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{candidate.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Button 
            variant="danger" 
            disabled={!selectedId}
            onClick={handleVote}
        >
            <UserCheck size={20} />
            Confirmar Voto
        </Button>
      </div>
    </div>
  );
}
