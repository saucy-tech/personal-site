import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  collectPostFiles,
  evaluatePostContentQuality,
  formatAuditReport,
  toExitCode,
} from '@/utils/content-quality';

describe('evaluatePostContentQuality', () => {
  it('returns no issues for well-formed quality inputs', () => {
    const result = evaluatePostContentQuality({
      title: 'When Faith Feels Small but Still Moves You Forward',
      excerpt:
        'A practical reflection on trusting God in small steps, staying present in uncertainty, and choosing obedience before outcomes are visible.',
      tags: ['Faith', 'Trust', 'Obedience'],
    });

    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns on title and excerpt bounds violations', () => {
    const result = evaluatePostContentQuality({
      title: 'Too short',
      excerpt: 'Short excerpt.',
      tags: ['Faith'],
    });

    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('title length'),
        expect.stringContaining('excerpt length'),
      ])
    );
  });

  it('warns for missing tags and duplicate tags', () => {
    const noTags = evaluatePostContentQuality({
      title: 'A Valid Title Length for Post Metadata Checks',
      excerpt:
        'This excerpt is long enough to pass strict metadata quality checks while keeping the validator deterministic and easy to maintain.',
      tags: [],
    });
    expect(noTags.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('missing tags')])
    );

    const duplicateTags = evaluatePostContentQuality({
      title: 'Another Valid Metadata Title for Content Quality Validation',
      excerpt:
        'This excerpt also meets expected quality length while allowing duplicate tag detection to surface maintainability issues in content metadata.',
      tags: ['Faith', 'faith', 'Trust'],
    });
    expect(duplicateTags.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('duplicate tags')])
    );
  });
});

describe('collectPostFiles', () => {
  it('returns md and mdx posts sorted by file name', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-quality-'));
    const postsDir = path.join(tempDir, 'src', 'posts');
    fs.mkdirSync(postsDir, { recursive: true });
    fs.writeFileSync(path.join(postsDir, 'b-post.mdx'), '---\n---');
    fs.writeFileSync(path.join(postsDir, 'a-post.md'), '---\n---');
    fs.writeFileSync(path.join(postsDir, 'ignore.txt'), 'ignore');

    const files = collectPostFiles(tempDir);

    expect(files).toEqual(['a-post.md', 'b-post.mdx']);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});

describe('audit report helpers', () => {
  it('formats report output including warning and error sections', () => {
    const report = formatAuditReport({
      checkedCount: 2,
      checkedLabel: 'posts',
      findings: [
        { level: 'warning', source: 'a-post', message: 'warning message' },
        { level: 'error', source: 'b-post', message: 'error message' },
      ],
      headers: {
        intro: 'Checked 2 posts.',
        warning: 'Warnings',
        error: 'Errors',
        pass: 'Passed',
        fail: 'Failed',
      },
    });

    expect(report.introLine).toBe('Checked 2 posts.');
    expect(report.warningLines).toEqual(['', 'Warnings (1):', '- [a-post] warning message']);
    expect(report.errorLines).toEqual(['', 'Errors (1):', '- [b-post] error message']);
    expect(report.finalLine).toBe('Failed');
  });

  it('returns success output and exit code when only warnings are present', () => {
    const report = formatAuditReport({
      checkedCount: 1,
      checkedLabel: 'posts',
      findings: [{ level: 'warning', source: 'only-post', message: 'warning only' }],
      headers: {
        intro: 'Checked 1 post.',
        warning: 'Warnings',
        error: 'Errors',
        pass: 'Passed',
        fail: 'Failed',
      },
    });

    expect(report.finalLine).toBe('Passed');
    expect(toExitCode(report.findings)).toBe(0);
  });
});
