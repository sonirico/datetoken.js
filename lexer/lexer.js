"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
function isDigit(payload) {
    return /^\d+$/.test(payload);
}
function isLetter(payload) {
    return /^\w+$/.test(payload);
}
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        if (input === void 0) { input = ''; }
        this.position = this.readPosition = 0;
        this.input = input.trim();
        this.currentChar = '';
        this.readChar();
    }
    Lexer.prototype.nextToken = function () {
        var token;
        if (this.currentChar === '') {
            return new token_1.Token(token_1.TokenType.END, this.currentChar);
        }
        else if (this.currentChar === '+') {
            token = new token_1.Token(token_1.TokenType.PLUS, this.currentChar);
        }
        else if (this.currentChar === '-') {
            token = new token_1.Token(token_1.TokenType.MINUS, this.currentChar);
        }
        else if (this.currentChar === '/') {
            token = new token_1.Token(token_1.TokenType.SLASH, this.currentChar);
        }
        else if (this.currentChar === '@') {
            token = new token_1.Token(token_1.TokenType.AT, this.currentChar);
        }
        else if (isDigit(this.currentChar)) {
            return new token_1.Token(token_1.TokenType.NUMBER, this.readNumber());
        }
        else if (isLetter(this.currentChar)) {
            var literal = this.readWord();
            return new token_1.Token(token_1.lookupIdentifier(literal), literal);
        }
        else {
            token = new token_1.Token(token_1.TokenType.ILLEGAL, this.currentChar);
        }
        this.readChar();
        return token;
    };
    Lexer.prototype.readChar = function () {
        if (this.position >= this.input.length) {
            this.readPosition = 0;
            this.currentChar = '';
        }
        else {
            this.currentChar = this.input[this.readPosition];
            this.position = this.readPosition;
        }
        this.readPosition++;
    };
    Lexer.prototype.peekChar = function () {
        if (this.position >= this.input.length) {
            return '';
        }
        return this.input[this.readPosition];
    };
    Lexer.prototype.readNumber = function () {
        var pos = this.position;
        while (isDigit(this.currentChar)) {
            this.readChar();
        }
        return this.input.substring(pos, this.position);
    };
    Lexer.prototype.readWord = function () {
        var pos = this.position;
        while (isLetter(this.currentChar)) {
            this.readChar();
        }
        return this.input.substring(pos, this.position);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
