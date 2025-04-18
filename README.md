# Personal Portfolio Site

A modern, accessible portfolio site built with Next.js and React. This site showcases my projects, technical talks, and blog posts, with a focus on technology, user experience, and performance.

## Features

- ⚡ Built with Next.js (App Router), React, and Tailwind CSS
- 📝 Custom blog with MDX support
- 💻 Projects page with detailed tech stack and features
- 🎤 Talks & sermons archive
- 🌗 Responsive design with dark mode
- 🎨 Subtle UI animations and clean, modern design
- ♿ Accessibility and performance best practices
- 🔒 All content managed locally (no external CMS or templates)

## Live Site

[https://github.com/saucy-tech/personal-site](https://github.com/saucy-tech/personal-site)

## Project Structure

```
personal-site/
├── public/               # Static assets (images, etc.)
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reusable UI components
│   └── styles/           # Global styles and Tailwind config
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── next.config.js        # Next.js configuration
└── README.md             # Project documentation
```

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saucy-tech/personal-site.git
   cd personal-site
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE)

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
