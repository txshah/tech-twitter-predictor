import { useState } from 'react';
import { T } from '../lib/theme.js';

const EMOJI_MAP = {
  'r/tech':            '💻',
  'r/wallstreetbets':  '🚀',
  'r/LinkedInLunatics':'🤵',
  'r/Buttcoin':        '🤣',
  'r/antiwork':        '✊',
};

export default function SubredditCard({ name, intensity, reason }) {
  const [hovered, setHovered] = useState(false);
  const emoji = EMOJI_MAP[name] ?? '🌐';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.bg3,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'border-color 0.2s',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{emoji}</span>
          <span style={{ fontFamily: T.body, color: T.textPrimary, fontWeight: 600, fontSize: '13px' }}>
            {name}
          </span>
        </div>
        <span style={{ fontFamily: T.mono, color: T.textMuted, fontSize: '11px' }}>
          {intensity}
        </span>
      </div>

      <p style={{
        fontFamily: T.body,
        color: T.textSecondary,
        fontSize: '13px',
        lineHeight: 1.55,
        fontStyle: 'italic',
      }}>
        "{reason}"
      </p>

      <div style={{ height: '2px', background: T.bg, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${intensity}%`, height: '100%', background: T.accent, borderRadius: '2px' }} />
      </div>
    </div>
  );
}
