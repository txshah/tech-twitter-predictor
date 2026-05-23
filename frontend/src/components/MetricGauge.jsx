export default function MetricGauge({ label, value, color }) {
  const pct = Math.min(100, Math.max(0, value));
  const gradient = `conic-gradient(from -90deg, ${color} ${pct * 3.6}deg, #1e2130 0deg)`;

  return (
    <div className="gauge-wrapper">
      <div className="gauge-circle" style={{ background: gradient }}>
        <div className="gauge-inner">
          <span className="gauge-value" style={{ color }}>{pct}</span>
        </div>
      </div>
      <span className="gauge-label">{label}</span>
    </div>
  );
}
