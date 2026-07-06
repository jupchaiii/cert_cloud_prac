import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import Home from './Home.jsx';
import Document from './Document.jsx';
import About from './About.jsx';
import { t } from './i18n.js';

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doc/:id" element={<Document />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="footer">
          {t('footer.builtWith')} ·{' '}
          <a
            href="https://github.com/jupchaiii/cert_cloud_prac"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('footer.source')}
          </a>
        </footer>
      </div>
    </HashRouter>
  );
}
