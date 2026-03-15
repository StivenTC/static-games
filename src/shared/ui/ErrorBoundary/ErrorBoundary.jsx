import { Component } from 'react';
import styles from './ErrorBoundary.module.scss';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>ERROR</h2>
            <p className={styles.message}>Algo salió mal en este juego.</p>
            <button
              type="button"
              className={styles.btn}
              onClick={() => window.location.assign('/')}>
              Volver al menú
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
