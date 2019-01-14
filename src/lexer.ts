import { Token, TokenType } from './token';

function isDigit(payload: string): boolean {
  return /^\d+$/.test(payload);
}

function isLetter(payload: string): boolean {
  return /^\w+$/.test(payload);
}

export class Lexer {
  position: number;
  readPosition: number;
  input: string;
  currentChar: string;

  constructor(input = "") {
    this.position = this.readPosition = 0;
    this.input = input.trim();
    this.currentChar = '';
    this.readChar();
  }

  readChar(): void {
    if (this.position >= this.input.length) {
      this.readPosition = 0;
      this.currentChar = '';
    } else {
      this.currentChar = this.input[this.readPosition];
      this.position = this.readPosition;
    }
    this.readPosition++;
  }

  peekChar(): string {
    if (this.position >= this.input.length) return '';
    return this.input[this.readPosition];
  }

  nextToken(): Token {
    let token: Token;
    if (this.currentChar === '+') {
      token = new Token(TokenType.PLUS, this.currentChar);
    } else if (this.currentChar === '-') {
      token = new Token(TokenType.MINUS, this.currentChar);
    } else if (this.currentChar === '/') {
      token = new Token(TokenType.SLASH, this.currentChar);
    } else if (this.currentChar === '@') {
      token = new Token(TokenType.AT, this.currentChar);
    } else if (this.currentChar === 'n') {
      if ('o' !== this.peekChar()) {
        return new Token(TokenType.ILLEGAL, this.currentChar);
      }
      this.readChar();
      if ('w' !== this.peekChar()) {
        return new Token(TokenType.ILLEGAL, this.currentChar);
      }
      token = new Token(TokenType.NOW, 'now');
    } else if (isDigit(this.currentChar)) {
      return new Token(TokenType.NUMBER, this.readNumber())
    } else if (isLetter(this.currentChar)) {
      return new Token(TokenType.MODIFIER, this.readWord());
    } else {
      return new Token(TokenType.ILLEGAL, this.currentChar);
    }
    this.readChar();
    return token;
  }



  readNumber(): string {
    const pos = this.position;
    while (isDigit(this.currentChar)) {
      this.readChar();
    }
    return this.input.substring(pos, this.position);
  }

  readWord () : string {
    const pos = this.position;
    while (isLetter(this.currentChar)) {
      this.readChar();
    }
    return this.input.substring(pos, this.position);
  }
}