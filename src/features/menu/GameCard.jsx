import styles from './GameCard.module.scss';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GameCard({ title, icon: Icon, color, path, isExternal, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isExternal) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <motion.button 
      type="button"
      className={`${styles.card} ${className || ''}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      style={{ borderColor: color, color: 'inherit' }}
      aria-label={`Jugar ${title}`}>
      <div className={styles.iconWrapper} style={{ color: color }}>
        <Icon size={48} />
      </div>
      <span className={styles.title}>{title}</span>
    </motion.button>
  );
}
