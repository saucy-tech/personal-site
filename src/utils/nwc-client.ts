import { NWCClient } from '@getalby/sdk';

let cached: NWCClient | null = null;
let cachedUrl: string | null = null;

/**
 * Reuse one NWC client per warm isolate to avoid repeated relay handshakes.
 */
export function getOrCreateNWCClient(nostrWalletConnectUrl: string): NWCClient {
  if (cached && cachedUrl === nostrWalletConnectUrl) {
    return cached;
  }
  cached = new NWCClient({ nostrWalletConnectUrl });
  cachedUrl = nostrWalletConnectUrl;
  return cached;
}

/** Test helper: clear singleton between jest.resetModules() lifecycles if needed */
export function resetNWCClientCacheForTests(): void {
  cached = null;
  cachedUrl = null;
}
