import { lookupIdentifier, Token, TokenType } from '../token/index.js';

function isDigit(payload: string): boolean {
  return /^\d+$/.test(payload);
}

function isLetter(payload: string): boolean {
  return /^\w+$/.test(payload);
}

export class Lexer {
  private readonly invalid: boolean;
  private position: number;
  private readPosition: number;
  private readonly input: string;
  private currentChar: string;

  constructor(input: string = '') {
    this.invalid = !input || 'string' !== typeof input || input.trim().length < 2;

    if (this.invalid) {
      this.position = this.readPosition = 0;
      this.input = '';
      this.currentChar = '';
    } else {
      this.position = this.readPosition = 0;
      this.input = input.trim();
      this.currentChar = '';
      this.readChar();
    }
  }

  public isInvalid() {
    return this.invalid;
  }

  public nextToken(): Token {
    let token: Token;
    if (this.currentChar === '') {
      return new Token(TokenType.END, this.currentChar);
    } else if (this.currentChar === '+') {
      token = new Token(TokenType.PLUS, this.currentChar);
    } else if (this.currentChar === '-') {
      token = new Token(TokenType.MINUS, this.currentChar);
    } else if (this.currentChar === '/') {
      token = new Token(TokenType.SLASH, this.currentChar);
    } else if (this.currentChar === '@') {
      token = new Token(TokenType.AT, this.currentChar);
    } else if (isDigit(this.currentChar)) {
      return new Token(TokenType.NUMBER, this.readNumber());
    } else if (isLetter(this.currentChar)) {
      const literal = this.readWord();
      return new Token(lookupIdentifier(literal), literal);
    } else {
      token = new Token(TokenType.ILLEGAL, this.currentChar);
    }
    this.readChar();
    return token;
  }

  private readChar(): void {
    if (this.position >= this.input.length) {
      this.readPosition = 0;
      this.currentChar = '';
    } else {
      this.currentChar = this.input[this.readPosition] ?? '';
      this.position = this.readPosition;
    }
    this.readPosition++;
  }

  private peekChar(): string {
    if (this.position >= this.input.length) {
      return '';
    }
    return this.input[this.readPosition] ?? '';
  }

  private readNumber(): string {
    const pos = this.position;
    while (isDigit(this.currentChar)) {
      this.readChar();
    }
    return this.input.substring(pos, this.position);
  }

  private readWord(): string {
    const pos = this.position;
    while (isLetter(this.currentChar) || isDigit(this.currentChar)) {
      this.readChar();
    }
    return this.input.substring(pos, this.position);
  }
}
