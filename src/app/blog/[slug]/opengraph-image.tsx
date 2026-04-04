import { ImageResponse } from 'next/og';

import { formatPostDate } from '@/utils/helpers';
import { getPostBySlug, getPostSlugs } from '@/utils/posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#fff',
          fontSize: '32px',
        }}
      >
        saucy.tech
      </div>,
      { ...size }
    );
  }

  const isDailyWord = post.category === 'daily-word';
  const isBiblicalReflection = post.category === 'biblical-reflection';

  const accentColor = isDailyWord ? '#d4af37' : isBiblicalReflection ? '#60a5fa' : '#a78bfa';
  const accentBg = isDailyWord
    ? 'rgba(212,175,55,0.15)'
    : isBiblicalReflection
      ? 'rgba(96,165,250,0.15)'
      : 'rgba(167,139,250,0.15)';
  const accentBorder = isDailyWord
    ? 'rgba(212,175,55,0.4)'
    : isBiblicalReflection
      ? 'rgba(96,165,250,0.4)'
      : 'rgba(167,139,250,0.4)';

  const formattedDate = formatPostDate(post.date);
  const titleLength = post.title.length;
  const titleFontSize = titleLength > 80 ? 44 : titleLength > 55 ? 52 : titleLength > 35 ? 60 : 68;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #1e293b 100%)',
        padding: '64px 72px',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative radial glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-160px',
          right: '-160px',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 65%)`,
        }}
      />
      {/* Subtle bottom-left glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-200px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Category + series badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: accentBg,
            border: `1px solid ${accentBorder}`,
            borderRadius: '100px',
            padding: '8px 20px',
            color: accentColor,
            fontSize: '15px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {post.categoryLabel}
        </div>
        {post.series && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px',
              padding: '8px 20px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '15px',
            }}
          >
            {post.series}
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.22,
            maxWidth: '960px',
            letterSpacing: '-0.01em',
          }}
        >
          {post.title}
        </div>

        {/* Date */}
        <div
          style={{
            marginTop: '28px',
            fontSize: '22px',
            color: 'rgba(255,255,255,0.42)',
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          {formattedDate}
        </div>
      </div>

      {/* Bottom bar: "The Daily Word" label (if applicable) + site domain */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '48px',
        }}
      >
        {isDailyWord ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Small accent line */}
            <div
              style={{
                width: '4px',
                height: '28px',
                background: accentColor,
                borderRadius: '2px',
              }}
            />
            <div
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: accentColor,
                letterSpacing: '0.04em',
              }}
            >
              The Daily Word
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex' }} />
        )}

        <div
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.03em',
          }}
        >
          saucy.tech
        </div>
      </div>
    </div>,
    { ...size }
  );
}
