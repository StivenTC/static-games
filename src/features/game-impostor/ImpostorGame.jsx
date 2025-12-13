import { useNavigate } from 'react-router-dom';
import { useImpostorStore } from './stores/useImpostorStore';
import MainLayout from '../../shared/layouts/MainLayout';
import SetupScreen from './screens/SetupScreen';
import RevealScreen from './screens/RevealScreen';
import DebateScreen from './screens/DebateScreen';
import VotingScreen from './screens/VotingScreen';
import ResultScreen from './screens/ResultScreen';
import { ArrowLeft } from 'lucide-react';

export default function ImpostorGame() {
  const navigate = useNavigate();
  const { phase, resetGame, players } = useImpostorStore();

  const handleBack = () => {
    // If game is in progress, maybe warn? For now just go back.
    resetGame();
    navigate('/');
  };

  return (
    <MainLayout>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button type="button" onClick={handleBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <ArrowLeft />
        </button>
        <span style={{ fontWeight: 'bold', color: '#ff0055' }}>
            IMPOSTOR {phase !== 'SETUP' && `• ${players.length} Jugadores`}
        </span>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </div>

      {phase === 'SETUP' && <SetupScreen />}
      {phase === 'REVEAL' && <RevealScreen />}
      {phase === 'DEBATE' && <DebateScreen />}
      {phase === 'VOTING' && <VotingScreen />}
      {phase === 'RESULT' && <ResultScreen />}
    </MainLayout>
  );
}
