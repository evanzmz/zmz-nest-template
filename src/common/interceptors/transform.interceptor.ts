import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ApiResponseDto } from '../decorators/api-response.decorator';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
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
    // 获取控制器方法上可能定义的自定义消息
    const customMessage = this.reflector.get<string>(
      'responseMessage',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        // 如果返回的数据已经是标准响应格式，直接返回
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          'message' in data &&
          'data' in data
        ) {
          return data;
        }

        // 否则包装成标准响应格式
        return {
          code: 200,
          message: customMessage || '操作成功',
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
