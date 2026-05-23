const EMOJI_MAP = {
  'r/tech': '💻',
  'r/wallstreetbets': '🚀',
  'r/LinkedInLunatics': '🤵',
  'r/Buttcoin': '🤣',
  'r/antiwork': '✊',
};

export default function SubredditCard({ name, intensity, reason }) {
  const emoji = EMOJI_MAP[name] ?? '🌐';
  const intensityColor = intensity >= 70 ? '#ff1744' : intensity >= 40 ? '#ff9800' : '#00e676';

  return (
    <div style={{
      background: '#161616',
      border: '1px solid #242424',
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '17px' }}>{emoji}</span>
          <span style={{ color: '#ff4500', fontWeight: 700, fontSize: '13px' }}>{name}</span>
        </div>
        <span style={{
          color: intensityColor,
          fontSize: '10px',
          fontWeight: 700,
          border: `1px solid ${intensityColor}55`,
          borderRadius: '3px',
          padding: '1px 7px',
          flexShrink: 0,
        }}>
          {intensity}
        </span>
      </div>
      <p style={{ color: '#bbb', fontSize: '13px', lineHeight: 1.5, fontStyle: 'italic' }}>
        "{reason}"
      </p>
      <div style={{ height: '3px', background: '#252525', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          width: `${intensity}%`,
          height: '100%',
          background: intensityColor,
          borderRadius: '2px',
        }} />
      </div>
    </div>
  );
}
