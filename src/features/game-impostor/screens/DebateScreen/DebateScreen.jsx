import { Play, Vote } from 'lucide-react';
import Button from '@/shared/ui/Button/Button';
import Timer from '@/shared/ui/Timer/Timer';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './DebateScreen.module.scss';

export default function DebateScreen({ themeColor }) {
  const { players, currentPlayerIndex, round, nextTurn, startVoting } =
    useImpostorStore();
  const { triggerFeedback } = useGameFeedback();

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className={styles.container} style={{ '--theme-color': themeColor }}>
      <div className={styles.header}>
        <h3>Turno de</h3>
        <div
          className={styles.currentPlayer}
          style={{ '--player-color': currentPlayer.color || '#fff' }}>
          {currentPlayer.name}
        </div>
      </div>

      <div className={styles.centerContent}>
        <Timer
          initialSeconds={30}
          key={`${round}-${currentPlayerIndex}`} // Reset timer on new turn
          onComplete={() => {
            triggerFeedback('timeout');
            nextTurn();
          }}
          onTick={(seconds) => {
            if (seconds <= 5) triggerFeedback('tick');
          }}
          color={currentPlayer.color || themeColor}
        />

        <div className={styles.roundIndicator}>Ronda {round}</div>
      </div>

      <div className={styles.controls}>
        <Button
          variant="primary"
          onClick={() => {
            triggerFeedback('select');
            nextTurn();
          }}
          className={styles.nextTurnBtn}>
          <Play size={20} />
          Siguiente Turno
        </Button>

        <div className={styles.divider}></div>

        <Button
          variant="outline"
          onClick={() => {
            triggerFeedback('click');
            startVoting();
          }}
          className={styles.voteBtn}>
          <Vote size={20} className={styles.voteIcon} />
          Ir a Votar
        </Button>
      </div>
    </div>
  );
}
