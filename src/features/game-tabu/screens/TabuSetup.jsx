import { usePlayerStore } from '../../../shared/stores/usePlayerStore';
import GameSetup from '../../../shared/ui/GameSetup/GameSetup';
import { useTabuStore } from '../stores/useTabuStore';

const TabuSetup = () => {
  const { setupGame } = useTabuStore();
  const { players } = usePlayerStore();

  return (
    <GameSetup
      title="Tabú"
      themeColor="#bd00ff"
      minPlayers={2}
      onStart={() => setupGame(players)}
    />
  );
};

export default TabuSetup;
