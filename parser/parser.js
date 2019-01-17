"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("../ast");
var ast_2 = require("../ast");
var token_1 = require("../token");
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        this.errors = [];
        this.lexer = lexer;
    }
    Parser.prototype.getErrors = function () {
        return this.errors;
    };
    Parser.prototype.nextToken = function () {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    };
    Parser.prototype.parse = function () {
        var nodes = [];
        this.nextToken();
        this.nextToken();
        while (this.currentToken.type !== token_1.TokenType.END) {
            var node = this.parseExpression();
            if (node) {
                nodes.push(node);
            }
            this.nextToken();
        }
        return nodes;
    };
    Parser.prototype.addError = function (message) {
        this.errors.push(message);
    };
    Parser.prototype.parseNowExpression = function () {
        return ast_2.newNowExpression();
    };
    Parser.prototype.parseModifierExpression = function () {
        var curToken = this.currentToken;
        var operator = curToken.literal;
        var amount = 1;
        var modifier;
        this.nextToken();
        curToken = this.currentToken;
        if (curToken.type === token_1.TokenType.NUMBER) {
            amount = parseInt(curToken.literal, 10);
            this.nextToken();
        }
        curToken = this.currentToken;
        if (curToken.type === token_1.TokenType.MODIFIER) {
            modifier = curToken.literal;
            if (!ast_1.AmountModifiers.checkModifier(modifier)) {
                this.addError("Expected modifier literal as any of \"" + ast_1.AmountModifiers.valuesString + "\", got \"" + curToken.literal + "\"");
            }
            return new ast_1.ModifierExpression(curToken, amount, operator, modifier);
        }
        else {
            this.addError("Expected NUMBER or MODIFIER, got \"" + curToken.literal + "\"");
        }
        return undefined;
    };
    Parser.prototype.parseSnapExpression = function () {
        var curToken = this.currentToken;
        var operator = curToken.literal;
        this.nextToken();
        curToken = this.currentToken;
        if (curToken.type !== token_1.TokenType.MODIFIER) {
            this.addError("Expected snap modifier literal, got \"" + curToken.literal + "\"");
        }
        else if (!ast_1.SnapModifiers.checkModifier(curToken.literal)) {
            this.addError("Expected snap modifier literal as any of \"" + ast_1.SnapModifiers.valuesString + "\", got \"" + curToken.literal + "\"");
        }
        var modifier = curToken.literal;
        return new ast_1.SnapExpression(curToken, modifier, operator);
    };
    Parser.prototype.parseExpression = function () {
        var curToken = this.currentToken;
        if (token_1.TokenType.NOW === curToken.type) {
            return this.parseNowExpression();
        }
        else if (token_1.TokenType.PLUS === curToken.type || token_1.TokenType.MINUS === curToken.type) {
            return this.parseModifierExpression();
        }
        else if (token_1.TokenType.SLASH === curToken.type || token_1.TokenType.AT === curToken.type) {
            return this.parseSnapExpression();
        }
        else if (token_1.TokenType.ILLEGAL === curToken.type) {
            this.addError("Illegal operator: \"" + curToken.literal + "\"");
        }
        return undefined;
    };
    return Parser;
}());
exports.Parser = Parser;
