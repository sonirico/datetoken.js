import type { ClockI } from '../models/index.js';
import { Token } from '../models/index.js';

export function tokenToDate(token: string, at?: Date, clock?: ClockI): Date {
  return Token.fromString(token, at, clock).toDate();
}
