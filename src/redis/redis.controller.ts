import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RedisService } from './redis.service';
import { ResponseMessage } from '../common/decorators/transform.decorator';
import {
  SetCacheDto,
  GetCacheDto,
  DelCacheDto,
  HsetCacheDto,
  HgetCacheDto,
} from './dtos/cache.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorCode } from 'src/common/enums/error-code.enum';

@ApiTags('缓存管理')
@Controller('cache')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  @ApiOperation({ summary: '设置缓存' })
  @ApiResponse({ status: 200, description: '设置成功' })
  @ResponseMessage('缓存设置成功')
  async setCache(@Body() body: SetCacheDto) {
    await this.redisService.set(body.key, body.value, body.ttl);
    return { success: true };
  }

  @Get('get')
  @ApiOperation({ summary: '获取缓存' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ResponseMessage('获取缓存成功')
  async getCache(@Body() body: GetCacheDto) {
    const value = await this.redisService.get(body.key);
    return { value };
  }

  @Post('del')
  @ApiOperation({ summary: '删除缓存' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ResponseMessage('缓存删除成功')
  async delCache(@Body() body: DelCacheDto) {
    // throw new BusinessException(ErrorCode.INVALID_PARAMS, '示例业务异常');
    await this.redisService.del(body.key);
    return { success: true };
  }

  @Post('hset')
  @ApiOperation({ summary: '设置 Hash 字段' })
  @ApiResponse({ status: 200, description: '设置成功' })
  @ResponseMessage('Hash 字段设置成功')
  async hset(@Body() body: HsetCacheDto) {
    await this.redisService.hset(body.key, body.field, body.value);
    return { success: true };
  }

  @Get('hget')
  @ApiOperation({ summary: '获取 Hash 字段' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ResponseMessage('获取 Hash 字段成功')
  async hget(@Body() body: HgetCacheDto) {
    const value = await this.redisService.hget(body.key, body.field);
    return { value };
  }
}
