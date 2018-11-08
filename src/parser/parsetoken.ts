import { Sign, Snap, NOW } from '../constants';
import { Token } from '../models/Token';
import { TokenModifier } from '../models/TokenModifier';

export function parseToken(token: string = NOW): Token {
  const regex = /^(?:now)?(?:([+\-])(?:(\d+)?([smhdwM])))*(?:[@\/]([smhdwM]|(?:bw)))?$/g;
  const matches = regex.exec(token);
  const error = new Error(`Invalid token "${token}"`);
  let resultToken = new Token();

  if (!matches) {
    throw error;
  }

  if (token.includes('-') || token.includes('+')) {
    const modifierRegex = /([+\-])(\d+)?([smhdwM])?/g;
    let modifierMatches = modifierRegex.exec(token);

    while (modifierMatches !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (modifierMatches.index === modifierRegex.lastIndex) {
        modifierRegex.lastIndex++;
      }

      if (!modifierMatches) {
        throw error;
      }
      const sign: Sign = modifierMatches[1] === Sign.minus ? Sign.minus : Sign.plus;
      // Captured groups are undefined when optional and there is no match.
      const amount = undefined !== modifierMatches[2] ? parseInt(modifierMatches[2], 10) : 1;
      const unit = modifierMatches[modifierMatches.length - 1];

      resultToken.addModifier(new TokenModifier(sign, amount, unit));
      modifierMatches = modifierRegex.exec(token);
    }
  }

  const snapFrom = token.includes(Snap.beginning);
  const snapTo = token.includes(Snap.end);

  if (snapFrom || snapTo) {
    const snapRegex = /[\/@]([smhdwM]|(?:bw))/;
    const snapMatches = snapRegex.exec(token);
    if (!snapMatches) {
      throw error;
    }
    const snapUnit = snapMatches[snapMatches.length - 1];
    const snapTo = snapFrom ? Snap.beginning : Snap.end;

    resultToken.setSnapTo(snapTo);
    resultToken.setSnapUnit(snapUnit);
  }

  return resultToken;
}
