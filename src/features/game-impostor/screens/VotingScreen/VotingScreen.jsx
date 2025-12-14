import { ScanFace, UserCheck } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../../shared/ui/Button';
import Timer from '../../../../shared/ui/Timer';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './VotingScreen.module.scss';

export default function VotingScreen({ themeColor }) {
  const { players, votingPlayerIndex, castVote } = useImpostorStore();
  const [isReady, setIsReady] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const voter = players[votingPlayerIndex];

  // Filter out self from candidates
  const candidates = players.filter((p) => p.id !== voter.id);

  const resetLocalState = () => {
    setIsReady(false);
    setSelectedId(null);
    setShowWarning(false);
  };

  const handleVote = () => {
    if (selectedId) {
      castVote(selectedId);
      resetLocalState();
    }
  };

  const handleTimeout = () => {
    // Timeout: Vote for self
    castVote(voter.id);
    resetLocalState();
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
          <strong style={{ color: voter.color || '#fff' }}>{voter.name}</strong>
        </div>

        <div className={styles.readyArea}>
          <Button
            variant="primary"
            onClick={() => setIsReady(true)}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              fontSize: '1.5rem',
              borderColor: voter.color || undefined,
              boxShadow: voter.color ? `0 0 20px ${voter.color}` : undefined,
              color: voter.color || undefined,
            }}>
            SOY <br /> {voter.name}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <h2 className={styles.instruction}>¿Quién es el Impostor?</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: voter.color,
          }}>
          {voter.name}
        </div>
        <Timer
          initialSeconds={30}
          isRunning={true}
          onTick={handleTick}
          onComplete={handleTimeout}
          color={voter.color}
        />
        {showWarning && (
          <div role="alert" className={styles.alert}>
            ¡Si no votas, el voto será para ti!
          </div>
        )}
      </div>

      <div className={styles.votingArea}>
        <ul
          className={styles.candidateList}
          style={{ listStyle: 'none', padding: 0 }}>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                className={`${styles.candidateCard} ${selectedId === candidate.id ? styles.selected : ''}`}
                onClick={() => setSelectedId(candidate.id)}
                style={{
                  borderLeft: `4px solid ${candidate.color || '#fff'}`,
                }}>
                <ScanFace size={32} style={{ opacity: 0.8 }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {candidate.name}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Button
          variant="primary"
          disabled={!selectedId}
          onClick={handleVote}
          style={{
            backgroundColor: selectedId ? themeColor : undefined,
            borderColor: themeColor,
          }}>
          <UserCheck size={20} />
          Confirmar Voto
        </Button>
      </div>
    </main>
  );
}
