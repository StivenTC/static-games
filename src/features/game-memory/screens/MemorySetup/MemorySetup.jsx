import { usePlayerStore } from '@/shared/stores/usePlayerStore';
import GameSetup from '@/shared/ui/GameSetup/GameSetup';
import theme from '@/styles/theme.module.scss';
import { useMemoryStore } from '../../stores/useMemoryStore';

const MemorySetup = () => {
  const { setupGame } = useMemoryStore();
  const { players } = usePlayerStore();

  return (
    <GameSetup
      title="Memoria"
      themeColor={theme.neonGreen}
      minPlayers={1}
      onStart={() => setupGame(players)}
    />
  );
};

export default MemorySetup;
