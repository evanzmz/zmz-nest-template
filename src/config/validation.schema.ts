import { plainToInstance, Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional, IsBoolean, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  NODE_ENV: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;

  @IsString()
  APP_NAME: string;

  // Database
  @IsString()
  DB_HOST: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  DB_SYNCHRONIZE: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  DB_LOGGING: boolean;

  // Redis
  @IsString()
  REDIS_HOST: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_PORT: number;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_DB: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
