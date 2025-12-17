import classNames from 'classnames';
import { RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { useGameFeedback } from '../../../../shared/hooks/useGameFeedback';
import { usePlayerStore } from '../../../../shared/stores/usePlayerStore';
import { ALPHABET, useBastaStore } from '../../stores/useBastaStore';
import styles from './PlayScreen.module.scss';

export default function PlayScreen({ themeColor }) {
  const {
    currentCategory,
    timer,
    availableLetters,
    currentPlayerId,
    tickTimer,
    selectLetter,
    rerollCategory,
  } = useBastaStore();

  const { triggerFeedback } = useGameFeedback();

  const players = usePlayerStore((s) => s.players);
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  useEffect(() => {
    if (timer > 0 && timer <= 5) {
      triggerFeedback('tick');
    } else if (timer === 0) {
      triggerFeedback('gameover');
    }
  }, [timer, triggerFeedback]);

  const handleReroll = () => {
    triggerFeedback('reroll');
    rerollCategory();
  };

  const handleSelectLetter = (letter) => {
    triggerFeedback('select');
    selectLetter(letter);
  };

  return (
    <section className={styles.container} aria-label="Tablero de juego">
      <div className={styles.categoryCard} style={{ borderColor: themeColor }}>
        <h3>Categoría</h3>
        <div className={styles.categoryRow}>
          <h2>{currentCategory}</h2>
          <button
            type="button"
            onClick={handleReroll}
            className={styles.rerollButton}
            aria-label="Cambiar categoría">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <section className={styles.timerSection} aria-label="Estado del turno">
        <div
          role="timer"
          aria-live={timer <= 5 ? 'assertive' : 'off'}
          className={classNames(styles.timerValue, {
            [styles.pulsing]: timer <= 5,
          })}
          style={{ color: timer <= 5 ? '#ff3333' : 'white' }}>
          {timer}
        </div>
        {currentPlayer && (
          <div
            className={styles.currentPlayer}
            style={{
              backgroundColor: currentPlayer.color || themeColor,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}>
            Turno de: {currentPlayer.name}
          </div>
        )}
      </section>

      <section className={styles.letterGrid} aria-label="Teclado de letras">
        {ALPHABET.map((letter) => {
          const isAvailable = availableLetters.includes(letter);
          return (
            <button
              key={letter}
              type="button"
              className={classNames(styles.letterBtn, {
                [styles.used]: !isAvailable,
              })}
              onClick={() => handleSelectLetter(letter)}
              aria-pressed={!isAvailable}
              aria-label={
                isAvailable
                  ? `Seleccionar letra ${letter}`
                  : `Deshacer letra ${letter}`
              }
              style={isAvailable ? { color: themeColor } : {}}>
              {letter}
            </button>
          );
        })}
      </section>
    </section>
  );
}
