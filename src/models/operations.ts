import * as dateFn from 'date-fns';
import { Sign, Snap } from '../constants';

export const operations: any = {
  [Sign.plus]: {
    s: dateFn.addSeconds,
    m: dateFn.addMinutes,
    h: dateFn.addHours,
    d: dateFn.addDays,
    w: dateFn.addWeeks,
    M: dateFn.addMonths,
  },
  [Sign.minus]: {
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
