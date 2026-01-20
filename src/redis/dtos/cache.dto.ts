import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SetCacheDto {
  @ApiProperty({ description: '缓存键', example: 'user:session:123' })
  @IsString()
  key: string;

  @ApiProperty({ description: '缓存值', example: '{"userId":123,"token":"abc"}' })
  @IsString()
  value: string;

  @ApiPropertyOptional({
    description: '过期时间（秒）',
    example: 3600,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  ttl?: number;
}

export class GetCacheDto {
  @ApiProperty({ description: '缓存键', example: 'user:session:123' })
  @IsString()
  key: string;
}

export class DelCacheDto {
  @ApiProperty({ description: '缓存键', example: 'user:session:123' })
  @IsString()
  key: string;
}

export class HsetCacheDto {
  @ApiProperty({ description: 'Hash 键', example: 'user:123' })
  @IsString()
  key: string;

  @ApiProperty({ description: '字段名', example: 'name' })
  @IsString()
  field: string;

  @ApiProperty({ description: '字段值', example: 'Tom' })
  @IsString()
  value: string;
}

export class HgetCacheDto {
  @ApiProperty({ description: 'Hash 键', example: 'user:123' })
  @IsString()
  key: string;

  @ApiProperty({ description: '字段名', example: 'name' })
  @IsString()
  field: string;
}
