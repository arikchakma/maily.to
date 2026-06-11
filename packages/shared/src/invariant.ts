import { MAILY_BUG_REPORT_URL, MAILY_ERROR_PREFIX } from './constants';

/**
 * Assertion function that throws if the value is false, null, or undefined.
 * Used as a development-time guard to catch impossible states early.
 * Logs a bug report URL before throwing to help with issue filing.
 */
export function invariant(value: boolean, message?: string): asserts value;

export function invariant<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T;

export function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    console.error(
      `${MAILY_ERROR_PREFIX}: The following error is a bug in Maily;
Please open an issue! ${MAILY_BUG_REPORT_URL}`
    );
    throw new Error(message);
  }
}
