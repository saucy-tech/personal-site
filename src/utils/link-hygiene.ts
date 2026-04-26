export interface LinkCheckIssue {
  level: 'error' | 'warning';
  message: string;
}

export interface ParsedMarkdownLink {
  target: string;
}

const MARKDOWN_LINK_REGEX = /!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export function extractMarkdownLinkTargets(content: string): ParsedMarkdownLink[] {
  const matches: ParsedMarkdownLink[] = [];
  let match: RegExpExecArray | null;

  while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
    const target = match[1];
    if (!target) {
      continue;
    }
    matches.push({ target });
  }

  return matches;
}

export function normalizeLinkTarget(target: string): string {
  return target.split('#')[0]?.split('?')[0] ?? target;
}

export function isExternalOrAnchorLink(target: string): boolean {
  return (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('tel:') ||
    target.startsWith('#')
  );
}

export function validateRelativeLinkUsage(target: string): LinkCheckIssue | null {
  if (target.startsWith('./') || target.startsWith('../')) {
    return {
      level: 'warning',
      message: `relative link "${target}" is harder to maintain; prefer absolute site links`,
    };
  }
  return null;
}
