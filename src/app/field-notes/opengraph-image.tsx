import { ImageResponse } from 'next/og';

export const alt =
  'Field notes diagram: devices connect through T3 Code to Claude Code, Codex, and OpenCode, then to remote machines and an RTX 3090';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const accent = '#F7931A';
const panel = 'rgba(255, 255, 255, 0.055)';
const border = 'rgba(247, 147, 26, 0.34)';

function Node({
  children,
  emphasis = false,
  width,
}: {
  children: React.ReactNode;
  emphasis?: boolean;
  width: number;
}) {
  return (
    <div
      style={{
        width: `${width}px`,
        minHeight: '62px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 20px',
        borderRadius: '16px',
        border: `1px solid ${emphasis ? accent : border}`,
        background: emphasis ? 'rgba(247, 147, 26, 0.16)' : panel,
        color: emphasis ? '#FFFFFF' : 'rgba(255, 255, 255, 0.86)',
        fontSize: emphasis ? '24px' : '20px',
        fontWeight: emphasis ? 750 : 650,
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: accent,
        fontSize: '32px',
        padding: '0 12px',
      }}
    >
      →
    </div>
  );
}

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #080D0B 0%, #0A1511 52%, #10231B 100%)',
        color: '#FFFFFF',
        padding: '48px 54px',
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
          background: 'radial-gradient(circle, rgba(247,147,26,0.18) 0%, transparent 68%)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            color: accent,
            fontSize: '17px',
            fontWeight: 750,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Field notes
        </div>
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '21px',
            fontWeight: 700,
          }}
        >
          saucy.tech
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '26px' }}>
        <div
          style={{
            display: 'flex',
            fontSize: '52px',
            fontWeight: 800,
            letterSpacing: '-0.035em',
          }}
        >
          My AI coding stack
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '8px',
            color: 'rgba(255,255,255,0.62)',
            fontSize: '21px',
          }}
        >
          The interfaces, harnesses, and hardware I use to get work done.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '42px',
          padding: '30px 28px',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          background: 'rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Node width={174}>Mac · iPad</Node>
          <Node width={174}>iPhone</Node>
        </div>
        <Arrow />
        <Node width={198} emphasis>
          T3 Code
        </Node>
        <Arrow />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Node width={206}>Claude Code</Node>
          <Node width={206}>Codex</Node>
          <Node width={206}>OpenCode</Node>
        </div>
        <Arrow />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Node width={194}>Remote machines</Node>
          <Node width={194}>RTX 3090</Node>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 'auto',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '17px',
          letterSpacing: '0.03em',
        }}
      >
        devices → interface → coding agents → infrastructure
      </div>
    </div>,
    { ...size }
  );
}
