export declare enum TokenType {
    END = "",
    ILLEGAL = "ILLEGAL",
    PLUS = "+",
    MINUS = "-",
    SLASH = "/",
    AT = "@",
    NUMBER = "NUMBER",
    MODIFIER = "MODIFIER",
    NOW = "NOW"
}
export declare class Token {
    type: TokenType;
    literal: string;
    constructor(tokenType: TokenType, tokenLiteral: string);
}
export declare function lookupIdentifier(ident: string): TokenType;
export declare const NOW: Token;
