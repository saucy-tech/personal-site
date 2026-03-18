import Image from 'next/image';

import styles from './BlogImage.module.css';

type Props = {
  src: string;
  alt: string;
  caption?: string;
  float?: 'left' | 'right' | 'none';
  aspect?: 'portrait' | 'landscape';
  maxWidth?: number;
};

export default function BlogImage({
  src,
  alt,
  caption,
  float = 'none',
  aspect = 'landscape',
  maxWidth = aspect === 'portrait' ? 340 : 640,
}: Props) {
  return (
    <figure className={`${styles.figure} ${styles[aspect]} ${styles[float]}`} style={{ maxWidth }}>
      <Image
        src={src}
        alt={alt}
        width={maxWidth}
        height={aspect === 'portrait' ? Math.round(maxWidth * 1.33) : Math.round(maxWidth * 0.6)}
        style={{ width: '100%', height: 'auto', borderRadius: 14 }}
        sizes="(max-width: 700px) 90vw, 640px"
        priority
      />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
