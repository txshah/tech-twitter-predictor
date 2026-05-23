import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { T } from '../lib/theme.js';
import MetricCard from '../components/MetricCard.jsx';
import SubredditCard from '../components/SubredditCard.jsx';
import MemeTag from '../components/MemeTag.jsx';

const VERDICT_COLORS = {
  'MEGA VIRAL':      T.green,
  'WILL CLAP':       T.blue,
  'MID':             T.textSecondary,
  "GETTING RATIO'D": '#ff8800',
  'CRINGE VOID':     T.red,
};

const RING_R  = 70;
const RING_CX = 80;
const RING_CY = 80;
const RING_C  = 2 * Math.PI * RING_R;

function SectionHeader({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
      <span style={{ flex: 1, height: '1px', background: T.border }} />
      <span style={{
        fontFamily: T.body,
        color: T.textMuted,
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <span style={{ flex: 1, height: '1px', background: T.border }} />
    </div>
  );
}

export default function Results({ result, onReset }) {
  const [vis, setVis]               = useState(new Set());
  const [ringOffset, setRingOffset] = useState(RING_C);
  const [resetHovered, setResetHovered] = useState(false);

  useEffect(() => {
    const ts = [0, 100, 200, 300, 400, 500, 600, 700].map((delay, i) =>
      setTimeout(() => setVis(s => new Set([...s, i])), delay)
    );
    const ringT = setTimeout(() => {
      setRingOffset(RING_C * (1 - result.virality_score / 100));
    }, 350);
    return () => { ts.forEach(clearTimeout); clearTimeout(ringT); };
  }, [result.virality_score]);

  const sec = (i) => `ctto-section${vis.has(i) ? ' visible' : ''}`;

  if (!result) return null;

  const verdictColor = VERDICT_COLORS[result.verdict] ?? T.accent;

  const cloutBarScore = Math.round((result.clout_gain + 50) / 150 * 100);
  const cloutColor    = result.clout_gain >= 0 ? T.green : T.red;
  const cloutDisplay  = result.clout_gain >= 0 ? `+${result.clout_gain}` : String(result.clout_gain);

  const audienceData = [
    { group: 'True Believers', value: result.audience_split.true_believers },
    { group: 'Haters',         value: result.audience_split.haters },
    { group: 'Boomers',        value: result.audience_split.confused_boomers },
    { group: 'Press',          value: result.audience_split.journalists },
    { group: 'Meme Lords',     value: result.audience_split.meme_lords },
  ];

  const maxEngagement = Math.max(...result.timeline_hours.map(d => d.engagement));

  const shouldPost   = result.should_they_post;
  const bannerBorder = shouldPost ? 'rgba(68,255,136,0.3)' : 'rgba(255,68,68,0.3)';
  const bannerBg     = shouldPost ? 'rgba(68,255,136,0.05)' : 'rgba(255,68,68,0.05)';
  const bannerAccent = shouldPost ? T.green : T.red;

  const platform = result.platform || 'Twitter/X';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px 80px' }}>

      {/* 1 ── Verdict Banner */}
      <div
        className={sec(0)}
        style={{
          background: T.bg2,
          border: `1px solid ${T.border}`,
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        {/* Terminal header bar */}
        <div style={{
          height: '32px',
          background: T.bg3,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: '10px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          </div>
          <span style={{
            fontFamily: T.mono,
            fontSize: '11px',
            color: T.textMuted,
            letterSpacing: '0.04em',
          }}>
            ctto-oracle.exe — running analysis...
          </span>
        </div>

        {/* Scan line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
          animation: 'scanline 3s linear infinite',
          opacity: 0.4,
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Main content */}
        <div style={{
          padding: '32px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '36px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: T.display,
              fontSize: '52px',
              color: verdictColor,
              lineHeight: 1,
              marginBottom: '14px',
            }}>
              {result.verdict}
            </div>
            <div style={{
              fontFamily: T.body,
              fontSize: '16px',
              fontWeight: 500,
              color: T.textPrimary,
              lineHeight: 1.35,
              marginBottom: '10px',
            }}>
              {result.tldr}
              <span style={{
                color: T.accent,
                animation: 'ctto-blink 1s step-start infinite',
                marginLeft: '2px',
              }}>|</span>
            </div>
            <p style={{
              fontFamily: T.body,
              fontSize: '14px',
              color: T.textSecondary,
              lineHeight: 1.7,
              maxWidth: '480px',
            }}>
              {result.analysis}
            </p>
          </div>

          {/* SVG Progress Ring + Score — r=70, 160x160 */}
          <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
            <svg
              width="160" height="160" viewBox="0 0 160 160"
              style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
            >
              <circle
                cx={RING_CX} cy={RING_CY} r={RING_R}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
              />
              <circle
                cx={RING_CX} cy={RING_CY} r={RING_R}
                fill="none"
                stroke={verdictColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px',
            }}>
              <div style={{
                fontFamily: T.mono,
                fontSize: '56px',
                fontWeight: 700,
                color: verdictColor,
                lineHeight: 1,
              }}>
                {result.virality_score}
              </div>
              <div style={{
                fontFamily: T.body,
                fontSize: '10px',
                color: T.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                crash score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System stats row */}
      <div
        className={sec(0)}
        style={{
          fontFamily: T.mono,
          fontSize: '10px',
          color: T.textMuted,
          letterSpacing: '0.06em',
          marginBottom: '20px',
          padding: '0 4px',
        }}
      >
        SIM_AGENTS: 847 // ROUNDS: 24 // PLATFORM: {platform} // STATUS: COMPLETE ✓
      </div>

      {/* 2 ── Metric Cards */}
      <div style={{
        fontFamily: T.display,
        fontSize: '13px',
        color: T.textMuted,
        letterSpacing: '0.15em',
        marginBottom: '12px',
        textTransform: 'uppercase',
      }}>
        THE DAMAGE REPORT
      </div>
      <div
        className={sec(1)}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <MetricCard label="Clout Gain"     sublabel={result.clout_gain >= 0 ? 'riding the wave' : 'taking damage'}
          score={cloutBarScore} displayValue={cloutDisplay} color={cloutColor} sysLabel="SYS_CLOUT" />
        <MetricCard label="Stock Intent"   sublabel="people buying the dip?"  score={result.stock_intent_score}  color={T.blue}   sysLabel="SYS_STOCK" />
        <MetricCard label="Meme Potential" sublabel="meme factory output"      score={result.meme_potential}       color={T.purple} sysLabel="SYS_MEME"  />
        <MetricCard label="Ratio Risk"     sublabel="ratio incoming"           score={result.ratio_risk}           color="#ff8800"  sysLabel="SYS_RATIO" />
      </div>

      {/* 3 ── Charts */}
      <div
        className={sec(2)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Bar — engagement timeline */}
        <div style={{
          background: T.bg2,
          border: `1px solid ${T.border}`,
          borderRadius: '16px',
          padding: '20px 20px 10px',
        }}>
          <div style={{ fontFamily: T.body, color: T.textMuted, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            ENGAGEMENT DECAY CURVE // HOW LONG UNTIL NOBODY CARES
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={result.timeline_hours} barSize={24} barCategoryGap="30%">
              <XAxis dataKey="hour" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: T.body }} axisLine={false} tickLine={false} />
              <Bar dataKey="engagement" radius={[3, 3, 0, 0]}>
                {result.timeline_hours.map((entry, i) => (
                  <Cell key={i} fill={entry.engagement === maxEngagement ? T.accent : T.bg3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar — audience split */}
        <div style={{
          background: T.bg2,
          border: `1px solid ${T.border}`,
          borderRadius: '16px',
          padding: '20px 20px 10px',
        }}>
          <div style={{ fontFamily: T.body, color: T.textMuted, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            WHO IS EATING THIS UP
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={audienceData} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="group" tick={{ fill: T.textMuted, fontSize: 9, fontFamily: T.body }} />
              <Radar dataKey="value" stroke={T.accent} fill={T.accent} fillOpacity={0.08} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 ── Subreddits */}
      <div className={sec(3)} style={{ marginBottom: '28px' }}>
        <SectionHeader>SUBREDDITS CURRENTLY LOSING THEIR MINDS</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '12px' }}>
          {result.subreddits.map(sub => (
            <SubredditCard key={sub.name} name={sub.name} intensity={sub.intensity} reason={sub.reason} />
          ))}
        </div>
      </div>

      {/* 5 ── Meme formats */}
      <div className={sec(4)} style={{ marginBottom: '28px' }}>
        <SectionHeader>MEME FACTORY OUTPUT // FORMATS THIS WILL SPAWN</SectionHeader>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {result.meme_formats.map(fmt => <MemeTag key={fmt} label={fmt} />)}
        </div>
      </div>

      {/* 6 ── Quote blocks */}
      <div
        className={sec(5)}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}
      >
        {/* Predicted first reply */}
        <div style={{
          background: T.bg2,
          border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${T.borderHover}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ fontFamily: T.body, color: T.textMuted, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
            PREDICTED FIRST REPLY (99.2% CONFIDENCE)
          </div>
          <p style={{ fontFamily: T.body, color: T.textSecondary, fontSize: '13px', lineHeight: 1.65, fontStyle: 'italic' }}>
            {result.predicted_first_reply}
          </p>
        </div>

        {/* Quote tweet killer */}
        <div style={{
          background: T.bg2,
          border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${T.accent}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ fontFamily: T.body, color: T.textMuted, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
            THE KILL SHOT // QUOTE TWEET THAT ENDS THEIR WEEK
          </div>
          <p style={{ fontFamily: T.body, color: T.textSecondary, fontSize: '13px', lineHeight: 1.65, fontStyle: 'italic' }}>
            {result.quote_tweet_killer}
          </p>
        </div>
      </div>

      {/* 7 ── Should they post */}
      <div
        className={sec(6)}
        style={{
          background: bannerBg,
          border: `1px solid ${bannerBorder}`,
          borderRadius: '14px',
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '44px',
        }}
      >
        <span style={{ fontSize: '24px', flexShrink: 0, lineHeight: 1.3 }}>
          {shouldPost ? '✅' : '🚫'}
        </span>
        <div>
          <div style={{ fontFamily: T.display, fontSize: '20px', color: bannerAccent, marginBottom: '6px', letterSpacing: '0.05em' }}>
            {shouldPost ? 'CTTO VERDICT: POST IT.' : 'CTTO VERDICT: PUT THE PHONE DOWN.'}
          </div>
          <p style={{ fontFamily: T.body, fontSize: '14px', color: T.textPrimary, lineHeight: 1.6, marginBottom: '6px' }}>
            {shouldPost
              ? 'our agents agree. this one hits.'
              : 'we ran 847 simulations. they all ended badly.'}
          </p>
          <p style={{ fontFamily: T.body, fontSize: '14px', color: T.textSecondary, lineHeight: 1.6 }}>
            {result.post_advice}
          </p>
        </div>
      </div>

      {/* 8 ── Reset */}
      <div className={sec(7)} style={{ textAlign: 'center' }}>
        <button
          onClick={onReset}
          onMouseEnter={() => setResetHovered(true)}
          onMouseLeave={() => setResetHovered(false)}
          style={{
            background: 'transparent',
            border: `1px solid ${resetHovered ? T.borderHover : T.border}`,
            color: resetHovered ? T.textPrimary : T.textSecondary,
            padding: '12px 28px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: T.body,
            fontSize: '14px',
            letterSpacing: '0.02em',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          CRASH ANOTHER ONE →
        </button>
      </div>
    </div>
  );
}
