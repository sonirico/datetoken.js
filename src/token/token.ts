export enum TokenType {
  END = '',
  ILLEGAL = 'ILLEGAL',
  // Operators
  PLUS = '+',
  MINUS = '-',
  SLASH = '/',
  AT = '@',
  // Identifiers
  NUMBER = 'NUMBER',
  MODIFIER = 'MODIFIER',
  // keywords
  NOW = 'NOW',
}

interface Keyword {
  [key: string]: TokenType;
}

const keywords = {
  now: TokenType.NOW,
  s: TokenType.MODIFIER,
  m: TokenType.MODIFIER,
  h: TokenType.MODIFIER,
  d: TokenType.MODIFIER,
  w: TokenType.MODIFIER,
  M: TokenType.MODIFIER,
  Y: TokenType.MODIFIER,
  Q: TokenType.MODIFIER,
  Q1: TokenType.MODIFIER,
  Q2: TokenType.MODIFIER,
  Q3: TokenType.MODIFIER,
  Q4: TokenType.MODIFIER,
  bw: TokenType.MODIFIER,
  mon: TokenType.MODIFIER,
  tue: TokenType.MODIFIER,
  thu: TokenType.MODIFIER,
  fri: TokenType.MODIFIER,
  sat: TokenType.MODIFIER,
  sun: TokenType.MODIFIER,
} as Keyword;

export class Token {
  public type: TokenType;
  public literal: string;

  constructor(tokenType: TokenType, tokenLiteral: string) {
    this.type = tokenType;
    this.literal = tokenLiteral;
  }
}

export function lookupIdentifier(ident: string): TokenType {
  if (keywords.hasOwnProperty(ident)) {
    return keywords[ident] ?? TokenType.ILLEGAL;
  }
  return TokenType.ILLEGAL;
}

export const NOW = new Token(TokenType.NOW, 'now');
