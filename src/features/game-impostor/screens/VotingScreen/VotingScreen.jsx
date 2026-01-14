import { ScanFace, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import Button from '@/shared/ui/Button/Button';
import Timer from '@/shared/ui/Timer/Timer';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './VotingScreen.module.scss';

export default function VotingScreen({ themeColor }) {
  const { players, votingPlayerIndex, castVote } = useImpostorStore();
  const [isReady, setIsReady] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const { triggerFeedback } = useGameFeedback();

  const voter = players[votingPlayerIndex];

  const candidates = players.filter((p) => p.id !== voter.id);

  const resetLocalState = () => {
    setIsReady(false);
    setSelectedId(null);
    setShowWarning(false);
  };

  const handleVote = () => {
    if (selectedId) {
      triggerFeedback('success');
      castVote(selectedId);
      resetLocalState();
    }
  };

  const handleTimeout = () => {
    triggerFeedback('timeout');
    castVote(voter.id);
    resetLocalState();
  };

  const handleTick = (secondsLeft) => {
    if (secondsLeft <= 5) triggerFeedback('tick');
    if (secondsLeft <= 5 && !showWarning) {
      setShowWarning(true);
    }
  };

  if (!isReady) {
    return (
      <div className={styles.container}>
        <div className={styles.instruction}>
          Pasa el dispositivo a:
          <strong style={{ '--player-color': voter.color || '#fff' }}>
            {voter.name}
          </strong>
        </div>

        <div className={styles.readyArea}>
          <Button
            variant="primary"
            onClick={() => {
              triggerFeedback('select');
              setIsReady(true);
            }}
            className={styles.readyBtn}
            style={{ '--player-color': voter.color || '#fff' }}>
            SOY <br /> {voter.name}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <h2 className={styles.instruction}>¿Quién es el Impostor?</h2>

      <div className={styles.voterInfo}>
        <div
          className={styles.voterName}
          style={{ '--player-color': voter.color }}>
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
        <ul className={styles.candidateList}>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                className={`${styles.candidateCard} ${selectedId === candidate.id ? styles.selected : ''}`}
                onClick={() => {
                  triggerFeedback('select');
                  setSelectedId(candidate.id);
                }}
                style={{
                  '--border-color': candidate.color || '#fff',
                }}>
                <ScanFace size={32} className={styles.candidateIcon} />
                <div className={styles.candidateName}>{candidate.name}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        <Button
          variant="primary"
          disabled={!selectedId}
          onClick={handleVote}
          className={styles.confirmBtn}
          style={{
            '--theme-color': themeColor,
          }}>
          <UserCheck size={20} />
          Confirmar Voto
        </Button>
      </div>
    </main>
  );
}
