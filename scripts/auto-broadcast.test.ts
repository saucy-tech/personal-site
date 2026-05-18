import fs from 'fs';
import os from 'os';
import path from 'path';

import { loadLatestPost } from './auto-broadcast';

describe('auto-broadcast post selection', () => {
  let postsDir: string;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-18T16:00:00.000Z'));
    postsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-broadcast-posts-'));
  });

  afterEach(() => {
    jest.useRealTimers();
    fs.rmSync(postsDir, { recursive: true, force: true });
  });

  function writePost(slug: string, date: string) {
    fs.writeFileSync(
      path.join(postsDir, `${slug}.mdx`),
      `---\ntitle: "${slug}"\ndate: "${date}"\nexcerpt: "Excerpt"\n---\n\nBody`
    );
  }

  it('selects the latest published post and ignores future-dated posts', () => {
    writePost('2026-05-17-yesterday', '2026-05-17');
    writePost('2026-05-18-today', '2026-05-18');
    writePost('2026-05-19-tomorrow', '2026-05-19');

    expect(loadLatestPost(postsDir).slug).toBe('2026-05-18-today');
  });
});
