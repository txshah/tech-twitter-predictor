import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';
import MetricCard from '../components/MetricCard.jsx';
import SubredditCard from '../components/SubredditCard.jsx';
import MemeTag from '../components/MemeTag.jsx';

const VERDICT_COLORS = {
  'MEGA VIRAL': '#ff2d55',
  'WILL CLAP': '#00e676',
  'MID': '#888888',
  "GETTING RATIO'D": '#ff9800',
  'CRINGE VOID': '#7c4dff',
};

function SectionHeader({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    }}>
      <span style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
      <span style={{
        color: '#555',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <span style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
    </div>
  );
}

const fadeUp = (i) => ({
  animation: 'ctto-fadeup 0.45s cubic-bezier(0.16,1,0.3,1) both',
  animationDelay: `${i * 80}ms`,
});

export default function Results({ result, onReset }) {
  if (!result) return null;

  const verdictColor = VERDICT_COLORS[result.verdict] ?? '#ff2d55';

  // clout_gain: -50..100 → normalize bar to 0..100
  const cloutBarScore = Math.round((result.clout_gain + 50) / 150 * 100);
  const cloutColor = result.clout_gain >= 0 ? '#00e676' : '#ff1744';
  const cloutDisplay = result.clout_gain >= 0 ? `+${result.clout_gain}` : String(result.clout_gain);

  const audienceData = [
    { group: 'True Believers', value: result.audience_split.true_believers },
    { group: 'Haters', value: result.audience_split.haters },
    { group: 'Boomers', value: result.audience_split.confused_boomers },
    { group: 'Press', value: result.audience_split.journalists },
    { group: 'Meme Lords', value: result.audience_split.meme_lords },
  ];

  const maxEngagement = Math.max(...result.timeline_hours.map((d) => d.engagement));

  const shouldPost = result.should_they_post;
  const bannerColor = shouldPost ? '#00e676' : '#ff1744';

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', padding: '40px 20px 72px' }}>

      {/* 1 — Verdict Banner */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '14px',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '32px',
        marginBottom: '20px',
        ...fadeUp(0),
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'inline-block',
            background: verdictColor,
            color: '#000',
            fontSize: '10px',
            fontWeight: 900,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '4px',
            marginBottom: '16px',
          }}>
            {result.verdict}
          </span>
          <h2 style={{
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontWeight: 900,
            color: '#f0f0f0',
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}>
            {result.tldr}
          </h2>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.65, maxWidth: '480px' }}>
            {result.analysis}
          </p>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            fontSize: 'clamp(72px, 9vw, 108px)',
            fontWeight: 900,
            fontFamily: '"Courier New", monospace',
            color: verdictColor,
            lineHeight: 1,
          }}>
            {result.virality_score}
          </div>
          <div style={{
            color: '#3a3a3a',
            fontSize: '10px',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginTop: '8px',
          }}>
            crash score
          </div>
        </div>
      </div>

      {/* 2 — Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '12px',
        marginBottom: '20px',
        ...fadeUp(1),
      }}>
        <MetricCard
          label="Clout Gain"
          sublabel={result.clout_gain >= 0 ? 'riding the wave' : 'taking damage'}
          score={cloutBarScore}
          displayValue={cloutDisplay}
          color={cloutColor}
        />
        <MetricCard
          label="Stock Intent"
          sublabel="people buying the dip?"
          score={result.stock_intent_score}
          color="#2196f3"
        />
        <MetricCard
          label="Meme Potential"
          sublabel="meme factory output"
          score={result.meme_potential}
          color="#7c4dff"
        />
        <MetricCard
          label="Ratio Risk"
          sublabel="ratio incoming"
          score={result.ratio_risk}
          color="#ff9800"
        />
      </div>

      {/* 3 — Chart Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '28px',
        ...fadeUp(2),
      }}>
        {/* Bar chart: timeline */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px 20px 12px',
        }}>
          <div style={{
            color: '#aaa',
            fontSize: '10px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            Engagement Timeline
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={result.timeline_hours} barSize={26} barCategoryGap="30%">
              <XAxis
                dataKey="hour"
                tick={{ fill: '#bbb', fontSize: 10, fontFamily: 'Courier New' }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="engagement" radius={[3, 3, 0, 0]}>
                {result.timeline_hours.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.engagement === maxEngagement ? '#111' : '#e5e7eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar: audience split */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px 20px 12px',
        }}>
          <div style={{
            color: '#aaa',
            fontSize: '10px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            Audience Split
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={audienceData} outerRadius="70%">
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="group"
                tick={{ fill: '#aaa', fontSize: 9, fontFamily: 'Courier New' }}
              />
              <Radar
                dataKey="value"
                stroke="#111"
                fill="#111"
                fillOpacity={0.12}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 — Subreddits */}
      <div style={{ marginBottom: '28px', ...fadeUp(3) }}>
        <SectionHeader>Which subreddits are losing their minds</SectionHeader>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px',
        }}>
          {result.subreddits.map((sub) => (
            <SubredditCard
              key={sub.name}
              name={sub.name}
              intensity={sub.intensity}
              reason={sub.reason}
            />
          ))}
        </div>
      </div>

      {/* 5 — Meme formats */}
      <div style={{ marginBottom: '28px', ...fadeUp(4) }}>
        <SectionHeader>Meme formats it will spawn</SectionHeader>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {result.meme_formats.map((fmt, i) => (
            <MemeTag key={fmt} label={fmt} index={i} />
          ))}
        </div>
      </div>

      {/* 6 — Quote blocks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '28px',
        ...fadeUp(5),
      }}>
        {/* Left — light */}
        <div style={{
          background: '#f9f9f9',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{
            color: '#bbb',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
          }}>
            Predicted first reply
          </div>
          <p style={{
            color: '#222',
            fontSize: '14px',
            lineHeight: 1.65,
            fontFamily: 'inherit',
          }}>
            {result.predicted_first_reply}
          </p>
        </div>

        {/* Right — dark */}
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{
            color: '#444',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
          }}>
            The quote tweet that ends their week
          </div>
          <p style={{
            color: '#f0f0f0',
            fontSize: '14px',
            lineHeight: 1.65,
            fontFamily: 'inherit',
          }}>
            {result.quote_tweet_killer}
          </p>
        </div>
      </div>

      {/* 7 — Should they post banner */}
      <div style={{
        background: `${bannerColor}0e`,
        border: `2px solid ${bannerColor}40`,
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '40px',
        ...fadeUp(6),
      }}>
        <span style={{ fontSize: '26px', flexShrink: 0, lineHeight: 1.2 }}>
          {shouldPost ? '✅' : '🚫'}
        </span>
        <div>
          <div style={{
            color: bannerColor,
            fontWeight: 900,
            fontSize: '15px',
            letterSpacing: '0.5px',
            marginBottom: '6px',
          }}>
            {shouldPost ? 'CTTO says: Post it.' : 'CTTO says: Put the phone down.'}
          </div>
          <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.55 }}>
            {result.post_advice}
          </p>
        </div>
      </div>

      {/* 8 — Reset */}
      <div style={{ textAlign: 'center', ...fadeUp(7) }}>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '2px solid #ff2d55',
            color: '#ff2d55',
            padding: '12px 36px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          Crash another post
        </button>
      </div>
    </div>
  );
}
