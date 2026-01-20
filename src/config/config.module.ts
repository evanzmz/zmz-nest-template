import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validate,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
