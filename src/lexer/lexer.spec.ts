import { describe, it, expect } from 'vitest';
import { TokenType } from '../token';
import { Lexer } from './lexer';

describe('Lexer', () => {
  it('Lexer no word', () => {
    const input = undefined;
    const lexer = new Lexer(input);
    expect(lexer.isInvalid()).toBeTruthy();
  });

  it('Lexer invalid word', () => {
    const input = 'yoquesetio';
    const lexer = new Lexer(input);
    const actual = lexer.nextToken();
    expect(actual.type).toBe(TokenType.ILLEGAL);
    expect(actual.literal).toBe('yoquesetio');
  });

  it('Lexer.nextToken tokenize ok', () => {
    const input = 'now-1h/h@M+2w/bw+2d/mon-3s-49d/m@Y/Q/Q1/Q2/Q3/Q4';
    const lexer = new Lexer(input);
    const expected = [
      [TokenType.NOW, 'now'],
      [TokenType.MINUS, '-'],
      [TokenType.NUMBER, '1'],
      [TokenType.MODIFIER, 'h'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'h'],
      [TokenType.AT, '@'],
      [TokenType.MODIFIER, 'M'],
      [TokenType.PLUS, '+'],
      [TokenType.NUMBER, '2'],
      [TokenType.MODIFIER, 'w'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'bw'],
      [TokenType.PLUS, '+'],
      [TokenType.NUMBER, '2'],
      [TokenType.MODIFIER, 'd'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'mon'],
      [TokenType.MINUS, '-'],
      [TokenType.NUMBER, '3'],
      [TokenType.MODIFIER, 's'],
      [TokenType.MINUS, '-'],
      [TokenType.NUMBER, '49'],
      [TokenType.MODIFIER, 'd'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'm'],
      [TokenType.AT, '@'],
      [TokenType.MODIFIER, 'Y'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'Q'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'Q1'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'Q2'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'Q3'],
      [TokenType.SLASH, '/'],
      [TokenType.MODIFIER, 'Q4'],
      [TokenType.END, ''],
    ];
    for (const expectedNode of expected) {
      const actual = lexer.nextToken();
      expect(actual.type).toBe(expectedNode[0]);
      expect(actual.literal).toBe(expectedNode[1]);
    }
  });
  it('Lexer.nextToken tokenize illegal', () => {
    const input = 'now*2h';
    const lexer = new Lexer(input);
    const expected = [
      [TokenType.NOW, 'now'],
      [TokenType.ILLEGAL, '*'],
      [TokenType.NUMBER, '2'],
      [TokenType.MODIFIER, 'h'],
    ];
    for (const expectedNode of expected) {
      const actual = lexer.nextToken();
      expect(actual.type).toBe(expectedNode[0]);
      expect(actual.literal).toBe(expectedNode[1]);
    }
  });
});
