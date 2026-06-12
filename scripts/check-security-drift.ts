import { getSecurityHeaders, getSecurityHeaderDriftIssues } from '../src/utils/security';

function main(): void {
  // getSecurityHeaders() branches on NODE_ENV: development allows 'unsafe-eval'
  // for HMR, everything else must get the strict production policy. Force the
  // production branch so this check validates what deployed environments serve.
  // (The Vercel->Cloudflare migration shipped the development policy to
  // production; the old check missed it because it only looked at directives
  // that are identical in both branches.)
  (process.env as Record<string, string | undefined>).NODE_ENV = 'production';

  const headers = getSecurityHeaders();
  const issues = getSecurityHeaderDriftIssues(headers, { expectProductionPolicy: true });

  if (issues.length === 0) {
    console.log(
      'Security drift check passed: required headers and production CSP directives are present.'
    );
    return;
  }

  console.error('Security drift detected. Required baseline is missing:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  console.error('Fix `src/utils/security.ts` or update drift requirements intentionally.');
  process.exitCode = 1;
}

main();
