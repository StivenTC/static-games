import { ArrowRight, RotateCcw, Timer, X } from 'lucide-react';
import { useEffect } from 'react';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import Button from '@/shared/ui/Button/Button';
import { useTabuStore } from '../../stores/useTabuStore';
import styles from './TabuPlay.module.scss';

const TabuPlay = () => {
  const { players } = usePlayerStore();
  const {
    currentCard,
    currentPlayerId,
    timeLeft,
    gameState,
    correctGuess,
    skipCard,
    decrementTime,
    nextTurn,
    resetGame,
  } = useTabuStore();
  const { triggerFeedback } = useGameFeedback();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const guessers = players.filter((p) => p.id !== currentPlayerId);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        decrementTime();
        if (timeLeft <= 11 && timeLeft > 1) {
          triggerFeedback('tick');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft, decrementTime, triggerFeedback]);

  useEffect(() => {
    if (gameState === 'roundOver') {
      triggerFeedback('gameover');
    }
  }, [gameState, triggerFeedback]);

  if (!currentCard) return <div className={styles.container}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div
          className={`${styles.timer} ${timeLeft <= 10 ? styles.urgent : ''}`}>
          <Timer size={24} style={{ marginRight: 8 }} />
          <span>{timeLeft}s</span>
        </div>

        <div
          className={styles.describerName}
          style={{ color: currentPlayer?.color }}>
          {currentPlayer?.name}
        </div>
      </header>

      <main className={styles.card}>
        <div className={styles.targetWord}>{currentCard.word}</div>
        <div className={styles.tabuList}>
          {currentCard.tabu.map((word) => (
            <div key={word} className={styles.tabuWord}>
              {word}
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.controls}>
        <div className={styles.chipContainer}>
          {guessers.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.chip}
              onClick={() => {
                triggerFeedback('success');
                correctGuess(p.id);
              }}
              style={{ backgroundColor: p.color }}
              aria-label={`Punto para ${p.name}`}>
              {p.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.btn} ${styles.skipBtn}`}
          onClick={() => {
            triggerFeedback('reroll');
            skipCard();
          }}>
          <X size={24} />
          Pasar
        </button>
      </footer>

      {gameState === 'roundOver' && (
        <div className={styles.overlay}>
          <div className={styles.scoreTitle}>¡Tiempo Agotado!</div>

          <div className={styles.overlayActions}>
            <Button variant="primary" onClick={() => nextTurn(players)}>
              Siguiente Ronda
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw size={20} style={{ marginRight: 8 }} />
              Salir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabuPlay;
