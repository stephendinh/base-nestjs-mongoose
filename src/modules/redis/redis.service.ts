import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  async onModuleDestroy() {
    await this.quit();
  }

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  async set(key: string, value: any, ttl = 5): Promise<any> {
    return this.cache.set(key, value, { ttl });
  }

  async reset(): Promise<void> {
    return this.cache.reset();
  }

  async del(key: string): Promise<void> {
    return this.cache.del(key);
  }

  private async quit() {
    const store: any = this.cache.store;
    if (typeof store['getClient'] === 'function') {
      store.getClient().quit();
    }
  }
}
