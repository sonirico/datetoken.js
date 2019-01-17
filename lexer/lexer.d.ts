import { Token } from '../token';
export declare class Lexer {
    private position;
    private readPosition;
    private readonly input;
    private currentChar;
    constructor(input?: string);
    nextToken(): Token;
    private readChar;
    private peekChar;
    private readNumber;
    private readWord;
}
