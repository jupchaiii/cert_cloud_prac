import { t } from './i18n.js';

export default function About() {
  return (
    <div className="about-card">
      <h2>{t('about.title')}</h2>
      <p>{t('about.p1')}</p>
      <p>{t('about.p2')}</p>
      <h3>{t('about.techTitle')}</h3>
      <ul>
        {t('about.tech').map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </div>
  );
}
