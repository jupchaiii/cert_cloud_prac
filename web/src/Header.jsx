import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getLang, setLang, onLangChange, t, initLang } from './i18n.js';

export default function Header() {
  const [lang, setLangState] = useState(getLang());
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    initLang();
    setLangState(getLang());
    const unsub = onLangChange((l) => setLangState(l));
    return unsub;
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleLang = () => setLang(lang === 'th' ? 'en' : 'th');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          <div className="brand-logo">aws</div>
          <span>{t('appTitle')}</span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/about">{t('nav.about')}</NavLink>
        </nav>
        <div className="header-actions">
          <button className="lang-toggle" onClick={toggleLang} title="Toggle language">
            {t('lang.switchTo')}
          </button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
