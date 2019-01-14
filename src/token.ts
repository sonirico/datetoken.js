export enum TokenType {
  END = '',
  ILLEGAL = 'ILLEGAL',
  // Operators
  PLUS = '+',
  MINUS = '-',
  SLASH = '/',
  AT = '@',
  // Identifiers
  NUMBER = "NUMBER",
  MODIFIER = "MODIFIER",
  // keywords
  NOW = "NOW",
}

export class Token {
  type: TokenType;
  literal: string;

  constructor(tokenType: TokenType, tokenLiteral: string) {
    this.type = tokenType;
    this.literal = tokenLiteral;
  }
}