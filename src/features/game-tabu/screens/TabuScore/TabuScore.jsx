import { X } from 'lucide-react';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import Button from '@/shared/ui/Button/Button';
import { useTabuStore } from '../../stores/useTabuStore';
import styles from './TabuScore.module.scss';

const TabuScore = () => {
  const { players } = usePlayerStore();
  const { scores, nextTurn, resetGame } = useTabuStore();
  const { triggerFeedback } = useGameFeedback();

  const sortedPlayers = [...players].sort((a, b) => {
    return (scores[b.id] || 0) - (scores[a.id] || 0);
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Resultados</h2>
      </header>

      <main className={styles.list}>
        {sortedPlayers.map((p, index) => (
          <div key={p.id} className={styles.playerRow}>
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.info}>
              <div
                className={styles.name}
                style={{ '--player-color': p.color }}>
                {p.name}
              </div>
              <div className={styles.points}>{scores[p.id] || 0} pts</div>
            </div>
          </div>
        ))}
      </main>

      <footer className={styles.footer}>
        <Button
          variant="outline"
          onClick={() => {
            triggerFeedback('select');
            resetGame();
          }}>
          <X size={20} className={styles.icon} />
          Salir
        </Button>
        <Button
          variant="primary"
          className={styles.nextRoundBtn}
          onClick={() => {
            triggerFeedback('select');
            nextTurn(players);
          }}>
          Siguiente Ronda
        </Button>
      </footer>
    </div>
  );
};

export default TabuScore;
