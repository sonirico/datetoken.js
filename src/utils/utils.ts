import {Datetoken} from '../evaluator';

export function tokenToDate(token: string, at?: Date, tz?: string): Date {
  const datetoken = new Datetoken({token, at, tz});
  return datetoken.toDate();
}

export function tokenToUTCDate(token: string, at?: Date, tz?: string): Date {
  const datetoken = new Datetoken({token, at, tz});
  return datetoken.toUTCDate();
}
