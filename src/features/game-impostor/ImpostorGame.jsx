import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';
import GameSetup from '@/shared/ui/GameSetup/GameSetup';
import theme from '@/styles/theme.module.scss';
import styles from './ImpostorGame.module.scss';
import DebateScreen from './screens/DebateScreen/DebateScreen';
import ResultScreen from './screens/ResultScreen/ResultScreen';
import RevealScreen from './screens/RevealScreen/RevealScreen';
import VotingScreen from './screens/VotingScreen/VotingScreen';
import { useImpostorStore } from './stores/useImpostorStore';

export default function ImpostorGame() {
  const navigate = useNavigate();
  const { phase, resetGame, players, startGame } = useImpostorStore();

  const handleBack = () => {
    // If game is in progress, maybe warn? For now just go back.
    resetGame();
    navigate('/');
  };

  return (
    <MainLayout>
      {/* Top Bar */}
      <div className={styles.header}>
        <button
          type="button"
          onClick={handleBack}
          className={styles.backButton}>
          <ArrowLeft />
        </button>
        <span className={styles.title}>
          IMPOSTOR {phase !== 'SETUP' && `• ${players.length} Jugadores`}
        </span>
        <div className={styles.spacer}></div>
      </div>

      {phase === 'SETUP' && (
        <GameSetup
          title="Impostor"
          onStart={startGame}
          minPlayers={3}
          themeColor={theme.neonRed}
        />
      )}
      {phase === 'REVEAL' && <RevealScreen themeColor={theme.neonRed} />}
      {phase === 'DEBATE' && <DebateScreen themeColor={theme.neonRed} />}
      {phase === 'VOTING' && <VotingScreen themeColor={theme.neonRed} />}
      {phase === 'RESULT' && <ResultScreen themeColor={theme.neonRed} />}
    </MainLayout>
  );
}
