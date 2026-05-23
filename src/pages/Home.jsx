import { useState } from 'react';
import { APP_NAME, TAGLINE, EXAMPLES } from '../lib/constants.js';
import DropZone from '../components/DropZone.jsx';
import { analyzePost } from '../lib/oracle.js';

const PLATFORMS = ['Twitter/X', 'LinkedIn', 'Both'];

export default function Home({ onResult }) {
  const [postText, setPostText] = useState('');
  const [platform, setPlatform] = useState('Twitter/X');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = postText.trim().length > 0 && !loading;

  const handleImageChange = (url) => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    setUploadedImageUrl(url);
  };

  const loadExample = (ex) => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    setUploadedImageUrl(null);
    setPostText(ex.text);
    setError(null);
  };

  const handleCrash = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePost(postText, platform, !!uploadedImageUrl);
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px 64px',
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <h1 style={{
          fontSize: 'clamp(30px, 6vw, 62px)',
          fontWeight: 900,
          color: '#f0f0f0',
          letterSpacing: '-2px',
          lineHeight: 1,
          marginBottom: '16px',
        }}>
          {APP_NAME}
        </h1>
        <p style={{
          color: '#555',
          fontSize: 'clamp(13px, 1.8vw, 16px)',
          maxWidth: '400px',
          lineHeight: 1.65,
          margin: '0 auto',
        }}>
          {TAGLINE}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Platform pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {PLATFORMS.map((p) => {
            const active = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '100px',
                  border: `1px solid ${active ? '#ff2d55' : '#282828'}`,
                  background: active ? '#ff2d5514' : 'transparent',
                  color: active ? '#ff2d55' : '#555',
                  fontSize: '12px',
                  fontWeight: active ? 700 : 400,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                  transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Example chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px',
        }}>
          <span style={{ color: '#383838', fontSize: '11px', flexShrink: 0 }}>Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => loadExample(ex)}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: '1px solid #222',
                background: '#0f0f0f',
                color: '#777',
                fontSize: '11px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#383838';
                e.currentTarget.style.color = '#bbb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.color = '#777';
              }}
            >
              {ex.name}
            </button>
          ))}
        </div>

        {/* DropZone */}
        <DropZone
          postText={postText}
          onTextChange={(t) => { setPostText(t); setError(null); }}
          onImageChange={handleImageChange}
          uploadedImageUrl={uploadedImageUrl}
        />

        {/* Error block */}
        {error && (
          <div style={{
            marginTop: '12px',
            background: '#ff17441a',
            border: '1px solid #ff174440',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#ff6b6b',
            fontSize: '13px',
            lineHeight: 1.55,
            wordBreak: 'break-word',
          }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleCrash}
          disabled={!canSubmit}
          style={{
            marginTop: '14px',
            width: '100%',
            padding: '16px',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'inherit',
            background: '#111',
            color: canSubmit ? '#fff' : '#333',
            border: `2px solid ${canSubmit ? '#2a2a2a' : '#181818'}`,
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : canSubmit ? 'pointer' : 'not-allowed',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            pointerEvents: loading ? 'none' : 'auto',
            animation: loading ? 'ctto-pulse 0.8s ease-in-out infinite' : 'none',
            transition: 'color 0.15s, border-color 0.15s',
          }}
        >
          {loading ? 'Crashing...' : 'Crash It'}
        </button>
      </div>
    </div>
  );
}
