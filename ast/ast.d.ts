import { Token } from '../token';
export interface Expression {
    token: Token;
    operate(date?: Date): Date;
    toString(): string;
}
export declare class NowExpression implements Expression {
    token: Token;
    constructor(token: Token);
    operate(date: Date): Date;
    toString(): string;
}
export declare class ModifierExpression implements Expression {
    token: Token;
    amount: number;
    operator: string;
    modifier: string;
    constructor(token: Token, amount: number | undefined, operator: string, modifier: string);
    operate(date: Date): Date;
    toString(): string;
}
export declare class SnapExpression implements Expression {
    token: Token;
    modifier: string;
    operator: string;
    constructor(token: Token, modifier: string, operator: string);
    operate(date: Date): Date;
    toString(): string;
}
export declare namespace AmountModifiers {
    const valuesString: string;
    function checkModifier(modifier: string): boolean;
}
export declare namespace SnapModifiers {
    const valuesString: string;
    function checkModifier(modifier: string): boolean;
}
export declare function newNowExpression(): NowExpression;
