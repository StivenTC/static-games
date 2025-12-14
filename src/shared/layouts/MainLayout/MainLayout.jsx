import styles from './MainLayout.module.scss';

export default function MainLayout({ children }) {
  return (
    <main className={styles.container}>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
