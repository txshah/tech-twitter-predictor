export default function QuoteBlock({ text, author }) {
  return (
    <div style={{
      borderLeft: '3px solid #ff2d55',
      paddingLeft: '16px',
      marginBottom: '20px',
    }}>
      <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.6, marginBottom: '6px' }}>
        {text}
      </p>
      <span style={{ color: '#555', fontSize: '11px' }}>— {author}</span>
    </div>
  );
}
