import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD') || undefined,
          db: configService.get('REDIS_DB'),
        });

        redis.on('connect', () => {
          console.log('Redis connected successfully');
        });

        redis.on('error', (err) => {
          console.error('Redis connection error:', err);
        });

        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
