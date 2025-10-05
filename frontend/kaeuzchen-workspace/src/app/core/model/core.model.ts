export type ErrorType = 'VALIDATION' | 'CONCURRENT_UPDATE' | 'NOT_FOUND' | 'DUPLICATE' | 'SERVER';

export interface KaeuzchenError {
  readonly message: string;
  readonly type: ErrorType;
}
