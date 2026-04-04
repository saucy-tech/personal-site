# Personal Portfolio & Blog

A modern, accessible portfolio and blog built with Next.js, React, and MDX. This site showcases my projects, technical talks, and blog posts, with a focus on technology, user experience, and performance.

This repo uses pnpm pinned via Corepack (see package.json "packageManager").

## Features

- ⚡ Built with Next.js 14+ (App Router), React, and Tailwind CSS
- 📝 Custom blog with MDX support and syntax highlighting
- 💻 Projects page with detailed tech stack and features
- 🎤 Talks & sermons archive
- ⚡ Lightning Network integration for tips and donations
- 🌗 Responsive design with dark mode support
- 🎨 Subtle UI animations and clean, modern design
- ♿ Accessibility and performance best practices
- 🔒 All content managed locally with Git
- 📱 Mobile-first, responsive layout
- 📡 RSS feed and sitemap generation

## Project Structure

```
personal-site/
├── public/                     # Static assets
│   └── images/                 # Image assets
│       └── blog/               # Blog post images
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── blog/               # Blog post pages
│   │   ├── bitcoin/            # Bitcoin resources
│   │   ├── projects/           # Projects showcase
│   │   ├── support/            # Support/tipping page
│   │   ├── talks/              # Talks and sermons
│   │   └── ...                 # Other routes and configs
│   │
│   ├── components/            # Reusable UI components
│   ├── posts/                  # Blog post content (MDX)
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
│
├── .env.example              # Environment variables example
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Modules
- **Content**: MDX for blog posts
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Payments**: Lightning Network integration
- **Deployment**: Vercel
- **Linting**: ESLint + Prettier

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saucy-tech/personal-site.git
   cd personal-site
   ```

2. **Install dependencies:**

   ```bash
   corepack enable
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

## Development

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required for Lightning Network functionality
NOSTR_WALLET_CONNECT_URL=your_nwc_url_here

# Optional LNURL-p configuration
LNURL_MIN_SENDABLE=1000
LNURL_MAX_SENDABLE=1000000000
LNURL_COMMENT_ALLOWED=280
LNURL_METADATA_TEXT="Tip to brandon"
LNURL_METADATA_DESC="Lightning tip jar for brandon"

# Next.js App URL (for OpenGraph)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# ConvertKit API configuration for email subscriptions (optional)
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# ConvertKit v4 API — optional manual fallback for `pnpm broadcast`
CK_SECRET_KEY=        # Settings → Advanced → API Secret
CK_PUBLISHER_ID=      # numeric account ID from Settings → Advanced
```

### GitHub Actions Secrets

The devotion broadcast workflow is the primary production path. Configure these in **GitHub → Settings → Secrets and variables → Actions**:

| Name | Type | Required by | Description |
|------|------|-------------|-------------|
| `KIT_API_KEY` | Secret | `devotion-broadcast.yml` | ConvertKit API key for the merge-based broadcast workflow |
| `NEXT_PUBLIC_APP_URL` | Variable | `devotion-broadcast.yml` | Your production site URL |

`pnpm broadcast` is retained as a manual fallback. It creates a draft broadcast from the latest post by frontmatter date and should not be treated as the primary publishing path.

### Component Architecture

The app uses a consistent vertical spacing system:

- Main sections are spaced using Tailwind's `space-y-section` utility
- Each section maintains its own internal spacing
- Link cards within sections use consistent padding and margins
- The profile section sits at the top with proper spacing to content below
- Social bar and sections maintain visual hierarchy through spacing

### Development Tips

1. **Content Updates**: Most content is defined in `src/app/page.tsx` as JavaScript objects
2. **Adding Links**: Add new `<LinkCard>` components within appropriate `<Section>` components
3. **Profile Changes**: Update the `profileData` object with your information
4. **Styling**: Use Tailwind CSS classes for styling - avoid custom CSS where possible
5. **Images**: Place images in the `public` directory and reference them in components
6. **Spacing**: Use the built-in spacing utilities for consistent layout

## Deployment

The easiest way to deploy your app is to use the [Vercel Platform](https://vercel.com/new).

Ensure all environment variables are configured in your deployment platform.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by modern link aggregation services
- Galaxy animation adapted from various open source implementations
- Built with the Next.js framework
- Lightning Network integration via Alby SDK

## CSP on Vercel: Production-compatible configuration

This project uses a Content Security Policy (CSP) applied via middleware to work consistently in both local development and Vercel production/preview deployments.

Key files:

- [src/middleware.ts](src/middleware.ts)
- [src/utils/security.ts](src/utils/security.ts)
- [next.config.js](next.config.js)

What was fixed:

- Environment-aware CSP: production on Vercel vs local development are handled explicitly in [src/utils/security.ts](src/utils/security.ts).
- Canvas-safe directives: allows 2D canvas animations and blobs for the animated galaxy background.
- Worker allowances: permits blob/data workers sometimes needed for canvas ops.
- Removed unsafe-eval in production, retained only where needed in development.
- Removed X-Powered-By in Next.js config to avoid leaking server info via [next.config.js](next.config.js).

Effective CSP highlights (production):

- default-src 'self'
- script-src 'self' 'unsafe-inline' blob: (no 'unsafe-eval' in production)
- style-src 'self' 'unsafe-inline' data:
- img-src 'self' data: blob: https: (required for canvas pixel operations and assets)
- media-src 'self' data: blob:
- worker-src 'self' blob: data:
- child-src 'self' blob: data:
- connect-src 'self' https://api.coingecko.com https: wss:
- font-src 'self' data: https:
- object-src 'none', frame-src 'none', frame-ancestors 'none'
- base-uri 'self', form-action 'self'
- upgrade-insecure-requests (production only)

Why middleware (not meta tags):

- Vercel's edge/runtime headers are stricter than local; setting CSP at the edge ensures consistent behavior across environments.
- Middleware allows environment-aware CSP that differs between dev and production.

Verification steps:

1. Local: verify headers
   - curl -I http://localhost:3000
   - Confirm presence of:
     - content-security-policy header
     - img-src includes data:, blob:, https:
     - worker-src and child-src include blob: data:
     - In development only: script-src includes 'unsafe-eval'
2. Vercel preview/prod:
   - Deploy to Vercel (preview)
   - Open devtools Network tab on first load (not client-side navigated page)
   - Check Response Headers on the document:
     - content-security-policy is present (no duplicates)
     - script-src has no 'unsafe-eval' in prod
     - img-src has data: blob: https:
     - worker-src/child-src allow blob: data:
   - Confirm the animated galaxy background renders immediately on first load and interactive UI works.

Operational notes:

- Do not add another CSP header via next.config.js; CSP is centralized in [src/middleware.ts](src/middleware.ts) using [src/utils/security.ts](src/utils/security.ts).
- Avoid adding meta http-equiv="Content-Security-Policy" tags; headers beat meta and Vercel may enforce more strictly.
- If adding new external APIs or CDNs, extend connect-src, font-src, img-src, etc., explicitly in [src/utils/security.ts](src/utils/security.ts).
- If adding WebAssembly or specialized workers, ensure script-src and worker-src account for those needs without broadening to unsafe directives in production.

Troubleshooting:

- If the galaxy canvas is blank only on first navigation in Vercel:
  - Ensure the page load (not client-routed) response has the CSP header with the directives above.
  - Check that no second CSP header is present (duplicates can override each other). Keep CSP only in middleware.
- If fonts or images fail in Vercel but work locally, verify the corresponding src directives (font-src/img-src) include https: and data:/blob: as applicable.
- If you see blocked scripts in production, verify that no 'unsafe-eval' is required.

Security posture:

- Production avoids 'unsafe-eval' (removed).
- Uses 'unsafe-inline' for scripts/styles (required for Next.js compatibility).
- No frames or objects allowed.
- Permissions-Policy is set with conservative defaults in middleware.

Change log (CSP):

- Centralized and hardened CSP in [src/utils/security.ts](src/utils/security.ts)
- Ensured environment-aware behavior for Vercel deployments
- Set poweredByHeader: false in [next.config.js](next.config.js) to remove X-Powered-By
