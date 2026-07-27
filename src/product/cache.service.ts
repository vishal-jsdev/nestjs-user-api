import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger('CacheService');
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Delete a specific key
  async deleteKey(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.log(`your cache with ${key} key deleted successfully.`);
  }
}
