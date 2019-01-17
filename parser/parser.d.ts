import { Expression } from '../ast';
import { Lexer } from '../lexer';
export declare class Parser {
    private lexer;
    private readonly errors;
    private currentToken?;
    private peekToken?;
    constructor(lexer: Lexer);
    getErrors(): string[];
    nextToken(): void;
    parse(): Expression[];
    private addError;
    private parseNowExpression;
    private parseModifierExpression;
    private parseSnapExpression;
    private parseExpression;
}
