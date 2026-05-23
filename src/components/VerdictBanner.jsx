export default function VerdictBanner({ verdict, overallScore }) {
  if (!verdict) return null;

  return (
    <div style={{
      background: `${verdict.color}12`,
      border: `2px solid ${verdict.color}`,
      borderRadius: '14px',
      padding: '28px 24px',
      textAlign: 'center',
      marginBottom: '36px',
    }}>
      <div style={{ fontSize: '44px', marginBottom: '10px' }}>{verdict.emoji}</div>
      <div style={{
        fontSize: 'clamp(20px, 4vw, 30px)',
        fontWeight: 900,
        color: verdict.color,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        marginBottom: '10px',
      }}>
        {verdict.label}
      </div>
      <div style={{
        fontSize: 'clamp(48px, 8vw, 72px)',
        fontWeight: 900,
        color: verdict.color,
        lineHeight: 1,
        marginBottom: '12px',
      }}>
        {overallScore}
        <span style={{ fontSize: '22px', color: '#444', fontWeight: 400 }}>/100</span>
      </div>
      <p style={{ color: '#888', fontSize: '14px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
        {verdict.description}
      </p>
    </div>
  );
}
