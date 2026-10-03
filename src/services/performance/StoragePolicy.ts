export interface StoragePolicy {
  maxCacheEntries: number;
  maxCachedBytes: number;
  deduplicate: boolean;
  evictOldestFirst: boolean;
}

export const DEFAULT_STORAGE_POLICY: StoragePolicy = {
  maxCacheEntries: 200,
  maxCachedBytes: 50 * 1024 * 1024,
  deduplicate: true,
  evictOldestFirst: true,
};

export function shouldCache(
  sizeBytes: number,
  policy: StoragePolicy = DEFAULT_STORAGE_POLICY,
): boolean {
  return sizeBytes > 0 && sizeBytes <= policy.maxCachedBytes;
}
