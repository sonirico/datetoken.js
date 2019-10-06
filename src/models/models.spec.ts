import { format } from 'date-fns';
import * as sinon from 'sinon';
import { ModifierExpression, NowExpression, SnapExpression } from '../ast';
import { Token as TokenModel } from '../models';
import { Token, TokenType } from '../token';

const dateFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";
const nowFaked: number = 1529311147000;
// 1529311147 => 2018-06-18T08:39:07+00:00
const fakeTimer = sinon.useFakeTimers(nowFaked);

describe('Token model', () => {
  it('toString()', () => {
    const model = new TokenModel([
      new NowExpression(new Token(TokenType.NOW, 'now')),
      new ModifierExpression(new Token(TokenType.PLUS, '+'), 2, '+', 'h'),
      new ModifierExpression(new Token(TokenType.MINUS, '-'), 1, '-', 's'),
      new SnapExpression(new Token(TokenType.SLASH, '/'), 'bw', '/'),
      new ModifierExpression(new Token(TokenType.MINUS, '-'), 99, '-', 'M'),
      new ModifierExpression(new Token(TokenType.MINUS, '-'), 2, '-', 'm'),
      new SnapExpression(new Token(TokenType.AT, '@'), 'd', '@'),
    ]);
    expect(model.toString()).toBe('now+2h-1s/bw-99M-2m@d');
    expect(model.isSnapped).toBeTruthy();
    expect(model.isModified).toBeTruthy();
  });

  it('toJSON()', () => {
    const model = new TokenModel([
      new NowExpression(new Token(TokenType.NOW, 'now')),
      new ModifierExpression(new Token(TokenType.PLUS, '+'), 2, '+', 'h'),
      new ModifierExpression(new Token(TokenType.MINUS, '-'), 1, '-', 's'),
      new SnapExpression(new Token(TokenType.SLASH, '/'), 'bw', '/'),
      new ModifierExpression(new Token(TokenType.MINUS, '-'), 99, '-', 'M'),
      new ModifierExpression(new Token(TokenType.MINUS, '-'), 2, '-', 'm'),
      new SnapExpression(new Token(TokenType.AT, '@'), 'd', '@'),
    ]);
    const expected = [
      { type: 'now' },
      { type: 'amount', amount: 2, modifier: 'h', operator: '+' },
      { type: 'amount', amount: 1, modifier: 's', operator: '-' },
      { type: 'snap', modifier: 'bw', operator: '/' },
      { type: 'amount', amount: 99, modifier: 'M', operator: '-' },
      { type: 'amount', amount: 2, modifier: 'm', operator: '-' },
      { type: 'snap', modifier: 'd', operator: '@' },
    ];
    expect(model.toJSON()).toStrictEqual(expected);
  });

  it('<now> toDate()', () => {
    const model = new TokenModel([new NowExpression(new Token(TokenType.NOW, 'now'))]);
    expect(model.isSnapped).toBeFalsy();
    expect(model.isModified).toBeFalsy();
    expect(model.toString()).toBe('now');
    expect(model.toDate().getTime()).toBe(nowFaked);
  });

  it('<now/d> toDate()', () => {
    const model = new TokenModel([
      new NowExpression(new Token(TokenType.NOW, 'now')),
      new SnapExpression(new Token(TokenType.SLASH, '/'), 'd', '/'),
    ]);
    expect(model.isSnapped).toBeTruthy();
    expect(model.isModified).toBeFalsy();
    expect(model.toString()).toBe('now/d');
    expect(format(model.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
  });

  it('<now/d@d/d@d> toDate()', () => {
    const model = new TokenModel([
      new NowExpression(new Token(TokenType.NOW, 'now')),
      new SnapExpression(new Token(TokenType.SLASH, '/'), 'd', '/'),
      new SnapExpression(new Token(TokenType.AT, '@'), 'd', '@'),
      new SnapExpression(new Token(TokenType.SLASH, '/'), 'd', '/'),
    ]);
    expect(model.isSnapped).toBeTruthy();
    expect(model.isModified).toBeFalsy();
    expect(model.toString()).toBe('now/d@d/d');
    expect(format(model.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
  });

  it("<+5s>, 'now' is optional, only one amount modifier", () => {
    const model = new TokenModel([new ModifierExpression(new Token(TokenType.PLUS, '+'), 5, '+', 's')]);
    expect(model.isSnapped).toBeFalsy();
    expect(model.isModified).toBeTruthy();
    expect(model.toString()).toBe('+5s');
    expect(model.toDate().getTime()).toBe(nowFaked + 5 * 1000);
    expect(format(model.toDate().getTime(), dateFormat)).toBe('2018-06-18T08:39:12+00:00');
  });

  it("</d>, 'now' is optional, only one snap modifier", () => {
    const model = new TokenModel([new SnapExpression(new Token(TokenType.SLASH, '/'), 'd', '/')]);
    expect(model.toString()).toBe('/d');
    expect(format(model.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
  });

  describe('fromString()', () => {
    it('with no input yields error', () => {
      expect(() => {
        TokenModel.fromString('');
      }).toThrowError('Invalid token');
    });

    it('with random input yields error', () => {
      expect(() => {
        TokenModel.fromString('yoquesetioxd');
      }).toThrowError('Illegal operator: "yoquesetioxd"');
    });

    it('now is optional', () => {
      const token = TokenModel.fromString('/d');
      expect(token.isSnapped).toBeTruthy();
      expect(token.isModified).toBeFalsy();
      expect(token.nodes).toHaveLength(1);
      expect(format(token.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
    });

    it('starting date can be configured', () => {
      const oneHourAgo = new Date(nowFaked - 1000 * 60 * 60);
      const model = TokenModel.fromString('now', oneHourAgo);
      expect(model.isSnapped).toBeFalsy();
      expect(model.isModified).toBeFalsy();
      expect(format(model.toDate().getTime(), dateFormat)).toBe('2018-06-18T07:39:07+00:00');
    });
  });
});
