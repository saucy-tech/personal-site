import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Blog routes are fully prerendered (generateStaticParams + dynamicParams=false);
// API routes (btcusd, subscribe, invoice, lnurlp, csp-report, webmention) are
// dynamic Worker code. Nothing revalidates, so the read-only cache suffices.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
