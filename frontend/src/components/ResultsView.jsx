import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import MetricGauge from './MetricGauge.jsx';

const SENTIMENT_COLORS = {
  bullish: '#22c55e',
  bearish: '#ef4444',
  meme: '#f59e0b',
  neutral: '#6b7280',
};

const METRICS = [
  { key: 'stockBuyIntent', label: 'Stock Buy Intent', color: '#22c55e' },
  { key: 'memePotential', label: 'Meme Potential', color: '#f59e0b' },
  { key: 'cloutGain', label: 'Clout Gain', color: '#a78bfa' },
  { key: 'fudFactor', label: 'FUD Factor', color: '#ef4444' },
  { key: 'twitterSentiment', label: 'Twitter Vibe', color: '#38bdf8' },
  { key: 'redditSentiment', label: 'Reddit Vibe', color: '#fb923c' },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.82rem' }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{d.name}</div>
      <div style={{ color: SENTIMENT_COLORS[d.sentiment] }}>
        {d.sentiment} · {d.score}/100
      </div>
    </div>
  );
}

export default function ResultsView({ result, onReset }) {
  return (
    <div>
      <div className="results-header">
        <h2 className="results-title">Prediction Results</h2>
        <button className="reset-btn" onClick={onReset}>← Try another tweet</button>
      </div>

      {/* Tweet */}
      <div className="card tweet-card" style={{ marginBottom: '1rem' }}>
        <p className="tweet-card-label">Analyzed Tweet</p>
        <p className="tweet-card-text">"{result.tweetText}"</p>
      </div>

      {/* Verdict */}
      <div className="card verdict-card" style={{ marginBottom: '1.5rem' }}>
        <p className="verdict-label">Verdict</p>
        <p className="verdict-text">{result.verdict}</p>
      </div>

      {/* Metric gauges */}
      <div className="metrics-section">
        <p className="section-title">Prediction Metrics</p>
        <div className="metrics-grid">
          {METRICS.map(({ key, label, color }) => (
            <MetricGauge key={key} label={label} value={result[key] ?? 0} color={color} />
          ))}
        </div>
      </div>

      {/* Subreddit chart */}
      <div className="chart-section card" style={{ marginBottom: '1rem' }}>
        <p className="section-title">Subreddit Activity</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={result.subreddits}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {result.subreddits.map((entry, i) => (
                  <Cell key={i} fill={SENTIMENT_COLORS[entry.sentiment] ?? '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top memes */}
      <div className="memes-section">
        <p className="section-title">Top Meme Formats Predicted</p>
        <ol className="meme-list">
          {result.topMemes.map((meme, i) => (
            <li key={i} className="meme-item">
              <span className="meme-badge">{i + 1}</span>
              {meme}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
