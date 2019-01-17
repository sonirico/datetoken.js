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
    const input = 'now-1h/h@M+2w/bw-3s-49d/m';
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
      { klazz: ModifierExpression, amount: 3, modifier: 's', operator: '-' },
      { klazz: ModifierExpression, amount: 49, modifier: 'd', operator: '-' },
      { klazz: SnapExpression, modifier: 'm', operator: '/' },
    ];
    checkParserErrors(expect, nodes, expected);
  });
  it('parse errors', () => {
    const input = 'now*2n';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const nodes = parser.parse();
    const errors = parser.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('Illegal operator: "*"');
  });
});
