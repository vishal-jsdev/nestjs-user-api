import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<T> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    // Logs the request method, URL, and execution time after response
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`${method} ${url} ${Date.now() - now}ms`)),
      );
  }
}
