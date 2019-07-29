import { Expression, ModifierExpression, SnapExpression } from '../ast';

export class Token {
  get at(): Date {
    return this.startAt || new Date();
  }

  set at(value: Date) {
    this.startAt = value;
  }

  get nodes(): Expression[] {
    return this.expressionNodes;
  }

  get isSnapped(): boolean {
    return this.expressionNodes.some(node => node instanceof SnapExpression);
  }

  get isModified(): boolean {
    return this.expressionNodes.some(node => node instanceof ModifierExpression);
  }

  private readonly expressionNodes: Expression[];
  private startAt?: Date;

  constructor(nodes: Expression[], at?: Date) {
    this.expressionNodes = nodes;
    this.startAt = at;
  }

  public toDate(): Date {
    return this.expressionNodes.reduce((acc: Date, node: Expression) => node.operate(acc), this.at);
  }

  public toString(): string {
    return this.expressionNodes.map(n => n.toString()).join('');
  }

  public toJSON(): object[] {
    return this.nodes.map(node => node.toJSON());
  }
}
