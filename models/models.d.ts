import { Expression } from '../ast';
export declare class Token {
    at: Date;
    readonly nodes: Expression[];
    readonly isSnapped: boolean;
    readonly isModified: boolean;
    static fromString(value: string, at?: Date): Token;
    private readonly expressionNodes;
    private startAt?;
    constructor(nodes: Expression[], at?: Date);
    toDate(): Date;
    toString(): string;
}
