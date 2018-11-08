import { Sign } from '../constants';

export class TokenModifier {
  public sign: Sign;
  public amount: number;
  public unit: string;

  constructor(sign: Sign, amount: number, unit: string) {
    this.sign = sign;
    this.amount = amount;
    this.unit = unit;
  }
}
