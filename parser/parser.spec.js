"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("../ast");
var lexer_1 = require("../lexer");
var parser_1 = require("../parser");
describe('Parser', function () {
    function checkParserErrors(expect, actualNodes, expectedNodes) {
        expect(actualNodes.length).toBe(expectedNodes.length);
        for (var i = 0, len = expectedNodes.length; i < len; i++) {
            var actual = actualNodes[i];
            var expected = expectedNodes[i];
            expect(actual).toBeInstanceOf(expected.klazz);
            switch (expected.klazz) {
                case ast_1.ModifierExpression:
                    expect(actual.amount).toBe(expected.amount);
                    expect(actual.modifier).toBe(expected.modifier);
                    expect(actual.operator).toBe(expected.operator);
                    break;
                case ast_1.SnapExpression:
                    expect(actual.modifier).toBe(expected.modifier);
                    expect(actual.operator).toBe(expected.operator);
                    break;
            }
        }
    }
    it('parse', function () {
        var input = 'now-1h/h@M+2w/bw-3s-49d/m';
        var lexer = new lexer_1.Lexer(input);
        var parser = new parser_1.Parser(lexer);
        var nodes = parser.parse();
        var expected = [
            { klazz: ast_1.NowExpression },
            { klazz: ast_1.ModifierExpression, amount: 1, modifier: 'h', operator: '-' },
            { klazz: ast_1.SnapExpression, modifier: 'h', operator: '/' },
            { klazz: ast_1.SnapExpression, modifier: 'M', operator: '@' },
            { klazz: ast_1.ModifierExpression, amount: 2, modifier: 'w', operator: '+' },
            { klazz: ast_1.SnapExpression, modifier: 'bw', operator: '/' },
            { klazz: ast_1.ModifierExpression, amount: 3, modifier: 's', operator: '-' },
            { klazz: ast_1.ModifierExpression, amount: 49, modifier: 'd', operator: '-' },
            { klazz: ast_1.SnapExpression, modifier: 'm', operator: '/' },
        ];
        checkParserErrors(expect, nodes, expected);
    });
    it('parse errors', function () {
        var input = 'now*2n';
        var lexer = new lexer_1.Lexer(input);
        var parser = new parser_1.Parser(lexer);
        var nodes = parser.parse();
        var errors = parser.getErrors();
        expect(errors.length).toBe(1);
        expect(errors[0]).toBe('Illegal operator: "*"');
    });
});
