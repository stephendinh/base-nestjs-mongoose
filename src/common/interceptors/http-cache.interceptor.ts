import { MetaResponseDto } from '@common/dtos/meta.response.dto';
import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

export class HttpCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (!cacheKey) return; // No cache by default
    return cacheKey;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheKey = this.trackBy(context);
    if (!cacheKey) {
      return next.handle();
    }
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      (cachedResponse.meta as MetaResponseDto).isCachingData = true;
      return of(cachedResponse);
    }
    return next
      .handle()
      .pipe(tap((response) => this.cacheManager.set(cacheKey, response)));
  }
}
