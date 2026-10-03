// Local production audit: three fresh browser contexts per route and viewport.
// Palette checks wait for transitions to settle before running axe.
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const outputDir = path.resolve(process.argv[2] || '/tmp/personal-site-audit/replay');
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3105';
const axePath = process.env.AXE_PATH || '/tmp/personal-site-audit/axe.min.js';
fs.mkdirSync(outputDir, { recursive: true });
const routes = [
  '/',
  '/portfolio',
  '/notes',
  '/blog/2026-03-04-for-god-so-loved',
  '/blog/2025-06-06-architecture-of-inaction',
];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [1280, 390])
      for (const route of routes)
        for (let run = 0; run < 3; run++) {
          const context = await browser.newContext({
            viewport: { width, height: width === 1280 ? 800 : 844 },
            deviceScaleFactor: 1,
          });
          const page = await context.newPage();
          const errors = [];
          const failures = [];
          page.on('pageerror', (e) => errors.push(e.message));
          page.on('console', (m) => {
            if (m.type() === 'error') errors.push(m.text());
          });
          page.on('response', (r) => {
            if (r.status() >= 400) failures.push({ url: r.url(), status: r.status() });
          });
          await page.addInitScript(() => {
            window.audit = { lcp: 0, cls: 0, longTasks: 0 };
            new PerformanceObserver((l) => {
              for (const e of l.getEntries()) window.audit.lcp = e.startTime;
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver((l) => {
              for (const e of l.getEntries()) if (!e.hadRecentInput) window.audit.cls += e.value;
            }).observe({ type: 'layout-shift', buffered: true });
            new PerformanceObserver((l) => {
              for (const e of l.getEntries()) window.audit.longTasks += e.duration;
            }).observe({ type: 'longtask', buffered: true });
          });
          await page.goto(origin + route, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          const metrics = await page.evaluate(() => ({
            ...window.audit,
            scrollY,
            viewport: innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            paints: performance
              .getEntriesByType('paint')
              .map((e) => ({ name: e.name, ms: e.startTime })),
            navigation: performance.getEntriesByType('navigation').map((e) => ({
              ttfb: e.responseStart,
              domContentLoaded: e.domContentLoadedEventEnd,
            })),
            resources: performance
              .getEntriesByType('resource')
              .filter((e) => ['script', 'css', 'link', 'img'].includes(e.initiatorType))
              .map((e) => ({
                url: e.name.replace(location.origin, ''),
                type: e.initiatorType,
                encodedBytes: e.encodedBodySize,
                decodedBytes: e.decodedBodySize,
                duration: e.duration,
              })),
            images: [...document.images].map((i) => ({
              src: i.currentSrc.replace(location.origin, ''),
              width: i.width,
              height: i.height,
              naturalWidth: i.naturalWidth,
              loaded: i.complete && i.naturalWidth > 0,
              loading: i.loading,
            })),
            overflowing: [...document.querySelectorAll('main *')]
              .filter((e) => {
                const r = e.getBoundingClientRect();
                return (
                  r.width > 0 &&
                  (r.right > innerWidth + 1 || r.left < -1) &&
                  getComputedStyle(e).position !== 'absolute'
                );
              })
              .slice(0, 12)
              .map((e) => ({
                tag: e.tagName,
                class: e.className,
                text: e.textContent?.slice(0, 70),
              })),
          }));
          const record = { width, route, run, metrics, errors, failures };
          if (run === 0) {
            await page.screenshot({ path: `${outputDir}/${width}-${routes.indexOf(route)}.png` });
            await page.evaluate(fs.readFileSync(axePath, 'utf8'));
            record.axe = {};
            for (const theme of ['dark-orange', 'light-orange', 'light-green', 'dark-green']) {
              await page.evaluate((t) => {
                document.documentElement.toggleAttribute('data-appearance', t.startsWith('light'));
                if (t.startsWith('light'))
                  document.documentElement.setAttribute('data-appearance', 'light');
                document.documentElement.toggleAttribute('data-theme', t.endsWith('green'));
                if (t.endsWith('green'))
                  document.documentElement.setAttribute('data-theme', 'green');
              }, theme);
              await page.waitForTimeout(500);
              record.axe[theme] = await page.evaluate(async () => {
                const r = await axe.run(document, {
                  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
                });
                return r.violations.map((v) => ({
                  id: v.id,
                  impact: v.impact,
                  nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
                }));
              });
              if (theme === 'light-orange' && route.includes('architecture'))
                await page.screenshot({ path: `${outputDir}/${width}-post-light.png` });
            }
          }
          results.push(record);
          await context.close();
        }
    fs.writeFileSync(path.join(outputDir, 'browser.json'), JSON.stringify(results, null, 2) + '\n');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
