const COLORS = ['#ff2d55', '#7c4dff', '#00bcd4', '#ff9800', '#00e676', '#e91e63'];

export default function MemeTag({ label, index = 0 }) {
  const color = COLORS[index % COLORS.length];

  return (
    <span style={{
      display: 'inline-block',
      background: `${color}18`,
      border: `1px solid ${color}55`,
      color: color,
      borderRadius: '4px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
}
