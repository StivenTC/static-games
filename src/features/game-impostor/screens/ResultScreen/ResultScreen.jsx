import { Home, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/ui/Button/Button';
import { useGameFeedback } from '@/shared/hooks/useGameFeedback';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './ResultScreen.module.scss';

export default function ResultScreen({ themeColor }) {
  const { players, mostVotedId, secretWord, restartGame, resetGame } =
    useImpostorStore();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const { triggerFeedback } = useGameFeedback();

  const mostVotedPlayer = players.find((p) => p.id === mostVotedId);
  const isImpostor = mostVotedPlayer?.role === 'IMPOSTOR';
  const actualImpostor = players.find((p) => p.role === 'IMPOSTOR');

  useEffect(() => {
    if (countdown > 0) {
      if (countdown <= 5) triggerFeedback('tick');
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (!showResult) {
        // Only trigger once
        if (isImpostor)
          triggerFeedback('success'); // Players win (found impostor)
        else triggerFeedback('gameover'); // Impostor wins (wrong person)
      }
      setShowResult(true);
    }
  }, [countdown, showResult, isImpostor, triggerFeedback]);

  const handleRestart = () => {
    triggerFeedback('reroll');
    restartGame();
  };

  const handleHome = () => {
    triggerFeedback('click');
    resetGame();
    navigate('/');
  };

  if (!showResult) {
    return (
      <div className={styles.container}>
        <div className={styles.countdown}>{countdown}</div>
        <p className={styles.revealingText}>Revelando resultados...</p>
      </div>
    );
  }

  return (
    <main className={styles.container} style={{ '--theme-color': themeColor }}>
      <div className={styles.resultBox}>
        <div className={styles.mostVoted}>
          <h2>El más votado fue:</h2>
          <strong
            className={styles.votedName}
            style={{ '--player-color': mostVotedPlayer?.color }}>
            {mostVotedPlayer ? mostVotedPlayer.name : 'Nadie'}
          </strong>
        </div>

        {mostVotedPlayer && (
          <div
            className={`${styles.roleReveal} ${isImpostor ? styles.impostor : styles.citizen}`}>
            {isImpostor ? 'ERA EL IMPOSTOR' : 'ERA INOCENTE'}
          </div>
        )}

        {!isImpostor && (
          <div className={styles.impostorReveal}>
            El verdadero Impostor era: <br />
            <strong
              className={styles.impostorName}
              style={{ '--player-color': actualImpostor?.color }}>
              {actualImpostor?.name}
            </strong>
          </div>
        )}

        <div className={styles.secretWordResult}>
          La palabra era: <span>{secretWord}</span>
        </div>
      </div>

      <nav className={styles.actions}>
        <Button
          variant="primary"
          onClick={handleRestart}
          className={styles.restartBtn}>
          <RotateCw size={20} />
          Jugar de Nuevo
        </Button>
        <Button
          variant="outline"
          onClick={handleHome}
          className={styles.homeBtn}>
          <Home size={20} />
          Ir al Inicio
        </Button>
      </nav>
    </main>
  );
}
