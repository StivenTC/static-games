import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../shared/layouts/MainLayout';
import GameSetup from '../../shared/ui/GameSetup';
import styles from './BastaGame.module.scss';
import PlayScreen from './screens/PlayScreen';
import ResultScreen from './screens/ResultScreen';
import { useBastaStore } from './stores/useBastaStore';

export default function BastaGame() {
  const navigate = useNavigate();
  const { gameStatus, resetGame, startGame, gamePlayers } = useBastaStore();
  const THEME_COLOR = '#00f3ff'; // Neon Blue from MenuPage

  const handleBack = () => {
    resetGame();
    navigate('/');
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Semantic Header */}
        <header className={styles.header}>
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
            aria-label="Volver al menú">
            <ArrowLeft />
          </button>

          <h1 className={styles.title} style={{ color: THEME_COLOR }}>
            BASTA{' '}
            {gameStatus !== 'setup' && (
              <span style={{ opacity: 0.8, fontSize: '0.9em' }}>
                • {gamePlayers.length} Jugadores
              </span>
            )}
          </h1>

          <div className={styles.placeholder} aria-hidden="true"></div>
        </header>

        {/* Main Game Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {gameStatus === 'setup' && (
            <GameSetup
              title="Basta"
              onStart={(players) => startGame(players?.[0]?.id)}
              minPlayers={2}
              themeColor={THEME_COLOR}
            />
          )}

          {gameStatus === 'playing' && <PlayScreen themeColor={THEME_COLOR} />}

          {gameStatus === 'finished' && (
            <ResultScreen themeColor={THEME_COLOR} />
          )}
        </main>
      </div>
    </MainLayout>
  );
}
