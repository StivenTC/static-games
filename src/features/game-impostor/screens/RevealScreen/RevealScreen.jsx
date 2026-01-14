import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import Button from '@/shared/ui/Button/Button';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './RevealScreen.module.scss';

export default function RevealScreen({ themeColor }) {
  const { players, currentPlayerIndex, secretWord, nextPlayer } =
    useImpostorStore();
  const [isRevealing, setIsRevealing] = useState(false);
  const [readyToPass, setReadyToPass] = useState(false);
  const { triggerFeedback } = useGameFeedback();

  const currentPlayer = players[currentPlayerIndex];

  const isImpostor = currentPlayer.role === 'IMPOSTOR';

  const handlePointerDown = () => {
    triggerFeedback('success');
    setIsRevealing(true);
    setReadyToPass(true);
  };

  useEffect(() => {
    if (isRevealing) {
      const handleEnd = () => setIsRevealing(false);

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

  return (
    <div className={styles.container}>
      <div className={styles.instruction}>
        Turno de:
        <strong
          className={styles.playerName}
          style={{ '--player-color': currentPlayer.color }}>
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
              style={{ pointerEvents: 'auto' }}>
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
              onContextMenu={(e) => e.preventDefault()}
              style={{
                '--player-color': currentPlayer.color,
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
          onClick={() => {
            triggerFeedback('select');
            nextPlayer();
          }}
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
