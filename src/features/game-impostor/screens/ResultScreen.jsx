import { Home, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/ui/Button';
import { useImpostorStore } from '../stores/useImpostorStore';
import styles from './ResultScreen.module.scss';

export default function ResultScreen() {
  const { players, mostVotedId, secretWord, restartGame, resetGame } =
    useImpostorStore();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResult(true);
    }
  }, [countdown]);

  const mostVotedPlayer = players.find((p) => p.id === mostVotedId);
  const isImpostor = mostVotedPlayer?.role === 'IMPOSTOR';
  const actualImpostor = players.find((p) => p.role === 'IMPOSTOR');

  const handleRestart = () => {
    restartGame();
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  if (!showResult) {
    return (
      <div className={styles.container}>
        <div className={styles.countdown}>{countdown}</div>
        <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>
          Revelando resultados...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultBox}>
        <div className={styles.mostVoted}>
          El más votado fue:
          <strong style={{ color: mostVotedPlayer?.color || '#fff' }}>
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
          <div
            style={{
              marginTop: '2rem',
              fontSize: '1.25rem',
              color: '#ff0055',
            }}>
            El verdadero Impostor era: <br />
            <strong style={{ fontSize: '2rem', color: actualImpostor?.color }}>
              {actualImpostor?.name}
            </strong>
          </div>
        )}

        <div className={styles.secretWordResult}>
          La palabra era: <span>{secretWord}</span>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <Button variant="primary" onClick={handleRestart}>
          <RotateCw size={20} />
          Jugar de Nuevo
        </Button>
        <Button variant="outline" onClick={handleHome}>
          <Home size={20} />
          Ir al Inicio
        </Button>
      </div>
    </div>
  );
}
