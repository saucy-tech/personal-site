import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function relative(root: string, filePath: string): string {
  return toPosix(path.relative(root, filePath));
}

function main(): number {
  const root = process.cwd();
  const appDir = path.join(root, 'src', 'app');
  const componentsDir = path.join(root, 'src', 'components');
  const utilsDir = path.join(root, 'src', 'utils');
  const outputPath = path.join(root, 'docs', 'architecture-map.md');
  const now = new Date().toISOString();

  const appFiles = walk(appDir);
  const pageRoutes = appFiles
    .filter((file) => file.endsWith('/page.tsx'))
    .map((file) => relative(root, file))
    .sort();
  const apiRoutes = appFiles
    .filter((file) => file.endsWith('/route.ts') && file.includes(`${path.sep}api${path.sep}`))
    .map((file) => relative(root, file))
    .sort();

  const componentFiles = walk(componentsDir)
    .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
    .map((file) => relative(root, file))
    .sort();
  const utilityFiles = walk(utilsDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => relative(root, file))
    .sort();

  const lines: string[] = [];
  lines.push('# Architecture Map');
  lines.push('');
  lines.push(`Generated: ${now}`);
  lines.push('');
  lines.push('## App Routes');
  lines.push('');
  for (const route of pageRoutes) {
    lines.push(`- \`${route}\``);
  }
  lines.push('');
  lines.push('## API Routes');
  lines.push('');
  for (const route of apiRoutes) {
    lines.push(`- \`${route}\``);
  }
  lines.push('');
  lines.push('## Components');
  lines.push('');
  lines.push(`Total: ${componentFiles.length}`);
  lines.push('');
  for (const component of componentFiles) {
    lines.push(`- \`${component}\``);
  }
  lines.push('');
  lines.push('## Utilities');
  lines.push('');
  lines.push(`Total: ${utilityFiles.length}`);
  lines.push('');
  for (const util of utilityFiles) {
    lines.push(`- \`${util}\``);
  }
  lines.push('');
  lines.push('## Regeneration');
  lines.push('');
  lines.push('- Run `pnpm docs:architecture` whenever app routes/util boundaries change.');

  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf-8');
  console.log(`Wrote architecture map to ${relative(root, outputPath)}.`);
  return 0;
}

process.exit(main());
