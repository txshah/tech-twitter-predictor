import { useState, useEffect, useRef } from 'react';
import { APP_NAME, TAGLINE, EXAMPLES } from '../lib/constants.js';
import { T } from '../lib/theme.js';
import DropZone from '../components/DropZone.jsx';
import { analyzePost } from '../lib/oracle.js';

const PLATFORMS = ['Twitter/X', 'LinkedIn', 'Both'];

const LOADING_MESSAGES = [
  'deploying simulation agents...',
  'scanning twitter for ratio energy...',
  'calculating meme potential...',
  'consulting the WSB oracle...',
  'measuring cringe levels...',
  'predicting quote tweet damage...',
  'running 847 simulated replies...',
  'almost done cooking...',
];

const NOISE_URI = "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cfilter%20id%3D'n'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'0.65'%20numOctaves%3D'3'%20stitchTiles%3D'stitch'%2F%3E%3CfeColorMatrix%20type%3D'saturate'%20values%3D'0'%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20filter%3D'url(%23n)'%2F%3E%3C%2Fsvg%3E\")";

export default function Home({ onResult }) {
  const [postText, setPostText]         = useState('');
  const [platform, setPlatform]         = useState('Twitter/X');
  const [uploadedImageUrl, setImageUrl] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [ctaHovered, setCtaHovered]     = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [loadingMsgVisible, setLoadingMsgVisible] = useState(true);
  const [borderFlash, setBorderFlash]   = useState(null);
  const [vis, setVis]                   = useState(new Set());
  const intervalRef                     = useRef(null);

  // Stagger entrance animations
  useEffect(() => {
    const ts = [0, 80, 160, 240, 320, 400].map((delay, i) =>
      setTimeout(() => setVis(s => new Set([...s, i])), delay)
    );
    return () => ts.forEach(clearTimeout);
  }, []);

  // Loading message cycling
  useEffect(() => {
    if (loading) {
      setLoadingMsgIdx(0);
      setLoadingMsgVisible(true);
      intervalRef.current = setInterval(() => {
        setLoadingMsgVisible(false);
        setTimeout(() => {
          setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
          setLoadingMsgVisible(true);
        }, 300);
      }, 1200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [loading]);

  // Border flash easter egg
  useEffect(() => {
    const lower = postText.toLowerCase();
    if (lower.includes('elon')) {
      setBorderFlash(T.red);
      const t = setTimeout(() => setBorderFlash(null), 600);
      return () => clearTimeout(t);
    }
    if (lower.includes('zuck')) {
      setBorderFlash(T.blue);
      const t = setTimeout(() => setBorderFlash(null), 600);
      return () => clearTimeout(t);
    }
  }, [postText]);

  const canSubmit = postText.trim().length > 0 && !loading;

  const handleImageChange = (url) => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    setImageUrl(url);
  };

  const loadExample = (ex) => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    setImageUrl(null);
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

  const sec = (i) => `ctto-section${vis.has(i) ? ' visible' : ''}`;

  const charCountLabel = postText.length === 0
    ? '0 chars — feed me'
    : `${postText.length} chars of potential chaos`;

  return (
    <div style={{ background: T.bg, position: 'relative' }}>

      {/* Noise overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: NOISE_URI,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Hero section ── */}
      <section style={{
        padding: '48px 5vw 32px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Row 1: CRASH + tagline */}
        <div className={sec(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{
            fontFamily: T.display,
            fontSize: '14vw',
            lineHeight: 0.9,
            color: T.textPrimary,
            userSelect: 'none',
          }}>
            CRASH
          </span>
          <div style={{
            fontFamily: T.body,
            fontSize: '13px',
            color: T.textSecondary,
            lineHeight: 1.75,
            textAlign: 'right',
            paddingBottom: '1.4vw',
            flexShrink: 0,
          }}>
            <div>Feed it a post.</div>
            <div>We simulate the chaos.</div>
            <div>You watch them get cooked.</div>
          </div>
        </div>

        {/* Row 2: THE TECH OUT */}
        <div className={sec(0)} style={{
          fontFamily: T.display,
          fontSize: '14vw',
          lineHeight: 0.9,
          userSelect: 'none',
        }}>
          <span style={{ color: T.textPrimary }}>THE TECH </span>
          <span style={{ WebkitTextStroke: `2px ${T.textPrimary}`, color: 'transparent' }}>OUT</span>
        </div>

        {/* Divider */}
        <div className={sec(1)} style={{ position: 'relative', height: '1px', background: T.border, margin: '28px 0 0' }}>
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            background: T.bg3,
            border: `1px solid ${T.border}`,
            borderRadius: '100px',
            padding: '5px 16px',
            fontFamily: T.body,
            fontSize: '11px',
            color: T.textMuted,
            whiteSpace: 'nowrap',
          }}>
            ↓ drop a post and ruin someone's day
          </span>
        </div>
      </section>

      {/* ── Input section ── */}
      <section style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '48px 24px 96px',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Platform label */}
        <div className={sec(2)} style={{
          fontFamily: T.body,
          fontSize: '10px',
          color: T.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '10px',
          fontWeight: 500,
        }}>
          SELECT PLATFORM // WHERE ARE THEY GETTING COOKED
        </div>

        {/* Platform pills */}
        <div className={sec(2)} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {PLATFORMS.map((p) => {
            const active = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '100px',
                  border: `1px solid ${active ? 'transparent' : T.border}`,
                  background: active ? T.accent : 'transparent',
                  color: active ? '#000' : T.textSecondary,
                  fontSize: '12px',
                  fontFamily: T.body,
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Example chips */}
        <div className={sec(3)} style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '14px',
        }}>
          <span style={{ fontFamily: T.body, color: T.textMuted, fontSize: '11px', flexShrink: 0 }}>
            KNOWN OFFENDERS:
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => loadExample(ex)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.accent;
                e.currentTarget.style.color = T.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.textSecondary;
              }}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: `1px solid ${T.border}`,
                background: T.bg3,
                color: T.textSecondary,
                fontSize: '11px',
                fontFamily: T.body,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              {ex.name}
            </button>
          ))}
        </div>

        {/* DropZone with flash border */}
        <div className={sec(4)} style={{
          border: borderFlash ? `2px solid ${borderFlash}` : undefined,
          borderRadius: borderFlash ? '18px' : undefined,
          transition: 'border-color 0.1s',
        }}>
          <DropZone
            postText={postText}
            onTextChange={(t) => { setPostText(t); setError(null); }}
            onImageChange={handleImageChange}
            uploadedImageUrl={uploadedImageUrl}
            charCountLabel={charCountLabel}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '12px',
            background: 'rgba(255,68,68,0.08)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: T.red,
            fontSize: '13px',
            fontFamily: T.body,
            lineHeight: 1.55,
            wordBreak: 'break-word',
          }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <div className={sec(5)}>
          <button
            onClick={handleCrash}
            disabled={!canSubmit}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              marginTop: '14px',
              width: '100%',
              height: '56px',
              fontFamily: T.display,
              fontSize: '22px',
              letterSpacing: '0.1em',
              background: loading
                ? 'linear-gradient(90deg, #e8ff47, #ffffff, #e8ff47)'
                : canSubmit
                  ? (ctaHovered ? T.accentDark : T.accent)
                  : T.bg3,
              backgroundSize: loading ? '200% auto' : 'auto',
              color: canSubmit ? '#000' : T.textMuted,
              border: 'none',
              borderRadius: '12px',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              pointerEvents: loading ? 'none' : 'auto',
              opacity: !canSubmit && !loading ? 0.3 : 1,
              transform: ctaHovered && canSubmit && !loading ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'transform 0.15s, opacity 0.15s',
              animation: loading ? 'ctto-shimmer 1.5s linear infinite' : 'none',
            }}
          >
            {loading ? 'CRASHING...' : 'CRASH IT'}
          </button>

          {/* Loading message */}
          {loading && (
            <div style={{
              marginTop: '10px',
              textAlign: 'center',
              fontFamily: T.body,
              fontSize: '12px',
              color: T.textMuted,
              opacity: loadingMsgVisible ? 1 : 0,
              transition: 'opacity 0.3s',
              letterSpacing: '0.02em',
            }}>
              {LOADING_MESSAGES[loadingMsgIdx]}
            </div>
          )}

          {/* Idle subtitle */}
          {!loading && (
            <div style={{
              marginTop: '10px',
              textAlign: 'center',
              fontFamily: T.body,
              fontSize: '12px',
              color: T.textMuted,
              letterSpacing: '0.02em',
            }}>
              powered by multi-agent simulation
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
