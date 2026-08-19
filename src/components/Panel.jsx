import './Panel.css';

export default function Panel({ title, eyebrow, children, className = '', right }) {
  return (
    <section className={`panel ${className}`}>
      {(title || eyebrow) && (
        <header className="panel__head">
          <div>
            {eyebrow && <p className="panel__eyebrow">{eyebrow}</p>}
            {title && <h3 className="panel__title">{title}</h3>}
          </div>
          {right}
        </header>
      )}
      <div className="panel__body">{children}</div>
    </section>
  );
}
