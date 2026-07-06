import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getDoc } from './docs.js';
import { t, getLang } from './i18n.js';

// Build a slug identical to what rehype-slug generates for heading ids
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0E00-\u0E7F\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractToc(markdown) {
  const lines = markdown.split('\n');
  const toc = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,4})\s+(.+?)\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[`*_]/g, '').trim();
      toc.push({ level, text, id: slugify(text) });
    }
  }
  return toc;
}

function estimateReadingMinutes(text) {
  const words = text.split(/\s+/).length;
  // Mixed Thai/English -> ~180 wpm is a fair average
  return Math.max(1, Math.round(words / 180));
}

export default function Document() {
  const { id } = useParams();
  const doc = getDoc(id);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!doc) return;
    setContent(null);
    setError(null);
    fetch(`${import.meta.env.BASE_URL}content/${doc.file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(setContent)
      .catch((e) => setError(e.message));
  }, [id, doc]);

  const toc = useMemo(() => (content ? extractToc(content) : []), [content]);
  const minutes = useMemo(() => (content ? estimateReadingMinutes(content) : 0), [content]);

  // Track which heading is in view for the sidebar active state
  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    toc.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  if (!doc) {
    return (
      <div className="empty-state">
        <p>{t('doc.error')}</p>
        <Link to="/">← {t('doc.backToHome')}</Link>
      </div>
    );
  }

  const lang = getLang();

  return (
    <div className="doc-layout">
      <aside className="doc-sidebar">
        <h4>{t('doc.contents')}</h4>
        <ul className="toc">
          {toc.map((h, i) => (
            <li key={i}>
              <a
                href={`#${h.id}`}
                className={`lvl-${h.level} ${activeId === h.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(h.id);
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <article className="doc-content">
        <Link to="/" className="back-link">
          ← {t('doc.backToHome')}
        </Link>
        <header className="doc-header">
          <h1>{doc.title[lang]}</h1>
          <div className="meta">
            <span>📄 {doc.file}</span>
            <span>
              ⏱ {t('doc.readingTime')}: ~{minutes} {t('doc.minutes')}
            </span>
          </div>
        </header>

        {error && <p style={{ color: 'crimson' }}>{t('doc.error')}: {error}</p>}
        {!content && !error && <p>{t('doc.loading')}</p>}
        {content && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ]}
          >
            {content}
          </ReactMarkdown>
        )}
      </article>
    </div>
  );
}
