import {
  emitAuditReport,
  formatAuditReport,
  runInternalLinksAudit,
  toExitCode,
} from '../src/utils/content-quality';

const ORPHAN_WARN_AFTER_DAYS = 45;

function checkInternalLinks(): number {
  const { postFiles, findings } = runInternalLinksAudit({
    orphanWarnAfterDays: ORPHAN_WARN_AFTER_DAYS,
  });
  const report = formatAuditReport({
    checkedCount: postFiles.length,
    checkedLabel: 'posts',
    findings,
    headers: {
      intro: `Checked ${postFiles.length} posts for internal-link hygiene.`,
      warning: 'Internal-link warnings',
      error: 'Internal-link errors',
      pass: 'Internal-link check passed.',
      fail: 'Internal-link check failed.',
    },
  });
  emitAuditReport(report);
  return toExitCode(findings);
}

process.exit(checkInternalLinks());
