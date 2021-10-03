import { Expression, ModifierExpression, NowExpression, SnapExpression } from '../ast';
import { Lexer } from '../lexer';
import { Parser } from '../parser';

describe('Parser', () => {
  function checkParserErrors(expect: jest.Expect, actualNodes: Expression[], expectedNodes: any[]) {
    expect(actualNodes.length).toBe(expectedNodes.length);
    for (let i = 0, len = expectedNodes.length; i < len; i++) {
      const actual = actualNodes[i];
      const expected = expectedNodes[i];
      expect(actual).toBeInstanceOf(expected.klazz);
      switch (expected.klazz) {
        case ModifierExpression:
          expect((actual as ModifierExpression).amount).toBe(expected.amount);
          expect((actual as ModifierExpression).modifier).toBe(expected.modifier);
          expect((actual as ModifierExpression).operator).toBe(expected.operator);
          break;
        case SnapExpression:
          expect((actual as SnapExpression).modifier).toBe(expected.modifier);
          expect((actual as SnapExpression).operator).toBe(expected.operator);
          break;
      }
    }
  }

  it('parse', () => {
    const input = 'now-1h/h@M+2w/bw+2d/thu-3s-49d/m+5d@mon@Y';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const nodes = parser.parse();
    const expected = [
      { klazz: NowExpression },
      { klazz: ModifierExpression, amount: 1, modifier: 'h', operator: '-' },
      { klazz: SnapExpression, modifier: 'h', operator: '/' },
      { klazz: SnapExpression, modifier: 'M', operator: '@' },
      { klazz: ModifierExpression, amount: 2, modifier: 'w', operator: '+' },
      { klazz: SnapExpression, modifier: 'bw', operator: '/' },
      { klazz: ModifierExpression, amount: 2, modifier: 'd', operator: '+' },
      { klazz: SnapExpression, modifier: 'thu', operator: '/' },
      { klazz: ModifierExpression, amount: 3, modifier: 's', operator: '-' },
      { klazz: ModifierExpression, amount: 49, modifier: 'd', operator: '-' },
      { klazz: SnapExpression, modifier: 'm', operator: '/' },
      { klazz: ModifierExpression, amount: 5, modifier: 'd', operator: '+' },
      { klazz: SnapExpression, modifier: 'mon', operator: '@' },
      { klazz: SnapExpression, modifier: 'Y', operator: '@' },
    ];
    checkParserErrors(expect, nodes, expected);
  });
  it('parse errors', () => {
    const input = 'now*2n';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    parser.parse();
    const errors = parser.getErrors();
    expect(errors.length).toBe(2);
    expect(errors[0]).toBe('Illegal operator: "*"');
    expect(errors[1]).toBe('Illegal operator: "n"');
  });

  it('parse random string', () => {
    const input = 'yoquesetioxd';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    parser.parse();
    const errors = parser.getErrors();
    expect(errors[0]).toBe('Illegal operator: "yoquesetioxd"');
  });

  it('parse nothing', () => {
    const input = undefined;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    parser.parse();
    const errors = parser.getErrors();
    expect(errors[0]).toBe('Invalid token');
  });
});
