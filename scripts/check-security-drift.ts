import { getSecurityHeaders, getSecurityHeaderDriftIssues } from '../src/utils/security';

function main(): void {
  const headers = getSecurityHeaders();
  const issues = getSecurityHeaderDriftIssues(headers);

  if (issues.length === 0) {
    console.log('Security drift check passed: required headers and CSP directives are present.');
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
