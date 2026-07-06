import { Link } from 'react-router-dom';
import { documents } from './docs.js';
import { t, getLang } from './i18n.js';

export default function Home() {
  const lang = getLang();

  return (
    <>
      <section className="hero">
        <h1>{t('home.welcome')}</h1>
        <p>{t('home.intro')}</p>
        <Link to={`/doc/${documents[0].id}`} className="hero-cta">
          {t('home.startReading')} →
        </Link>
      </section>

      <section>
        <h2 className="section-title">{t('home.statsTitle')}</h2>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-num">{documents.length}</div>
            <div className="stat-label">{t('home.statsFiles')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">95+</div>
            <div className="stat-label">{t('home.statsServices')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">4</div>
            <div className="stat-label">{t('home.statsDomains')}</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">{t('home.documentsTitle')}</h2>
        <p className="section-sub">{t('home.documentsSubtitle')}</p>
        <div className="doc-grid">
          {documents.map((d) => (
            <Link
              key={d.id}
              to={`/doc/${d.id}`}
              className="doc-card"
              style={{ '--card-color': d.color }}
            >
              <h3>{d.title[lang]}</h3>
              <p>{d.description[lang]}</p>
              <span className="doc-file">{d.file}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
