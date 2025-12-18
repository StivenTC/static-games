import { ArrowRight, Check, RotateCcw, Timer, X } from 'lucide-react';
import { useEffect } from 'react';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore';
import Button from '../../../shared/ui/Button/Button';
import { useTabuStore } from '../stores/useTabuStore';
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

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const guessers = players.filter((p) => p.id !== currentPlayerId);

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

        {/* Describer Indicator */}
        <div
          style={{
            color: currentPlayer?.color || 'white',
            fontWeight: 'bold',
          }}>
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
        <button
          type="button"
          className={`${styles.btn} ${styles.skipBtn}`}
          onClick={skipCard}
          style={{ flex: 1, maxWidth: '30%' }}>
          <X size={24} />
          Pasar
        </button>

        <div
          style={{
            flex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.5rem',
          }}>
          {guessers.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.btn}`}
              onClick={() => correctGuess(p.id)}
              style={{
                backgroundColor: p.color,
                color: 'black',
                fontSize: '0.9rem',
                padding: '0.5rem',
                height: '100%',
                textShadow: 'none',
              }}>
              <Check size={16} />
              {p.name}
            </button>
          ))}
        </div>
      </footer>

      {gameState === 'roundOver' && (
        <div className={styles.overlay}>
          <div className={styles.scoreTitle}>¡Tiempo Agotado!</div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw size={20} style={{ marginRight: 8 }} />
              Salir
            </Button>
            <Button variant="primary" onClick={() => nextTurn(players)}>
              Siguiente Ronda
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabuPlay;
