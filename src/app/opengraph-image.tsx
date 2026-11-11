import { ImageResponse } from 'next/og';

import { DEFAULT_OG_IMAGE } from '@/utils/open-graph';

// Site-wide share card: used by the homepage and by every page that does not
// ship its own card. Prerendered at build time (no request-time APIs), which
// is what lets scripts/cf-slim-og.mjs strip the @vercel/og runtime payloads.
export const alt = DEFAULT_OG_IMAGE.alt;
export const size = { width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height };
export const contentType = DEFAULT_OG_IMAGE.type;

const accent = '#F7931A';
const softAccent = 'rgba(247, 147, 26, 0.16)';
const border = 'rgba(247, 147, 26, 0.34)';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(145deg, #080D0B 0%, #0A1511 52%, #10231B 100%)',
        color: '#FFFFFF',
        padding: '64px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-210px',
          right: '-100px',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,147,26,0.2) 0%, transparent 68%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '10px',
          height: '100%',
          background: accent,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: softAccent,
            border: `1px solid ${border}`,
            borderRadius: '999px',
            padding: '10px 22px',
            color: accent,
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Software engineer
        </div>
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.78)',
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          saucy.tech
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div
          style={{
            display: 'flex',
            fontSize: '104px',
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
          }}
        >
          Brandon Sauceda
        </div>
        <div
          style={{
            display: 'flex',
            color: accent,
            fontSize: '34px',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          Independent software engineer building his own products
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '999px', background: accent }} />
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.64)',
            fontSize: '22px',
            fontWeight: 500,
          }}
        >
          The Morning Portion · Train Every Day · The Home Hive · Health Dashboard
        </div>
      </div>
    </div>,
    { ...size }
  );
}
