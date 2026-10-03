export const LIGHTWEIGHT_STORAGE_POLICY = {
  maxCacheEntries: 250,
  maxCacheBytes: 64 * 1024 * 1024,
  deduplicate: true,
  compressText: true,
  removeUnusedAssets: true,
} as const;
