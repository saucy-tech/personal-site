import { ImageResponse } from 'next/og';

import { formatPostDate } from '@/utils/helpers';
import { getAllPostsMeta, getPostBySlug } from '@/utils/posts';

export const alt = 'Blog post preview image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamicParams = false;

function getAccentPalette(category: string) {
  switch (category) {
    case 'daily-word':
      return {
        accent: '#f7931a',
        softAccent: 'rgba(212, 175, 55, 0.16)',
        border: 'rgba(212, 175, 55, 0.34)',
      };
    case 'biblical-reflection':
      return {
        accent: '#7DD3C7',
        softAccent: 'rgba(125, 211, 199, 0.16)',
        border: 'rgba(125, 211, 199, 0.34)',
      };
    default:
      return {
        accent: '#F59E0B',
        softAccent: 'rgba(245, 158, 11, 0.16)',
        border: 'rgba(245, 158, 11, 0.34)',
      };
  }
}

export async function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
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

  const { accent, softAccent, border } = getAccentPalette(post.category);
  const formattedDate = formatPostDate(post.date);
  const seriesOrCategory = post.series ?? post.categoryLabel;
  const titleLength = post.title.length;
  const titleFontSize = titleLength > 80 ? 44 : titleLength > 55 ? 52 : titleLength > 35 ? 60 : 68;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              {post.categoryLabel}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.68)',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              {formattedDate}
            </div>
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
              color: accent,
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {seriesOrCategory}
          </div>

          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: `${titleFontSize}px`,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
            }}
          >
            {post.title}
          </div>

          {post.excerpt && (
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.74)',
                fontSize: '24px',
                lineHeight: 1.4,
                maxWidth: '860px',
              }}
            >
              {post.excerpt}
            </div>
          )}
        </div>

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
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.48)',
              fontSize: '18px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Open Graph Preview
          </div>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
