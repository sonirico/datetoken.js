"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("../ast");
var exceptions_1 = require("../exceptions");
var lexer_1 = require("../lexer");
var parser_1 = require("../parser");
var Token = /** @class */ (function () {
    function Token(nodes, at) {
        this.expressionNodes = nodes;
        this.startAt = at;
    }
    Object.defineProperty(Token.prototype, "at", {
        get: function () {
            return this.startAt || new Date();
        },
        set: function (value) {
            this.startAt = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "nodes", {
        get: function () {
            return this.expressionNodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "isSnapped", {
        get: function () {
            return this.expressionNodes.some(function (node) { return node instanceof ast_1.SnapExpression; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "isModified", {
        get: function () {
            return this.expressionNodes.some(function (node) { return node instanceof ast_1.ModifierExpression; });
        },
        enumerable: true,
        configurable: true
    });
    Token.fromString = function (value, at) {
        var lexer = new lexer_1.Lexer(value);
        var parser = new parser_1.Parser(lexer);
        var nodes = parser.parse();
        if (parser.getErrors().length > 0) {
            throw new exceptions_1.InvalidTokenError(parser.getErrors().join('\n'));
        }
        var token = new Token(nodes);
        // If a custom starting date is given, use it straightforward
        if (at) {
            token.startAt = at;
        }
        return token;
    };
    Token.prototype.toDate = function () {
        return this.expressionNodes.reduce(function (acc, node) { return node.operate(acc); }, this.at);
    };
    Token.prototype.toString = function () {
        return this.expressionNodes.map(function (n) { return n.toString(); }).join('');
    };
    return Token;
}());
exports.Token = Token;
