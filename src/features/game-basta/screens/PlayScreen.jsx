import classNames from 'classnames';
import { useEffect } from 'react';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore';
import { ALPHABET, useBastaStore } from '../stores/useBastaStore';
import styles from './PlayScreen.module.scss';

export default function PlayScreen({ themeColor }) {
  const {
    currentCategory,
    timer,
    availableLetters,
    currentPlayerId,
    tickTimer,
    selectLetter,
  } = useBastaStore();

  const players = usePlayerStore((s) => s.players);
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  return (
    <div className={styles.container}>
      <div className={styles.categoryCard} style={{ borderColor: themeColor }}>
        <h3>Categoría</h3>
        <h2>{currentCategory}</h2>
      </div>

      <div className={styles.timerSection}>
        <div
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
      </div>

      <div className={styles.letterGrid}>
        {ALPHABET.map((letter) => {
          const isAvailable = availableLetters.includes(letter);
          return (
            <button
              key={letter}
              type="button"
              className={classNames(styles.letterBtn, {
                [styles.used]: !isAvailable,
              })}
              onClick={() => selectLetter(letter)}
              style={isAvailable ? { color: themeColor } : {}}>
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
