import { Expression, ModifierExpression, NowExpression, SnapExpression } from '../ast';
import { InvalidTokenError } from '../exceptions';
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { Clock } from '../utils/time';

export interface ClockI {
  getTime(): Date;
}

export class Token {
  get at(): Date {
    return this.startAt || this.clock.getTime();
  }

  set at(value: Date) {
    this.startAt = value;
  }

  get nodes(): Expression[] {
    return this.expressionNodes;
  }

  get isSnapped(): boolean {
    return this.expressionNodes.some((node) => node instanceof SnapExpression);
  }

  get isModified(): boolean {
    return this.expressionNodes.some((node) => node instanceof ModifierExpression);
  }

  public static fromString(value: string, at?: Date, clock?: ClockI): Token {
    const lexer = new Lexer(value);
    const parser = new Parser(lexer);
    const nodes = parser.parse();
    if (parser.getErrors().length > 0) {
      throw new InvalidTokenError(parser.getErrors().join('\n'));
    }
    const token = new Token(nodes);
    // If a custom starting date is given, use it straightforward
    if (at) {
      token.startAt = at;
    }
    if (clock) {
      token.clock = clock;
    }
    return token;
  }
  private readonly expressionNodes: Expression[];
  private startAt?: Date;
  private clock: ClockI = Clock.create();

  constructor(nodes: Expression[], at?: Date, clock: ClockI = Clock.create()) {
    this.expressionNodes = nodes;
    this.startAt = at;
    this.clock = clock;
  }

  public toDate(): Date {
    return this.expressionNodes.reduce((acc: Date, node: Expression) => node.operate(acc), this.at);
  }

  public toString(): string {
    return this.expressionNodes.map((n) => n.toString()).join('');
  }

  public toJSON(): object[] {
    return this.nodes.map((node) => node.toJSON());
  }
}
