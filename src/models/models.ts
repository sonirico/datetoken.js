import { Expression, ModifierExpression, SnapExpression } from '../ast';
import { InvalidTokenError } from '../exceptions';
import { Lexer } from '../lexer';
import { Parser } from '../parser';

export class Token {
  get at(): Date {
    return this.startAt || new Date();
  }

  set at(value: Date) {
    this.startAt = value;
  }

  get nodes(): Expression[] {
    return this.expressionNodes;
  }

  get isSnapped(): boolean {
    return this.expressionNodes.some(node => node instanceof SnapExpression);
  }

  get isModified(): boolean {
    return this.expressionNodes.some(node => node instanceof ModifierExpression);
  }

  public static fromString(value: string, at?: Date): Token {
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
    return token;
  }
  private readonly expressionNodes: Expression[];
  private startAt?: Date;

  constructor(nodes: Expression[], at?: Date) {
    this.expressionNodes = nodes;
    this.startAt = at;
  }

  public toDate(): Date {
    return this.expressionNodes.reduce((acc: Date, node: Expression) => node.operate(acc), this.at);
  }

  public toString(): string {
    return this.expressionNodes.map(n => n.toString()).join('');
  }
}
