import { SHOW_ERRORS } from '@/constants';
import type { ApiError } from '@/types/result';

export function getErrorMessage(error: ApiError): string {
  switch (error.type) {
    case 'NOT_FOUND':
      return SHOW_ERRORS.SHOW_NOT_FOUND;
    case 'NETWORK':
      return SHOW_ERRORS.NETWORK_ERROR;
    case 'SERVER':
      return SHOW_ERRORS.SHOW_DETAIL_FETCH_ERROR;
    case 'VALIDATION':
      return SHOW_ERRORS.SHOW_FETCH_ERROR;
    case 'INVALID_INPUT':
      return SHOW_ERRORS.INVALID_ID;
    default:
      const exhaustiveCheck: never = error;
      return exhaustiveCheck;
  }
}
