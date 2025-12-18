import { ArrowRight, Check, RotateCcw, Timer, X } from 'lucide-react';
import { useEffect } from 'react';
import Button from '../../../shared/ui/Button/Button';
import { useTabuStore } from '../stores/useTabuStore';
import styles from './TabuPlay.module.css';

const TabuPlay = () => {
  const {
    currentCard,
    score,
    timeLeft,
    gameState,
    correctGuess,
    skipCard,
    decrementTime,
    nextTurn,
    resetGame,
  } = useTabuStore();

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        decrementTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft, decrementTime]);

  if (!currentCard) return <div className={styles.container}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div
          className={styles.timer}
          style={{ color: timeLeft <= 10 ? '#e63946' : 'inherit' }}>
          <Timer size={24} style={{ display: 'inline', marginRight: 8 }} />
          {timeLeft}s
        </div>
        <div>Pts: {score}</div>
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
        <button
          type="button"
          className={`${styles.btn} ${styles.skipBtn}`}
          onClick={skipCard}>
          <X size={24} />
          Pasar
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.correctBtn}`}
          onClick={correctGuess}>
          <Check size={24} />
          Correcto
        </button>
      </footer>

      {gameState === 'roundOver' && (
        <div className={styles.overlay}>
          <div className={styles.scoreTitle}>¡Tiempo Agotado!</div>
          <div className={styles.finalScore}>{score} Pts</div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw size={20} style={{ marginRight: 8 }} />
              Salir
            </Button>
            <Button variant="primary" onClick={nextTurn}>
              Siguiente Turno
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabuPlay;
