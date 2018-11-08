import { Token } from '../models';

export function tokentodate(token: string) {
  return Token.fromString(token).toDate();
}
