export default function MetricCard({ label, sublabel, score, displayValue, color }) {
  const level = score >= 75 ? 'HIGH' : score >= 45 ? 'MED' : 'LOW';
  const levelColor = score >= 75 ? '#ff1744' : score >= 45 ? '#ff9800' : '#00e676';
  const barColor = color || '#ff2d55';
  const shown = displayValue !== undefined ? displayValue : score;

  return (
    <div style={{
      background: '#161616',
      border: '1px solid #242424',
      borderRadius: '10px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ color: '#3a3a3a', fontSize: '9px', marginTop: '2px', letterSpacing: '0.3px' }}>
              {sublabel}
            </div>
          )}
        </div>
        <span style={{
          color: levelColor,
          fontSize: '9px',
          fontWeight: 700,
          border: `1px solid ${levelColor}`,
          borderRadius: '3px',
          padding: '1px 5px',
          letterSpacing: '0.5px',
          flexShrink: 0,
          marginLeft: '6px',
        }}>
          {level}
        </span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 900, color: barColor, lineHeight: 1 }}>
        {shown}
      </div>
      <div style={{ height: '3px', background: '#252525', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min(100, Math.max(0, score))}%`,
          height: '100%',
          background: barColor,
          borderRadius: '2px',
        }} />
      </div>
    </div>
  );
}
