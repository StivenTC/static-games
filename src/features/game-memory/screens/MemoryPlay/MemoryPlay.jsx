import { useEffect, useState, useRef } from 'react';
import styles from './MemoryPlay.module.scss';
import { useMemoryStore } from '../../stores/useMemoryStore';
import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';

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

  // Play Sequence Effect
  useEffect(() => {
    if (gameState === 'watching') {
      sequenceIndex.current = 0;

      const playNext = () => {
        if (sequenceIndex.current >= sequence.length) {
          // Sequence finished, switching to player turn
          setTimeout(() => {
            setGameState('playing');
          }, 500);
          return;
        }

        const color = sequence[sequenceIndex.current];
        setActivePad(color);

        // Trigger sound based on color
        triggerFeedback(`simon-${color}`);

        setTimeout(() => {
          setActivePad(null);
          sequenceIndex.current++;
          setTimeout(playNext, 300); // Gap between notes
        }, 500); // Duration of note
      };

      // Start playing after a short delay
      const timeoutId = setTimeout(playNext, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState, sequence, setGameState, triggerFeedback]);

  const handlePadClick = (color) => {
    if (gameState !== 'playing') return;

    // Visual feedback
    setActivePad(color);
    triggerFeedback(`simon-${color}`);
    setTimeout(() => setActivePad(null), 200);

    // Logic
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
