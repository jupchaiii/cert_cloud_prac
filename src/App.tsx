import { Routes, Route, Link } from 'react-router-dom'
import S3Page from './pages/S3Page'
import './App.css'

function Home() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src="/hero.png" className="base" width="170" height="179" alt="" />
          <img src="/react.svg" className="framework" alt="React logo" />
          <img src="/vite.svg" className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Cert Cloud Practice</h1>
          <p>AWS Cloud Practitioner Study Guide — React + Vite</p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>📚 AWS Services</h2>
          <p>คู่มือฉบับสมบูรณ์สำหรับเตรียมสอบ</p>
          <ul>
            <li>
              <Link to="/s3">
                <img className="logo" src="/react.svg" alt="" />
                Amazon S3 — Storage
              </Link>
            </li>
            <li>
              <Link to="/ec2">
                <img className="logo" src="/react.svg" alt="" />
                Amazon EC2 — Compute
              </Link>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>📖 Documents</h2>
          <p>Markdown study guides</p>
          <ul>
            <li>
              <a href="https://github.com/jupchaiii/cert_cloud_prac" target="_blank" rel="noopener noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

function EC2Placeholder() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h1 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Amazon EC2</h1>
      <p>Coming soon — EC2 detailed guide</p>
      <Link to="/" style={{ color: 'var(--accent)', marginTop: '1rem', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/s3" element={<S3Page />} />
      <Route path="/ec2" element={<EC2Placeholder />} />
    </Routes>
  )
}

export default App
