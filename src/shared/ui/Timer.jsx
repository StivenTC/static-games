import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Timer.module.scss';

export default function Timer({ 
  initialSeconds = 30, 
  onComplete,
  onTick, // New prop
  isRunning = true
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  
  // Calculate SVG stroke offset for progress circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / initialSeconds) * circumference;
  const strokeDashoffset = circumference - progress;

  useEffect(() => {
    // Reset if initialSeconds change
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds === 0 && onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => {
        const next = Math.max(0, prev - 1);
        if (onTick) onTick(next); // Call tick with next value
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, onComplete, onTick]);

  // Determine variant based on time left
  const getVariant = () => {
    if (seconds <= 5) return 'danger';
    if (seconds <= 10) return 'warning';
    return 'normal';
  };

  const variant = getVariant();

  return (
    <div className={styles.container}>
      <svg className={styles.svg} viewBox="0 0 140 140">
        <circle 
          className={styles.circleBackground}
          cx="70" cy="70" r={radius}
        />
        <circle 
          className={classNames(styles.circleProgress, styles[variant])}
          cx="70" cy="70" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className={classNames(styles.timeDisplay, styles[variant])}>
        {seconds}
      </div>
    </div>
  );
}
