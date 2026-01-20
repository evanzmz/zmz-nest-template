import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from './common/decorators/transform.decorator';

@ApiTags('应用')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ResponseMessage('服务运行正常')
  health(): { status: string } {
    return {
      status: 'ok',
    };
  }
}
