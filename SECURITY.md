# Security Policy

## Reporting a vulnerability

Please don't open a public issue for a security problem. Report it privately instead:

- **Preferred:** [Open a private advisory](https://github.com/saucy-tech/personal-site/security/advisories/new) — the thread stays attached to this repo.
- **Email:** brandon@saucy.tech

This is a personal project, so I can't promise a response time. I read every report and will tell you what I decide to do about it.

## Scope

The code in this repository and the site it deploys at [saucy.tech](https://saucy.tech).

That includes the unauthenticated API routes under `/api` — subscriber signup, which forwards visitor email addresses to Kit, and Lightning invoice creation. Anything touching those is squarely in scope.

## Out of scope

- Dependency CVEs with no demonstrated exploit path here — Dependabot already tracks those.
- Automated scanner output submitted without a working proof of concept.
