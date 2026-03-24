import styles from './Sidebar.module.css'

export default function Sidebar({ models, selected, onSelect }) {
  const model = models[selected]

  return (
    <aside className={styles.sidebar}>
      {/* Başlık */}
      <div className={styles.header}>
        <span className={styles.label}>portfolio</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>mirac</span>
      </div>

      {/* Model listesi */}
      <nav className={styles.nav}>
        {models.map((m, i) => (
          <button
            key={m.id}
            className={`${styles.item} ${i === selected ? styles.active : ''}`}
            onClick={() => onSelect(i)}
          >
            <span
              className={styles.dot}
              style={{ background: m.accentColor }}
            />
            <span className={styles.itemTitle}>{m.title}</span>
            <span className={styles.itemYear}>{m.year}</span>
          </button>
        ))}
      </nav>

      {/* Seçili model detayı */}
      <div className={styles.detail}>
        <h1 className={styles.modelTitle}>{model.title}</h1>
        <p className={styles.description}>{model.description}</p>

        <div className={styles.tags}>
          {model.tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerText}>miraccanyilmaz.me</span>
      </div>
    </aside>
  )
}
