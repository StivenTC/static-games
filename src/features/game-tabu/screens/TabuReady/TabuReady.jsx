import { Eye, EyeOff } from 'lucide-react';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import Button from '@/shared/ui/Button/Button';
import { useTabuStore } from '../../stores/useTabuStore';
import styles from './TabuReady.module.scss';

const TabuReady = () => {
  const { players } = usePlayerStore();
  const { currentPlayerId, startTurn } = useTabuStore();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  if (!currentPlayer) return null;

  return (
    <div className={styles.container}>
      <div
        className={styles.avatar}
        style={{
          backgroundColor: currentPlayer.color,
          boxShadow: `0 0 20px ${currentPlayer.color}66`,
        }}>
        {currentPlayer.name.charAt(0).toUpperCase()}
      </div>

      <h2 className={styles.title}>
        Turno de{' '}
        <span
          className={styles.playerName}
          style={{ color: currentPlayer.color }}>
          {currentPlayer.name}
        </span>
      </h2>

      <p className={styles.instruction}>
        Pasa el dispositivo a {currentPlayer.name}. La palabra está oculta hasta
        que presiones comenzar.
      </p>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={startTurn}
          className={styles.startBtn}>
          <Eye size={24} className={styles.startIcon} />
          Empezar
        </Button>
      </div>

      <div className={styles.footer}>
        <EyeOff size={16} className={styles.icon} />
        Palabra oculta
      </div>
    </div>
  );
};

export default TabuReady;
