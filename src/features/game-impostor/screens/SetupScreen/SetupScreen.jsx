import { Play, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import Button from '@/shared/ui/Button/Button';
import Input from '@/shared/ui/Input/Input';
import { useImpostorStore } from '../../stores/useImpostorStore';
import styles from './SetupScreen.module.scss';

export default function SetupScreen({ themeColor }) {
  const [name, setName] = useState('');
  const { players, addPlayer, removePlayer, startGame } = useImpostorStore();

  const handleAdd = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const trimmedName = name.trim();
      const capitalized =
        trimmedName.charAt(0).toUpperCase() +
        trimmedName.slice(1).toLowerCase();
      addPlayer(capitalized);
      setName('');
    }
  };

  return (
    <div className={styles.container} style={{ '--theme-color': themeColor }}>
      <div className={styles.header}>
        <h2>Impostor</h2>
        <p>Agrega jugadores (Mínimo 3)</p>
      </div>

      <form onSubmit={handleAdd} className={styles.form}>
        <div className={styles.inputGroup}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del jugador"
            className={styles.input}
            focusColor={themeColor}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!name.trim()}
            className={styles.addButton}>
            <UserPlus size={20} />
          </Button>
        </div>
      </form>

      <div className={styles.playerList}>
        {players.map((p) => (
          <div
            key={p.id}
            className={styles.playerItem}
            style={{ '--player-color': p.color || '#fff' }}>
            <span>{p.name}</span>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removePlayer(p.id)}>
              <X size={20} />
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <div className={styles.emptyMessage}>No hay jugadores aún.</div>
        )}
      </div>

      <div className={styles.footer}>
        <Button
          variant="primary"
          onClick={startGame}
          disabled={players.length < 3}
          style={{
            backgroundColor: players.length >= 3 ? themeColor : undefined,
            borderColor: themeColor,
          }}>
          <Play size={20} className={styles.playIcon} />
          Comenzar Juego
        </Button>
      </div>
    </div>
  );
}
