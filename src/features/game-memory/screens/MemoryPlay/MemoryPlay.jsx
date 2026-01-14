import { useEffect, useRef, useState } from 'react';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import { useMemoryStore } from '../../stores/useMemoryStore';
import styles from './MemoryPlay.module.scss';

const COLORS = ['green', 'red', 'yellow', 'blue'];

const MemoryPlay = () => {
  const {
    gameState,
    sequence,
    currentPlayerId,
    handleInput,
    setGameState,
    nextTurn,
  } = useMemoryStore();

  const { players } = usePlayerStore();
  const { triggerFeedback } = useGameFeedback();

  const [activePad, setActivePad] = useState(null);
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  const sequenceIndex = useRef(0);

  useEffect(() => {
    if (gameState === 'watching') {
      sequenceIndex.current = 0;

      const playNext = () => {
        if (sequenceIndex.current >= sequence.length) {
          setTimeout(() => {
            setGameState('playing');
          }, 500);
          return;
        }

        const color = sequence[sequenceIndex.current];
        setActivePad(color);
        triggerFeedback(`simon-${color}`);

        setTimeout(() => {
          setActivePad(null);
          sequenceIndex.current++;
          setTimeout(playNext, 300);
        }, 500);
      };

      const timeoutId = setTimeout(playNext, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState, sequence, setGameState, triggerFeedback]);

  const handlePadClick = (color) => {
    if (gameState !== 'playing') return;

    setActivePad(color);
    triggerFeedback(`simon-${color}`);
    setTimeout(() => setActivePad(null), 200);

    const result = handleInput(color);

    if (result === false) {
      setTimeout(() => triggerFeedback('error'), 200);
    } else if (result === true) {
      setTimeout(() => {
        triggerFeedback('success');
        setTimeout(() => {
          nextTurn(players);
        }, 800);
      }, 300);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          className={styles.turnIndicator}
          style={{
            '--player-color': currentPlayer?.color || 'white',
          }}>
          {gameState === 'watching'
            ? 'Memoriza...'
            : `Turno ${currentPlayer?.name}`}
        </div>
        <div className={styles.status}>Secuencia: {sequence.length}</div>
      </div>

      <div className={styles.board}>
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.pad} ${styles[color]} ${activePad === color ? styles.active : ''}`}
            onClick={() => handlePadClick(color)}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryPlay;
