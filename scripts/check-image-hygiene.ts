import {
  emitAuditReport,
  formatAuditReport,
  runImageHygieneAudit,
  toExitCode,
} from '../src/utils/content-quality';

const WARNING_THRESHOLD_BYTES = 1_000_000;
const ERROR_THRESHOLD_BYTES = 4_000_000;

function run(): number {
  const { postFiles, findings } = runImageHygieneAudit({
    warningThresholdBytes: WARNING_THRESHOLD_BYTES,
    errorThresholdBytes: ERROR_THRESHOLD_BYTES,
  });
  const report = formatAuditReport({
    checkedCount: postFiles.length,
    checkedLabel: 'post files',
    findings,
    headers: {
      intro: `Checked image hygiene for ${postFiles.length} post files.`,
      warning: 'Image hygiene warnings',
      error: 'Image hygiene errors',
      pass: 'Image hygiene check passed.',
      fail: 'Image hygiene check failed.',
    },
  });
  emitAuditReport(report);
  return toExitCode(findings);
}

process.exit(run());
