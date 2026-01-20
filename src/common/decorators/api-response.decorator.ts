import { ApiProperty } from '@nestjs/swagger';

/**
 * 统一响应结构类（用于 Swagger 文档生成）
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
    default: 200,
  })
  code: number;

  @ApiProperty({
    description: '响应消息',
    example: '操作成功',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: '时间戳',
    example: '2026-01-20T13:00:00.000Z',
  })
  timestamp: string;
}
