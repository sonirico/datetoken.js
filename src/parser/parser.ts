import { AmountModifiers, Expression, ModifierExpression, NowExpression, SnapExpression, SnapModifiers } from '../ast';
import { newNowExpression } from '../ast';
import { Lexer } from '../lexer';
import { Token, TokenType } from '../token';

export class Parser {
  private lexer: Lexer;
  private readonly errors: string[];
  private currentToken?: Token;
  private peekToken?: Token;

  constructor(lexer: Lexer) {
    this.errors = [];
    this.lexer = lexer;
  }

  public getErrors() {
    return this.errors;
  }

  public nextToken(): void {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  public parse(): Expression[] {
    if (this.lexer.isInvalid()) {
      this.addError('Invalid token');
    }

    const nodes: Expression[] = [];
    this.nextToken();
    this.nextToken();
    while (this.currentToken!.type !== TokenType.END) {
      const node = this.parseExpression();
      if (node) {
        nodes.push(node);
      }
      this.nextToken();
    }
    return nodes;
  }

  private addError(message: string): void {
    this.errors.push(message);
  }

  private parseNowExpression(): NowExpression {
    return newNowExpression();
  }

  private parseModifierExpression(): ModifierExpression | undefined {
    let curToken = this.currentToken as Token;
    const operator = curToken.literal;
    let amount: number = 1;
    let modifier: string;
    this.nextToken();
    curToken = this.currentToken as Token;
    if (curToken.type === TokenType.NUMBER) {
      amount = parseInt(curToken.literal, 10);
      this.nextToken();
    }
    curToken = this.currentToken as Token;
    if (curToken.type === TokenType.MODIFIER) {
      modifier = curToken.literal;
      if (!AmountModifiers.checkModifier(modifier)) {
        this.addError(
          `Expected modifier literal as any of "${AmountModifiers.valuesString}", got "${curToken.literal}"`,
        );
      }
      return new ModifierExpression(curToken, amount, operator, modifier);
    } else {
      this.addError(`Expected NUMBER or MODIFIER, got "${curToken.literal}"`);
    }
    return undefined;
  }

  private parseSnapExpression(): SnapExpression {
    let curToken = this.currentToken as Token;
    const operator = curToken.literal;
    this.nextToken();
    curToken = this.currentToken as Token;
    if (curToken.type !== TokenType.MODIFIER) {
      this.addError(`Expected snap modifier literal, got "${curToken.literal}"`);
    } else if (!SnapModifiers.checkModifier(curToken.literal)) {
      this.addError(
        `Expected snap modifier literal as any of "${SnapModifiers.valuesString}", got "${curToken.literal}"`,
      );
    }
    const modifier = curToken.literal;
    return new SnapExpression(curToken, modifier, operator);
  }

  private parseExpression(): Expression | undefined {
    const curToken = this.currentToken as Token;
    if (TokenType.NOW === curToken.type) {
      return this.parseNowExpression();
    } else if (TokenType.PLUS === curToken.type || TokenType.MINUS === curToken.type) {
      return this.parseModifierExpression();
    } else if (TokenType.SLASH === curToken.type || TokenType.AT === curToken.type) {
      return this.parseSnapExpression();
    } else if (TokenType.ILLEGAL === curToken.type) {
      this.addError(`Illegal operator: "${curToken.literal}"`);
    }
    return undefined;
  }
}
