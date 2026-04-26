export interface MarkdownImage {
  alt: string;
  src: string;
}

type ImageSizeStatus = 'ok' | 'warn' | 'error';

export function extractMarkdownImages(content: string): MarkdownImage[] {
  const regex = /!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const images: MarkdownImage[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const alt = match[1] ?? '';
    const src = match[2] ?? '';
    if (!src) {
      continue;
    }
    images.push({ alt, src });
  }

  return images;
}

export function hasMeaningfulAltText(value: string): boolean {
  return value.trim().length > 0;
}

export function classifyImageSize(
  byteSize: number,
  warningThreshold: number,
  errorThreshold: number
): ImageSizeStatus {
  if (byteSize >= errorThreshold) {
    return 'error';
  }
  if (byteSize >= warningThreshold) {
    return 'warn';
  }
  return 'ok';
}
