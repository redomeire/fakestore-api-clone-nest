import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  status: string;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data: data.result || data,
        message:
          this.reflector.get('response_message', context.getHandler()) ||
          data.message ||
          '',
        status: context.switchToHttp().getResponse().statusCode,
      })),
    );
  }
}
