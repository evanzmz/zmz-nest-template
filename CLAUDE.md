# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS 11 backend template with TypeScript, designed as a scaffolding for creating RESTful API applications. It follows NestJS's modular architecture pattern with heavy use of dependency injection.

**Key Stack:**
- Framework: NestJS 11 with TypeScript
- Database: PostgreSQL with TypeORM
- Cache: Redis with ioredis
- Validation: class-validator + class-transformer
- Documentation: Swagger/OpenAPI
- Package Manager: pnpm

## Common Commands

### Development
```bash
pnpm run start:dev     # Start development server with hot-reload
pnpm run start:prod    # Start production server
pnpm run build         # Build for production
```

### Testing
```bash
pnpm run test          # Run unit tests
pnpm run test:e2e      # Run end-to-end tests
pnpm run test:watch    # Run tests in watch mode
pnpm run test:cov      # Run tests with coverage
```

### Database Migrations (TypeORM)
```bash
pnpm run migration:generate -- migration:generate -d typeorm.config.ts # Generate new migration
pnpm run migration:run  # Run pending migrations
pnpm run migration:revert # Revert last migration
pnpm run migration:show # Show migration status
```

### Code Quality
```bash
pnpm run lint          # Run ESLint with auto-fix
pnpm run format        # Format code with Prettier
```

## Architecture

### Global Middleware Pipeline
All requests pass through a standardized pipeline defined in [src/main.ts](src/main.ts):

1. **Global API Prefix**: All routes prefixed with `/api`
2. **ValidationPipe**: Auto-validates DTOs using class-validator decorators
   - `whitelist: true` - strips non-whitelisted properties
   - `forbidNonWhitelisted: true` - throws error if non-whitelisted properties present
   - `transform: true` - auto-converts types
3. **HttpExceptionFilter**: Catches all exceptions and formats them consistently
4. **TransformInterceptor**: Wraps all successful responses in standard format
5. **Swagger**: Auto-generated docs at `/api/docs`

### Standard Response Format

**Success Response** (applied by TransformInterceptor):
```typescript
{
  code: 200,
  message: "操作成功", // or custom message from @ResponseMessage() decorator
  data: <any>,        // controller return value
  timestamp: string
}
```

**Error Response** (applied by HttpExceptionFilter):
```typescript
{
  code: number,        // from ErrorCode enum
  message: string,
  timestamp: string,
  path: string
}
```

### Exception Handling Pattern

- **BusinessException**: Use for business logic errors (returns HTTP 200 with custom error code)
  ```typescript
  throw new BusinessException(ErrorCode.USER_NOT_FOUND);
  ```
- **HttpException**: Use for HTTP errors (returns corresponding HTTP status code)
  ```typescript
  throw new BadRequestException('Invalid input');
  ```
- See [src/common/enums/error-code.enum.ts](src/common/enums/error-code.enum.ts) for all error codes

### Environment Configuration

Environment variables are validated at startup using class-validator ([src/config/validation.schema.ts](src/config/validation.schema.ts)):

- `.env.${NODE_ENV}` files are loaded first (e.g., `.env.development`, `.env.production`)
- Falls back to `.env` if environment-specific file doesn't exist
- Application will fail to start if required env vars are missing or invalid

Required environment variables:
- `NODE_ENV`, `PORT`, `APP_NAME`
- Database: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SYNCHRONIZE`, `DB_LOGGING`
- Redis: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (optional), `REDIS_DB`

### Module Structure

Each feature module typically contains:
- `*.module.ts` - Module definition with imports/exports
- `*.entity.ts` - TypeORM entities
- `*.dto.ts` - Request/response DTOs with class-validator decorators
- `*.controller.ts` - Controllers with Swagger decorators
- `*.service.ts` - Business logic

### Redis Usage

Inject `RedisService` from the `@/redis/redis.module` module. It provides a clean wrapper around ioredis:

```typescript
// String operations
await redisService.set('key', 'value', ttl); // ttl in seconds
await redisService.get('key');

// Hash operations
await redisService.hset('key', 'field', 'value');
await redisService.hget('key', 'field');
await redisService.hgetall('key');

// Lists, Sets, Sorted Sets also available
```

### Adding a New Feature Module

1. Create module with NestJS CLI: `nest g resource users`
2. Define TypeORM entity in `*.entity.ts`
3. Create DTOs with class-validator decorators
4. Implement CRUD operations in service
5. Use `@ResponseMessage('custom message')` decorator for custom success messages
6. Run `pnpm run migration:generate -- <migration-name>` to create DB migration

## Important Notes

- The project uses `pnpm` as package manager - avoid npm/yarn
- All routes are prefixed with `/api`
- Swagger documentation is available at `/api/docs` when running
- Database migrations are required - use TypeORM migrations, never set `synchronize: true` in production
- The `users` module ([src/users/](src/users/)) is a complete example demonstrating CRUD, DTOs, entities, and Swagger documentation
