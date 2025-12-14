import classNames from 'classnames';
import { motion } from 'framer-motion';
import styles from './Button.module.scss';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled = false,
  type = 'button',
  style,
  ...props
}) {
  const btnClass = classNames(styles.button, styles[variant], className);

  return (
    <motion.button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      style={style}
      {...props}>
      {children}
    </motion.button>
  );
}
