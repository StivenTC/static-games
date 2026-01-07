import { RotateCcw } from 'lucide-react';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import Button from '@/shared/ui/Button/Button';
import { useMemoryStore } from '../../stores/useMemoryStore';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import styles from './MemoryScore.module.scss';

const MemoryScore = () => {
  const { players } = usePlayerStore();
  const { currentPlayerId, round, resetGame } = useMemoryStore();
  const { triggerFeedback } = useGameFeedback();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <h2 className={styles.title}>¡Juego Terminado!</h2>

        <div className={styles.resultContent}>
          <div className={styles.failMessage}>
            <span
              className={styles.playerName}
              style={{ '--player-color': currentPlayer?.color }}>
              {currentPlayer?.name}
            </span>{' '}
            falló.
          </div>
          <div className={styles.roundScore}>Ronda {round}</div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={() => {
              triggerFeedback('select');
              resetGame();
            }}>
            <RotateCcw size={20} className={styles.exitIcon} />
            Salir
          </Button>

          {/* Restart same team? Or just exit? Usually just exit to setup is safer */}
        </div>
      </div>
    </div>
  );
};

export default MemoryScore;
