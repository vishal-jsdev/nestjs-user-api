import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Delete a specific key
  async deleteKey(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Clear everything in the cache
  async clearAllCache(): Promise<void> {
    await this.cacheManager.clear();
  }
}
