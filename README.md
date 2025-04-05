# Personal Linktree App

A minimalist, galaxy-inspired linktree app built with Next.js that serves as a central hub for all your online presence. Featuring a dark teal-green background with animated stars, gold accents, and a clean, centered layout.

## Features

- 🌌 Beautiful galaxy-themed UI with animated starfield background
- 🏷️ Organized sections for different types of content (Latest, Projects)
- 🔗 Customizable link cards with icons and clear hierarchy
- 👤 Profile section with avatar, username, and bio
- 🔍 Social media quick links with elegant icon design
- 📱 Fully responsive design that works on all devices
- ⚡ Built with Next.js for optimal performance

## Project Purpose

This app provides a centralized hub where friends, family, and professional contacts can find links to your:

- Social media profiles
- Latest content and announcements
- Projects and portfolio work
- Articles, videos, and other media you create

## Project Structure

```
active-linktree-brandon/
├── public/               # Static assets like images
├── src/                  # Application source code
│   ├── app/             # Next.js App Router
│   │   ├── page.tsx     # Main landing page component
│   │   ├── layout.tsx   # Root layout with fonts and global styles
│   │   └── globals.css  # Global styles and Tailwind directives
│   └── components/      # Reusable UI components
│       ├── Footer.tsx           # Page footer
│       ├── GalaxyBackground.tsx # Animated background
│       ├── LinkCard.tsx         # Individual link component
│       ├── Profile.tsx          # User profile component
│       ├── Section.tsx          # Section container component
│       └── SocialBar.tsx        # Social media links bar
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration for Tailwind
├── next.config.js       # Next.js configuration
└── README.md           # Project documentation
```

## Tech Stack

- **Framework**: Next.js 14.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 11.0.3
- **Icons**: Heroicons 2.1.1
- **Deployment**: Vercel (recommended)

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/yourusername/active-linktree-brandon.git
cd active-linktree-brandon
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Component Layout

The app uses a consistent vertical spacing system:

- Main sections are spaced using Tailwind's `space-y-section` utility
- Each section maintains its own internal spacing
- Link cards within sections use consistent padding and margins
- The profile section sits at the top with proper spacing to content below
- Social bar and sections maintain visual hierarchy through spacing

## Development Tips

1. **Content Updates**: Most content is defined in `src/app/page.tsx` as JavaScript objects
2. **Adding Links**: Add new `<LinkCard>` components within appropriate `<Section>` components
3. **Profile Changes**: Update the `profileData` object with your information
4. **Styling**: Use Tailwind CSS classes for styling - avoid custom CSS where possible
5. **Images**: Place images in the `public` directory and reference them in components
6. **Spacing**: Use the built-in spacing utilities for consistent layout

## Deployment

The easiest way to deploy your app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by modern link aggregation services
- Galaxy animation adapted from various open source implementations
- Built with the Next.js framework

# personal-site
