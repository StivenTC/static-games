import classNames from 'classnames';
import styles from './Input.module.scss';

export default function Input({
  value,
  onChange,
  placeholder,
  label,
  id,
  type = 'text',
  className,
  error = false
  // helperText, etc can be added later
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={classNames(styles.wrapper, className)}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <input
        id={inputId}
        type={type}
        className={classNames(styles.input, { [styles.error]: error })}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
