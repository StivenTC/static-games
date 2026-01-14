import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Timer.module.scss';

export default function Timer({
  initialSeconds = 30,
  isRunning = true,
  onComplete,
  onTick,
  color,
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / initialSeconds) * circumference;
  const strokeDashoffset = circumference - progress;

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds === 0 && onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, onTick, seconds]);

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
          cx="70"
          cy="70"
          r={radius}
        />
        <circle
          className={classNames(styles.circleProgress, styles[variant])}
          cx="70"
          cy="70"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ stroke: color }}
        />
      </svg>
      <div
        className={classNames(styles.timeDisplay, styles[variant])}
        style={{ color: color }}>
        {seconds}
      </div>
    </div>
  );
}
