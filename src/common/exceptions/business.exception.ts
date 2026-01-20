import { ErrorCode } from '../enums/error-code.enum';

export class BusinessException extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'BusinessException';
  }
}
