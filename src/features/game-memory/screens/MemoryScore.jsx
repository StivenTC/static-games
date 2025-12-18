import { RotateCcw } from 'lucide-react';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore';
import Button from '../../../shared/ui/Button/Button';
import { useMemoryStore } from '../stores/useMemoryStore';
import { useGameFeedback } from '../../../shared/hooks/useGameFeedback';
import styles from './MemoryPlay.module.scss'; // Reuse styles for overlay

const MemoryScore = () => {
  const { players } = usePlayerStore();
  const { currentPlayerId, round, resetGame } = useMemoryStore();
  const { triggerFeedback } = useGameFeedback();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  return (
    <div className={styles.container}>
      {/* Reuse overlay style for full screen effect concept but inline for simplicity or reuse module */}
      <div className={styles.overlay}>
        <h2
          style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff0055' }}>
          ¡Juego Terminado!
        </h2>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            <span style={{ color: currentPlayer?.color }}>
              {currentPlayer?.name}
            </span>{' '}
            falló.
          </div>
          <div
            style={{ fontSize: '3rem', fontWeight: 'bold', color: '#00ff9f' }}>
            Ronda {round}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant="outline"
            onClick={() => {
              triggerFeedback('select');
              resetGame();
            }}>
            <RotateCcw size={20} style={{ marginRight: 8 }} />
            Salir
          </Button>

          {/* Restart same team? Or just exit? Usually just exit to setup is safer */}
        </div>
      </div>
    </div>
  );
};

export default MemoryScore;
