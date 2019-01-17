"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var token_1 = require("../token");
describe('Lexer', function () {
    it('Lexer.nextToken tokenize ok', function () {
        var input = 'now-1h/h@M+2w/bw-3s-49d/m';
        var lexer = new lexer_1.Lexer(input);
        var expected = [
            [token_1.TokenType.NOW, 'now'],
            [token_1.TokenType.MINUS, '-'],
            [token_1.TokenType.NUMBER, '1'],
            [token_1.TokenType.MODIFIER, 'h'],
            [token_1.TokenType.SLASH, '/'],
            [token_1.TokenType.MODIFIER, 'h'],
            [token_1.TokenType.AT, '@'],
            [token_1.TokenType.MODIFIER, 'M'],
            [token_1.TokenType.PLUS, '+'],
            [token_1.TokenType.NUMBER, '2'],
            [token_1.TokenType.MODIFIER, 'w'],
            [token_1.TokenType.SLASH, '/'],
            [token_1.TokenType.MODIFIER, 'bw'],
            [token_1.TokenType.MINUS, '-'],
            [token_1.TokenType.NUMBER, '3'],
            [token_1.TokenType.MODIFIER, 's'],
            [token_1.TokenType.MINUS, '-'],
            [token_1.TokenType.NUMBER, '49'],
            [token_1.TokenType.MODIFIER, 'd'],
            [token_1.TokenType.SLASH, '/'],
            [token_1.TokenType.MODIFIER, 'm'],
            [token_1.TokenType.END, ''],
        ];
        for (var _i = 0, expected_1 = expected; _i < expected_1.length; _i++) {
            var expectedNode = expected_1[_i];
            var actual = lexer.nextToken();
            expect(actual.type).toBe(expectedNode[0]);
            expect(actual.literal).toBe(expectedNode[1]);
        }
    });
    it('Lexer.nextToken tokenize illegal', function () {
        var input = 'now*2h';
        var lexer = new lexer_1.Lexer(input);
        var expected = [
            [token_1.TokenType.NOW, 'now'],
            [token_1.TokenType.ILLEGAL, '*'],
            [token_1.TokenType.NUMBER, '2'],
            [token_1.TokenType.MODIFIER, 'h'],
        ];
        for (var _i = 0, expected_2 = expected; _i < expected_2.length; _i++) {
            var expectedNode = expected_2[_i];
            var actual = lexer.nextToken();
            expect(actual.type).toBe(expectedNode[0]);
            expect(actual.literal).toBe(expectedNode[1]);
        }
    });
});
