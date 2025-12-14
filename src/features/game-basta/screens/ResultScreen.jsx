import React from 'react';
import { useBastaStore } from '../stores/useBastaStore';
import { usePlayerStore } from '../../../shared/stores/usePlayerStore';
import styles from './ResultScreen.module.scss';
import Button from '../../../shared/ui/Button';

export default function ResultScreen({ themeColor }) {
  const { winnerTeam, resetGame, currentPlayerId } = useBastaStore();
  const { players } = usePlayerStore();
  const loser = players.find((p) => p.id === currentPlayerId);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>{winnerTeam === 'players' ? '¡VICTORIA!' : '¡TIEMPO AGOTADO!'}</h1>

        {winnerTeam === 'time' && loser && (
          <div className={styles.loserInfo}>
            <p>Perdió:</p>
            <h2 style={{ color: loser.color || 'white' }}>{loser.name}</h2>
          </div>
        )}

        {winnerTeam === 'players' && (
          <p className={styles.message}>¡Completaron todas las letras!</p>
        )}

        <div className={styles.actions}>
          <Button
            onClick={resetGame}
            variant="primary"
            style={{ backgroundColor: themeColor, borderColor: themeColor }}>
            Jugar de Nuevo
          </Button>
        </div>
      </div>
    </div>
  );
}
