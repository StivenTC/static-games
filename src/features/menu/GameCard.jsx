import { motion } from 'framer-motion';
import styles from './GameCard.module.scss';
import { useNavigate } from 'react-router-dom';

export default function GameCard({ title, icon: Icon, color, path, isExternal }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isExternal) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div 
      className={styles.card}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      style={{ borderColor: color }}>
      <div className={styles.iconWrapper} style={{ color: color }}>
        <Icon size={48} />
      </div>
      <span className={styles.title}>{title}</span>
    </motion.div>
  );
}
