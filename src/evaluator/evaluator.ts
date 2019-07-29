import { Token } from '../models';
import { convertToTimeZone } from 'date-fns-timezone';
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { InvalidTokenError } from '../exceptions';

export function evalDatetoken(token: string, at: Date, tz: string) {
  let date = at || new Date();
  const timeZone = tz || 'UTC';
  date = convertToTimeZone(date, { timeZone });
  const lexer = new Lexer(token);
  const parser = new Parser(lexer);
  const nodes = parser.parse();
  if (parser.getErrors().length > 0) {
    throw new InvalidTokenError(parser.getErrors().join('\n'));
  }
  return new Token(nodes, date);
}

export class Datetoken {
  private _at: Date;
  private _tz: string;
  private _token: string;
  private _result?: Token;

  public constructor(props: any = {}) {
    this._at = props.at;
    this._tz = props.tz;
    this._token = props.token;
  }

  get object() {
    return this._result;
  }

  public at(at: Date): Datetoken {
    this._at = at;
    return this;
  }

  public on(tz: string): Datetoken {
    this._tz = tz;
    return this;
  }

  public forToken(token: string): Datetoken {
    this._token = token;
    return this;
  }

  public eval(token?: string) {
    if (token) {
      this._token = token;
    }

    this._result = evalDatetoken(this._token, this._at, this._tz);
    return this;
  }

  public toDate(): Date {
    this.eval();
    return this._result!.toDate();
  }

  public toUTCDate(): Date {
    return this._result!.toDate();
  }
}