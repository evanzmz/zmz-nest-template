import { SetMetadata } from '@nestjs/common';

/**
 * 自定义响应消息装饰器
 * @param message 响应消息
 */
export const ResponseMessage = (message: string) =>
  SetMetadata('responseMessage', message);
