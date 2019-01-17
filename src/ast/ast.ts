import * as dateFn from 'date-fns';
import { Token, TokenType } from '../token';

export interface Expression {
  token: Token;

  operate(date?: Date): Date;

  toString(): string;

  toJSON(): object;
}

export class NowExpression implements Expression {
  public token: Token;

  constructor(token: Token) {
    this.token = token;
  }

  public operate(date: Date): Date {
    return date;
  }

  public toString(): string {
    return this.token.literal;
  }

  public toJSON(): object {
    return { type: 'now' };
  }
}

export class ModifierExpression implements Expression {
  public token: Token;
  public amount: number;
  public operator: string;
  public modifier: string;

  constructor(token: Token, amount: number = 1, operator: string, modifier: string) {
    this.token = token;
    this.amount = amount;
    this.operator = operator;
    this.modifier = modifier;
  }

  public operate(date: Date): Date {
    // Lazy enough for not to type nested objects
    switch (this.operator) {
      case TokenType.PLUS:
        switch (this.modifier) {
          case 's':
            return dateFn.addSeconds(date, this.amount);
          case 'm':
            return dateFn.addMinutes(date, this.amount);
          case 'h':
            return dateFn.addHours(date, this.amount);
          case 'd':
            return dateFn.addDays(date, this.amount);
          case 'w':
            return dateFn.addWeeks(date, this.amount);
          case 'M':
            return dateFn.addMonths(date, this.amount);
        }
        break;
      case TokenType.MINUS:
        switch (this.modifier) {
          case 's':
            return dateFn.subSeconds(date, this.amount);
          case 'm':
            return dateFn.subMinutes(date, this.amount);
          case 'h':
            return dateFn.subHours(date, this.amount);
          case 'd':
            return dateFn.subDays(date, this.amount);
          case 'w':
            return dateFn.subWeeks(date, this.amount);
          case 'M':
            return dateFn.subMonths(date, this.amount);
        }
        break;
    }
    return date;
  }

  public toString(): string {
    return `${this.operator}${this.amount}${this.modifier}`;
  }

  public toJSON(): object {
    return { type: 'amount', amount: this.amount, modifier: this.modifier, operator: this.operator };
  }
}

export class SnapExpression implements Expression {
  public token: Token;
  public modifier: string;
  public operator: string;

  constructor(token: Token, modifier: string, operator: string) {
    this.token = token;
    this.modifier = modifier;
    this.operator = operator;
  }

  public operate(date: Date): Date {
    // Lazy enough for not to type nested objects
    switch (this.operator) {
      case TokenType.SLASH:
        switch (this.modifier) {
          case 's':
            return dateFn.startOfSecond(date);
          case 'm':
            return dateFn.startOfMinute(date);
          case 'h':
            return dateFn.startOfHour(date);
          case 'd':
            return dateFn.startOfDay(date);
          case 'w':
          case 'bw':
            return dateFn.startOfWeek(date);
          case 'M':
            return dateFn.startOfMonth(date);
        }
        break;
      case TokenType.AT:
        switch (this.modifier) {
          case 's':
            return dateFn.endOfSecond(date);
          case 'm':
            return dateFn.endOfMinute(date);
          case 'h':
            return dateFn.endOfHour(date);
          case 'd':
            return dateFn.endOfDay(date);
          case 'w':
            return dateFn.endOfWeek(date);
          case 'M':
            return dateFn.endOfMonth(date);
          case 'bw': {
            if (dateFn.isThisWeek(date) && !dateFn.isWeekend(date)) {
              return date;
            }
            return dateFn.endOfDay(dateFn.addDays(dateFn.startOfWeek(date), 5));
          }
        }
        break;
    }
    return date;
  }

  public toString(): string {
    return `${this.operator}${this.modifier}`;
  }

  public toJSON(): object {
    return { type: 'snap', modifier: this.modifier, operator: this.operator };
  }
}

export namespace AmountModifiers {
  const values: string[] = ['s', 'm', 'h', 'd', 'w', 'M'];

  export const valuesString = `(${values.map(v => `"${v}"`).join(',')})`;

  export function checkModifier(modifier: string) {
    return values.includes(modifier);
  }
}
export namespace SnapModifiers {
  const values: string[] = ['s', 'm', 'h', 'd', 'w', 'bw', 'M'];

  export const valuesString = `(${values.map(v => `"${v}"`).join(',')})`;

  export function checkModifier(modifier: string) {
    return values.includes(modifier);
  }
}

export function newNowExpression() {
  return new NowExpression(new Token(TokenType.NOW, 'now'));
}
