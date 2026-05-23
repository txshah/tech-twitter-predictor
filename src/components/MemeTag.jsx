import { useState } from 'react';
import { T } from '../lib/theme.js';

export default function MemeTag({ label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        background: T.bg3,
        border: `1px solid ${hovered ? 'rgba(232,255,71,0.6)' : T.border}`,
        color: hovered ? T.textPrimary : T.textSecondary,
        borderRadius: '6px',
        padding: '5px 12px',
        fontSize: '11px',
        fontFamily: T.mono,
        letterSpacing: '0.02em',
        cursor: 'default',
        transition: 'border-color 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
