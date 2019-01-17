"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    TokenType["END"] = "";
    TokenType["ILLEGAL"] = "ILLEGAL";
    // Operators
    TokenType["PLUS"] = "+";
    TokenType["MINUS"] = "-";
    TokenType["SLASH"] = "/";
    TokenType["AT"] = "@";
    // Identifiers
    TokenType["NUMBER"] = "NUMBER";
    TokenType["MODIFIER"] = "MODIFIER";
    // keywords
    TokenType["NOW"] = "NOW";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var keywords = {
    now: TokenType.NOW,
    s: TokenType.MODIFIER,
    m: TokenType.MODIFIER,
    h: TokenType.MODIFIER,
    d: TokenType.MODIFIER,
    w: TokenType.MODIFIER,
    M: TokenType.MODIFIER,
    bw: TokenType.MODIFIER,
};
var Token = /** @class */ (function () {
    function Token(tokenType, tokenLiteral) {
        this.type = tokenType;
        this.literal = tokenLiteral;
    }
    return Token;
}());
exports.Token = Token;
function lookupIdentifier(ident) {
    if (keywords.hasOwnProperty(ident)) {
        return keywords[ident];
    }
    return TokenType.MODIFIER;
}
exports.lookupIdentifier = lookupIdentifier;
exports.NOW = new Token(TokenType.NOW, 'now');
