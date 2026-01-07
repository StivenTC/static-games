import { Eye, EyeOff } from 'lucide-react';
import { usePlayerStore } from '../../../../shared/stores/usePlayerStore';
import Button from '../../../../shared/ui/Button/Button';
import { useTabuStore } from '../../stores/useTabuStore';

const TabuReady = () => {
  const { players } = usePlayerStore();
  const { currentPlayerId, startTurn } = useTabuStore();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  if (!currentPlayer) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
        textAlign: 'center',
        color: 'white',
      }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: currentPlayer.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: 'bold',
          boxShadow: `0 0 20px ${currentPlayer.color}66`,
        }}>
        {currentPlayer.name.charAt(0).toUpperCase()}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Turno de{' '}
        <span style={{ color: currentPlayer.color }}>{currentPlayer.name}</span>
      </h2>

      <p style={{ opacity: 0.8, marginBottom: '3rem', maxWidth: 300 }}>
        Pasa el dispositivo a {currentPlayer.name}. La palabra está oculta hasta
        que presiones comenzar.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: 300,
        }}>
        <Button
          variant="primary"
          onClick={startTurn}
          style={{ height: '3.5rem', fontSize: '1.2rem' }}>
          <Eye size={24} style={{ marginRight: 8 }} />
          Empezar
        </Button>
      </div>

      <div
        style={{
          marginTop: '2rem',
          opacity: 0.5,
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.9rem',
        }}>
        <EyeOff size={16} style={{ marginRight: 6 }} />
        Palabra oculta
      </div>
    </div>
  );
};

export default TabuReady;
