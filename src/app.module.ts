import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
