import {
  emitAuditReport,
  formatAuditReport,
  runContentValidationAudit,
  toExitCode,
} from '../src/utils/content-quality';

function run(): number {
  const { postFiles, findings } = runContentValidationAudit();
  const report = formatAuditReport({
    checkedCount: postFiles.length,
    checkedLabel: 'posts',
    findings,
    headers: {
      intro: `Validated ${postFiles.length} posts.`,
      warning: 'Content quality warnings',
      error: 'Content quality errors',
      pass: 'Content validation passed.',
      fail: 'Content validation failed due to quality errors.',
    },
  });
  emitAuditReport(report);
  return toExitCode(findings);
}

process.exit(run());
