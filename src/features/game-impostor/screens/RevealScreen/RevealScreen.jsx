import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useEffect, useState } from 'react';

import Button from '../../../../shared/ui/Button';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './RevealScreen.module.scss';

export default function RevealScreen({ themeColor }) {
  const { players, currentPlayerIndex, secretWord, nextPlayer } =
    useImpostorStore();
  const [isRevealing, setIsRevealing] = useState(false);
  const [readyToPass, setReadyToPass] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  // Logic to determine what to show
  const isImpostor = currentPlayer.role === 'IMPOSTOR';

  const handlePointerDown = () => {
    // Prevent default to avoid scrolling/context menu issues
    //e.preventDefault();
    setIsRevealing(true);
    setReadyToPass(true);
  };

  useEffect(() => {
    if (isRevealing) {
      const handleEnd = () => setIsRevealing(false);

      // Listen globally to catch release anywhere
      window.addEventListener('pointerup', handleEnd);
      window.addEventListener('pointercancel', handleEnd);
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('pointerup', handleEnd);
        window.removeEventListener('pointercancel', handleEnd);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isRevealing]);

  // Removed handlePointerUp as it is handled by effect

  return (
    <div className={styles.container}>
      <div className={styles.instruction}>
        Turno de:
        <strong style={{ color: currentPlayer.color || '#fff' }}>
          {currentPlayer.name}
        </strong>
      </div>

      <div className={styles.revealArea}>
        <AnimatePresence>
          {isRevealing ? (
            <motion.div
              className={styles.roleCard}
              key="role-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: 'auto' }} // Re-enable pointer events for specific content if needed, strictly to block pass-through
            >
              {isImpostor ? (
                <>
                  <h3 className={styles.impostor}>IMPOSTOR</h3>
                  <p>Engaña a los demás</p>
                </>
              ) : (
                <>
                  <h3 className={styles.citizen}>{secretWord}</h3>
                  <p>Palabra Secreta</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.button
              type="button"
              className={styles.holdButton}
              onPointerDown={handlePointerDown}
              onContextMenu={(e) => e.preventDefault()} // Prevent right click
              style={{
                touchAction: 'none',
                borderColor: currentPlayer.color || undefined,
                boxShadow: currentPlayer.color
                  ? `0 0 20px ${currentPlayer.color}`
                  : undefined,
              }}
              whileTap={{ scale: 0.95 }}
              key="reveal-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}>
              MANTÉN <br /> PRESIONADO
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {readyToPass && !isRevealing && (
        <Button
          variant="primary"
          onClick={nextPlayer}
          style={{ backgroundColor: themeColor, borderColor: themeColor }}>
          Listo / Siguiente
        </Button>
      )}

      {!readyToPass && (
        <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>
          Presiona para ver tu rol
        </p>
      )}
    </div>
  );
}
