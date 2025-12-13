import { useEffect, useState } from 'react';

import Button from '../../../shared/ui/Button';
import { useImpostorStore } from '../stores/useImpostorStore';
import styles from './RevealScreen.module.scss';

export default function RevealScreen() {
  const { players, currentPlayerIndex, secretWord, nextPlayer } = useImpostorStore();
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
        <strong>{currentPlayer.name}</strong>
      </div>

      <div className={styles.revealArea}>
        {isRevealing ? (
          <div className={styles.roleCard}>
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
          </div>
        ) : (
          <button 
            type="button"
            className={styles.holdButton}
            onPointerDown={handlePointerDown}
            onContextMenu={(e) => e.preventDefault()} // Prevent right click
            style={{ touchAction: 'none' }} // Critical for touch devices
          >
            MANTÉN <br/> PRESIONADO
          </button>
        )}
      </div>

      {readyToPass && !isRevealing && (
        <Button variant="primary" onClick={nextPlayer}>
          Listo / Siguiente
        </Button>
      )}
      
      {!readyToPass && (
          <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Presiona para ver tu rol</p>
      )}
    </div>
  );
}
