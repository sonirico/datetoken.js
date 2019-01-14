import { Lexer } from './lexer'
import { TokenType, Token } from './token'


describe("Lexer", () => {
    test("Lexer.nextToken", () => {
      const input = 'now-1h/h@M+2w/bw-3s-49d/m';
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
          [TokenType.MINUS, '-'],
          [TokenType.NUMBER, '3'],
          [TokenType.MODIFIER, 's'],
          [TokenType.MINUS, '-'],
          [TokenType.NUMBER, '49'],
          [TokenType.MODIFIER, 'd'],
          [TokenType.SLASH, '/'],
          [TokenType.MODIFIER, 'm'],
          [TokenType.END, ''],
      ];
      for (let expectedNode of expected) {
          const actual = lexer.nextToken();
          expect(actual.type).toBe(expectedNode[0]);
          expect(actual.literal).toBe(expectedNode[1]);
      }
    });
});

