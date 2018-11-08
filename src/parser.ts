import * as dateFn from 'date-fns';
import { Sign, Snap, NOW } from './constants';
import { TokenModifier } from './models';

const operationsMap: any = {
  '+': {
    s: dateFn.addSeconds,
    m: dateFn.addMinutes,
    h: dateFn.addHours,
    d: dateFn.addDays,
    w: dateFn.addWeeks,
    M: dateFn.addMonths,
  },
  '-': {
    s: dateFn.subSeconds,
    m: dateFn.subMinutes,
    h: dateFn.subHours,
    d: dateFn.subDays,
    w: dateFn.subWeeks,
    M: dateFn.subMonths,
  },
  [Snap.beginning]: {
    s: dateFn.startOfSecond,
    m: dateFn.startOfMinute,
    h: dateFn.startOfHour,
    d: dateFn.startOfDay,
    w: dateFn.startOfWeek,
    M: dateFn.startOfMonth,
    bw: dateFn.startOfWeek,
  },
  [Snap.end]: {
    s: dateFn.endOfSecond,
    m: dateFn.endOfMinute,
    h: dateFn.endOfHour,
    d: dateFn.endOfDay,
    w: dateFn.endOfWeek,
    M: dateFn.endOfMonth,
    bw: (dt: Date) => {
      if (dateFn.isThisWeek(dt) && !dateFn.isWeekend(dt)) {
        return dt;
      }

      return dateFn.endOfDay(dateFn.addDays(dateFn.startOfWeek(dt), 5));
    },
  },
};

function tokenToDate(token: string = NOW) {
  const parsed = deserializeToken(token);

  let res: Date = new Date();

  if (parsed.values.length) {
    res = parsed.values.reduce((r, v) => operationsMap[v.sign][v.unit](r, v.amount), res);
  }

  if (parsed.snapTo) {
    const snapFn = operationsMap[parsed.snapTo][parsed.snapUnit];
    res = snapFn(res);
  }

  return res;
}

function deserializeToken(token: string = NOW): { values: TokenModifier[]; snapTo: string; snapUnit: string } {
  const regex = /^(?:now)?(?:([+\-])(?:(\d+)?([smhdwM])))*(?:[@\/]([smhdwM]|(?:bw)))?$/g;
  const matches = regex.exec(token);
  const error = new Error(`Invalid token "${token}"`);
  if (!matches) {
    throw error;
  }

  const result: { values: TokenModifier[]; snapTo: string; snapUnit: string } = {
    values: [],
    snapTo: '',
    snapUnit: '',
  };

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

      result.values.push(new TokenModifier(sign, amount, unit));
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
    result.snapUnit = snapMatches[snapMatches.length - 1];
    result.snapTo = snapFrom ? Snap.beginning : Snap.end;
  }

  return result;
}

export { operationsMap, deserializeToken, tokenToDate };
