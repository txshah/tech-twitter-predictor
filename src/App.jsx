import { useState } from 'react';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const KEY_INVALID = !apiKey || apiKey.trim() === '' || apiKey === 'your_key_here';

function MissingKeyScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#111',
        border: '1px solid #ff174430',
        borderRadius: '14px',
        padding: '36px 32px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '18px' }}>🔑</div>
        <h2 style={{
          color: '#f0f0f0',
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '-0.5px',
          marginBottom: '12px',
        }}>
          API Key Required
        </h2>
        <p style={{
          color: '#555',
          fontSize: '13px',
          lineHeight: 1.65,
          marginBottom: '20px',
        }}>
          Add your Anthropic API key to{' '}
          <code style={{
            color: '#ff9800',
            background: '#1a1a1a',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '12px',
          }}>
            .env
          </code>
          {' '}— CTTO won't run without it.
        </p>
        <code style={{
          display: 'block',
          background: '#0a0a0a',
          border: '1px solid #1e1e1e',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#555',
          fontSize: '11px',
          textAlign: 'left',
          marginBottom: '24px',
          wordBreak: 'break-all',
          lineHeight: 1.6,
        }}>
          VITE_OPENAI_API_KEY=sk-ant-...
        </code>
        <a
          href="https://console.anthropic.com"
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#ff2d55',
            fontSize: '13px',
            textDecoration: 'none',
            borderBottom: '1px solid #ff2d5540',
            paddingBottom: '1px',
          }}
        >
          Get a key at console.anthropic.com →
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [result, setResult] = useState(null);

  if (KEY_INVALID) return <MissingKeyScreen />;

  const handleResult = (data) => setResult(data);
  const handleReset = () => setResult(null);

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '52px',
        background: 'rgba(13,13,13,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #181818',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span
          onClick={handleReset}
          style={{
            fontWeight: 900,
            fontSize: '18px',
            color: '#ffffff',
            letterSpacing: '-2px',
            cursor: 'pointer',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          CTTO 💥
        </span>

        {result && (
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: '1px solid #282828',
              color: '#555',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '11px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Crash another
          </button>
        )}
      </nav>

      {result
        ? <Results result={result} onReset={handleReset} />
        : <Home onResult={handleResult} />
      }
    </>
  );
}
