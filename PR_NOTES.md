## Security Issues Addressed

- `picomatch` ReDoS via extglob quantifiers (`GHSA-c2c7-rcm5-vvqj`, `CVE-2026-33671`)
- `picomatch` method injection in POSIX character classes (`GHSA-3v7f-55p6-f55p`, `CVE-2026-33672`)
- `yaml` stack overflow via deeply nested YAML collections (`GHSA-48c2-rrv3-qjmp`, `CVE-2026-33532`)
- `brace-expansion` zero-step sequence hang and memory exhaustion (`GHSA-f886-m6hf-6m8v`, `CVE-2026-33750`)

## Resolution Summary

- Added targeted `pnpm.overrides` in `package.json` to force patched transitive versions.
- Regenerated the dependency graph with a forced reinstall so the lockfile and installed tree match the patched graph.
- Verified the final dependency tree resolves to patched `picomatch`, `yaml`, and `brace-expansion` versions.

## Verification

- `pnpm audit --prod`
- `pnpm audit --json`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
