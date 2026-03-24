import styles from './Toolbar.module.css'

export default function Toolbar({ wireframe, onWireframe, autoRotate, onAutoRotate }) {
  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.btn} ${autoRotate ? styles.active : ''}`}
        onClick={onAutoRotate}
        title="Auto-rotate"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5A10 10 0 0 1 18.8 5.3M22 12.5A10 10 0 0 1 5.2 18.7" strokeLinecap="round"/>
        </svg>
        <span>rotate</span>
      </button>

      <button
        className={`${styles.btn} ${wireframe ? styles.active : ''}`}
        onClick={onWireframe}
        title="Wireframe"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>wireframe</span>
      </button>

      <div className={styles.hint}>
        <span>drag to rotate</span>
        <span className={styles.sep}>·</span>
        <span>scroll to zoom</span>
      </div>
    </div>
  )
}
