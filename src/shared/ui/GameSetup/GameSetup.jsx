import { Play, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './GameSetup.module.scss';

export default function GameSetup({
  title = 'Juego',
  minPlayers = 2,
  onStart,
  themeColor = '#ffffff',
}) {
  const [name, setName] = useState('');
  const { players, addPlayer, removePlayer } = usePlayerStore();

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2
          style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}66` }}>
          {title}
        </h2>
        <p>Agrega jugadores (Mínimo {minPlayers})</p>
      </div>

      <form onSubmit={handleAdd} className={styles.form}>
        <div className={styles.inputGroup}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del jugador"
            className={styles.input}
            style={{ borderColor: themeColor }}
            focusColor={themeColor}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!name.trim()}
            className={styles.addButton}
            style={{ borderColor: themeColor, color: themeColor }}>
            <UserPlus size={20} />
          </Button>
        </div>
      </form>

      <div className={styles.playerList}>
        {players.map((p) => (
          <div
            key={p.id}
            className={styles.playerItem}
            style={{ borderLeft: `4px solid ${p.color || '#fff'}` }}>
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
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>
            No hay jugadores aún.
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button
          variant="primary"
          onClick={onStart}
          disabled={players.length < minPlayers}
          style={{
            backgroundColor:
              players.length >= minPlayers ? themeColor : undefined,
            borderColor: themeColor,
          }}>
          <Play size={20} style={{ marginRight: '8px' }} />
          Comenzar Juego
        </Button>
      </div>
    </div>
  );
}
