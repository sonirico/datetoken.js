import type { ClockI } from '../models';
import { Token } from '../models';

export function tokenToDate(token: string, at?: Date, clock?: ClockI): Date {
  return Token.fromString(token, at, clock).toDate();
}
