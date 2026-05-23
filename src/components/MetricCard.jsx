import { useState } from 'react';
import { T } from '../lib/theme.js';

export default function MetricCard({ label, sublabel, score, displayValue, color, sysLabel }) {
  const [hovered, setHovered] = useState(false);
  const barColor = color || T.accent;
  const shown = displayValue !== undefined ? displayValue : score;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.bg2,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: T.body,
            color: T.textMuted,
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 500,
          }}>
            {label}
          </div>
          {sublabel && (
            <div style={{
              fontFamily: T.body,
              color: T.textMuted,
              fontSize: '9px',
              marginTop: '3px',
              opacity: 0.7,
            }}>
              {sublabel}
            </div>
          )}
        </div>
        {sysLabel && (
          <span style={{
            fontFamily: T.mono,
            fontSize: '9px',
            color: T.textMuted,
            opacity: 0.6,
            flexShrink: 0,
            marginLeft: '4px',
          }}>
            {sysLabel}
          </span>
        )}
      </div>

      <div style={{
        fontFamily: T.mono,
        fontSize: '36px',
        fontWeight: 700,
        color: barColor,
        lineHeight: 1,
      }}>
        {shown}
      </div>

      <div style={{ height: '3px', background: T.bg3, borderRadius: '2px', overflow: 'hidden' }}>
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
