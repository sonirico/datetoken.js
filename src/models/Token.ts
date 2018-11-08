import { NOW } from '../constants';
import { TokenModifier } from './TokenModifier';
import { parseToken } from '../parser/parsetoken';
import { operations as opMap } from './operations';

export class Token {
  public static fromString(token: string = NOW) {
    return parseToken(token);
  }

  public readonly modifiers: TokenModifier[];
  public snapTo: string;
  public snapUnit: string;

  public constructor(modifiers?: TokenModifier[], snapTo?: string, snapUnit?: string) {
    this.modifiers = modifiers ? modifiers : [];
    this.snapTo = snapTo ? snapTo : '';
    this.snapUnit = snapUnit ? snapUnit : '';
  }

  get isCalculated(): boolean {
    return this.modifiers.length > 0;
  }

  get isSnapped(): boolean {
    return Boolean(this.snapUnit) && Boolean(this.snapTo);
  }

  public setSnapTo(snapTo: string): void {
    this.snapTo = snapTo;
  }

  public removeSnap(): void {
    this.setSnapTo('');
    this.setSnapUnit('');
  }

  public setSnapUnit(snapUnit: string): void {
    this.snapUnit = snapUnit;
  }

  public addModifier(modifier: TokenModifier): void {
    this.modifiers.push(modifier);
  }

  public clearModifiers(): void {
    while (this.modifiers.length) {
      this.modifiers.pop();
    }
  }

  public toString(): string {
    let res = NOW;

    if (this.isCalculated) {
      res += `${this.modifiers.map(v => `${v.sign}${v.amount}${v.unit}`).join('')}`;
    }

    if (this.isSnapped) {
      res += `${this.snapTo}${this.snapUnit}`;
    }

    return res;
  }

  public toDate(): Date {
    let res = new Date();

    if (this.isCalculated) {
      res = this.modifiers.reduce((r, v) => opMap[v.sign][v.unit](r, v.amount), res);
    }

    if (this.isSnapped) {
      const snapFn = opMap[this.snapTo][this.snapUnit];
      res = snapFn(res);
    }

    return res;
  }
}
