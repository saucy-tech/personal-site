# Content Guardrails Runbook

## Purpose
Keep publishing quality high with automated checks while minimizing manual review burden.

## Commands
- `pnpm content:validate`
- `pnpm content:check-links`
- `pnpm content:check-images`

## Expected Behavior
- `content:validate`
  - Errors: invalid baseline quality conditions that should block CI.
  - Warnings: advisory improvements for title/excerpt/tag quality.
- `content:check-links`
  - Errors: broken internal blog links or missing local assets.
  - Warnings: stale potential-orphan posts and relative link usage.
- `content:check-images`
  - Errors: missing alt text or missing referenced local image.
  - Warnings: large image files that should be compressed.

## Troubleshooting

### Broken blog links
- Locate the reported source post and target slug.
- Fix the target path or create the missing destination post.

### Missing image assets
- Confirm file exists in `public/` and path uses leading `/images/...` or `/icons/...`.
- Rename links in post content if file name changed.

### Large image warnings
- Compress images (lossless first, then quality tuning).
- Keep source dimensions appropriate for display width.

### Orphan warnings
- Add contextual cross-links from related posts when useful.
- Ignore temporarily for newly published content younger than stale threshold.

## Release Gate
Run all three commands before opening a PR that modifies MDX content or blog assets.
