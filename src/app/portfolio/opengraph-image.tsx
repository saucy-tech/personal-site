import { ImageResponse } from 'next/og';

import { portfolioAbout } from '@/data/portfolio-about';

export const alt = 'Brandon Sauceda — Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const accent = '#F59E0B';
const softAccent = 'rgba(245, 158, 11, 0.16)';
const border = 'rgba(245, 158, 11, 0.34)';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #041714 0%, #07251F 40%, #0C332B 100%)',
        padding: '56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-180px',
          right: '-120px',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${softAccent} 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-220px',
          left: '-120px',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 72%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: `1px solid ${border}`,
          borderRadius: '34px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          padding: '44px',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.28)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: softAccent,
              border: `1px solid ${border}`,
              borderRadius: '999px',
              padding: '10px 20px',
              color: accent,
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.78)',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            saucy.tech
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '920px' }}>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: '76px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            {portfolioAbout.headline}
          </div>
          <div
            style={{
              display: 'flex',
              color: accent,
              fontSize: '28px',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            {portfolioAbout.title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '999px',
              background: accent,
            }}
          />
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.64)',
              fontSize: '20px',
              fontWeight: 500,
            }}
          >
            Love Jesus. Explore Ideas. Create Things.
          </div>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
