import { useImpostorStore } from '../stores/useImpostorStore';
import styles from './DebateScreen.module.scss';
import Button from '../../../shared/ui/Button';
import Timer from '../../../shared/ui/Timer';
import { Play, Vote } from 'lucide-react';

export default function DebateScreen({ themeColor }) {
  const { players, currentPlayerIndex, round, nextTurn, startVoting } =
    useImpostorStore();

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Turno de</h3>
        <div
          className={styles.currentPlayer}
          style={{ color: currentPlayer.color || '#fff' }}>
          {currentPlayer.name}
        </div>
      </div>

      <div className={styles.centerContent}>
        <Timer
          initialSeconds={30}
          key={`${round}-${currentPlayerIndex}`} // Reset timer on new turn
          onComplete={nextTurn}
          color={currentPlayer.color || themeColor}
        />

        <div className={styles.roundIndicator}>Ronda {round}</div>
      </div>

      <div className={styles.controls}>
        <Button
          variant="primary"
          onClick={nextTurn}
          style={{ backgroundColor: themeColor, borderColor: themeColor }}>
          <Play size={20} />
          Siguiente Turno
        </Button>

        <div className={styles.divider}></div>

        <Button
          variant="outline"
          onClick={startVoting}
          className={styles.voteBtn}
          style={{ color: themeColor, borderColor: themeColor }}>
          <Vote size={20} style={{ marginRight: '8px' }} />
          Ir a Votar
        </Button>
      </div>
    </div>
  );
}
