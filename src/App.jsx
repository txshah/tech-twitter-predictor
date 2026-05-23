import { useState } from 'react';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import { T } from './lib/theme.js';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const KEY_INVALID = !apiKey || apiKey.trim() === '' || apiKey === 'your_key_here';

function MissingKeyScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: T.bg2,
        border: `1px solid rgba(255,68,68,0.2)`,
        borderRadius: '16px',
        padding: '36px 32px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '20px' }}>🔑</div>
        <h2 style={{
          fontFamily: T.display,
          fontSize: '28px',
          color: T.textPrimary,
          letterSpacing: '0.05em',
          marginBottom: '12px',
        }}>
          API KEY REQUIRED
        </h2>
        <p style={{
          fontFamily: T.body,
          color: T.textSecondary,
          fontSize: '13px',
          lineHeight: 1.65,
          marginBottom: '20px',
        }}>
          Add your OpenAI API key to{' '}
          <code style={{ fontFamily: T.mono, color: '#ff8800', background: T.bg3, padding: '1px 6px', borderRadius: '3px', fontSize: '12px' }}>
            .env
          </code>
          {' '}— CTTO won't run without it.
        </p>
        <code style={{
          display: 'block',
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: '10px',
          padding: '12px 16px',
          fontFamily: T.mono,
          color: T.textMuted,
          fontSize: '11px',
          textAlign: 'left',
          marginBottom: '24px',
          wordBreak: 'break-all',
          lineHeight: 1.6,
        }}>
          VITE_OPENAI_API_KEY=sk-...
        </code>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: T.body,
            color: T.accent,
            fontSize: '13px',
            textDecoration: 'none',
            borderBottom: `1px solid rgba(232,255,71,0.3)`,
            paddingBottom: '1px',
          }}
        >
          Get a key at platform.openai.com →
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [result, setResult] = useState(null);

  if (KEY_INVALID) return <MissingKeyScreen />;

  const handleResult = (data) => setResult(data);
  const handleReset  = () => setResult(null);

  return (
    <>
      {/* ── Sticky Nav ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${T.border}`,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: CTTO + BETA badge */}
        <div
          onClick={handleReset}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{
            fontFamily: T.display,
            fontSize: '22px',
            color: T.textPrimary,
            letterSpacing: '0.15em',
            lineHeight: 1,
          }}>
            CTTO
          </span>
          <span style={{
            fontFamily: T.body,
            fontSize: '9px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: T.accent,
            background: 'rgba(232,255,71,0.15)',
            padding: '2px 7px',
            borderRadius: '100px',
            lineHeight: 1.6,
          }}>
            BETA
          </span>
        </div>

        {/* Right: pulsing dot + LIVE ORACLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: T.accent,
            animation: 'ctto-nav-pulse 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: T.body,
            fontSize: '11px',
            color: T.textSecondary,
            letterSpacing: '0.04em',
          }}>
            ORACLE ONLINE
          </span>

          {result && (
            <button
              onClick={handleReset}
              style={{
                marginLeft: '16px',
                background: 'transparent',
                border: `1px solid ${T.border}`,
                color: T.textSecondary,
                padding: '5px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: T.body,
                fontSize: '11px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Crash another
            </button>
          )}
        </div>
      </nav>

      {result
        ? <Results result={result} onReset={handleReset} />
        : <Home onResult={handleResult} />
      }
    </>
  );
}
