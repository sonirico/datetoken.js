import { format } from 'date-fns';
import * as sinon from 'sinon';
import { tokenToDate } from './utils';

const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
const nowFaked = 1529311147000; // => 2018-06-18T08:39:07+00:00
const fakeTimer = sinon.useFakeTimers(nowFaked);

describe('utils.tokenToDate', () => {
  describe('now', () => {
    it('is understood', () => {
      expect(tokenToDate('now').getTime()).toBe(nowFaked);
    });
  });

  describe('now with offset', () => {
    it('and leaving the amount unset defaults to 1', () => {
      expect(tokenToDate('now+s').getTime()).toBe(nowFaked + 1000);
    });

    it('can add seconds', () => {
      expect(tokenToDate('now+5s').getTime()).toBe(nowFaked + 5000);
    });

    it('can subtract seconds', () => {
      expect(tokenToDate('now-5s').getTime()).toBe(nowFaked - 5000);
    });

    it('can add minutes', () => {
      expect(tokenToDate('now+5m').getTime()).toBe(nowFaked + 5 * 60 * 1000);
    });

    it('can subtract minutes', () => {
      expect(tokenToDate('now-5m').getTime()).toBe(nowFaked - 5 * 60 * 1000);
    });

    it('can add hours', () => {
      expect(tokenToDate('now+5h').getTime()).toBe(nowFaked + 5 * 60 * 60 * 1000);
    });

    it('can subtract hours', () => {
      expect(tokenToDate('now-5h').getTime()).toBe(nowFaked - 5 * 60 * 60 * 1000);
    });

    it('can add days', () => {
      expect(tokenToDate('now+2d').getTime()).toBe(nowFaked + 2 * 24 * 60 * 60 * 1000);
    });

    it('can subtract days', () => {
      expect(tokenToDate('now-2d').getTime()).toBe(nowFaked - 2 * 24 * 60 * 60 * 1000);
    });

    it('can add weeks', () => {
      expect(tokenToDate('now+1w').getTime()).toBe(nowFaked + 7 * 24 * 60 * 60 * 1000);
    });

    it('can subtract weeks', () => {
      expect(tokenToDate('now-1w').getTime()).toBe(nowFaked - 7 * 24 * 60 * 60 * 1000);
    });

    it('can add months', () => {
      // 61 = 30 (June) + 31 (July)
      expect(tokenToDate('now+2M').getTime()).toBe(nowFaked + 61 * 24 * 60 * 60 * 1000);
    });

    it('can subtract months', () => {
      // 61 = 30 (April) + 31 (May)
      expect(tokenToDate('now-2M').getTime()).toBe(nowFaked - 61 * 24 * 60 * 60 * 1000);
    });
  });

  describe('now with markers', () => {
    it('understands the start of minute', () => {
      const actual = format(tokenToDate('now/m'), dateFormat);
      expect(actual).toBe('2018-06-18T08:39:00+00:00');
    });

    it('understands the end of minute', () => {
      const actual = format(tokenToDate('now@m'), dateFormat);
      const expected = '2018-06-18T08:39:59+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the start of hour', () => {
      const actual = format(tokenToDate('now/h'), dateFormat);
      const expected = '2018-06-18T08:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of hour', () => {
      const actual = format(tokenToDate('now@h'), dateFormat);
      const expected = '2018-06-18T08:59:59+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the start of day', () => {
      const actual = format(tokenToDate('now/d'), dateFormat);
      const expected = '2018-06-18T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of day', () => {
      const actual = format(tokenToDate('now@d'), dateFormat);
      const expected = '2018-06-18T23:59:59+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the start of week', () => {
      const actual = format(tokenToDate('now/w'), dateFormat);
      const expected = '2018-06-17T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of week', () => {
      const actual = format(tokenToDate('now@w'), dateFormat);
      const expected = '2018-06-23T23:59:59+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the start of the last business week', () => {
      const actual = format(tokenToDate('now-w/bw'), dateFormat);
      const expected = '2018-06-10T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of the last business week', () => {
      const actual = format(tokenToDate('now-w@bw'), dateFormat);
      const expected = '2018-06-15T23:59:59+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the start of this business week', () => {
      const actual = format(tokenToDate('now/bw'), dateFormat);
      const expected = '2018-06-17T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of this business week', () => {
      /**
       * In this case, now is faked to monday, which means that
       * "business week to date" ranges from 17 to {nowFaked}
       */
      const actual = format(tokenToDate('now@bw'), dateFormat);
      const expected = '2018-06-18T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of this business week on weekends', () => {
      /**
       * This case covers the schedule of the "business week to date" preset
       * on weekends, which should range from monday to friday (Spanish locale)
       * or, better said, have a length of 5 days.
       */

      // Saturday, 29 September 2018 9:40:25
      const ft = sinon.useFakeTimers(1538214025000);
      const actual = format(tokenToDate('now@bw'), dateFormat);
      const expected = '2018-09-28T23:59:59+00:00';
      ft.restore();
      expect(actual).toBe(expected);
    });

    it('understands the start of month', () => {
      const actual = format(tokenToDate('now/M'), dateFormat);
      const expected = '2018-06-01T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('understands the end of month', () => {
      const actual = format(tokenToDate('now@M'), dateFormat);
      const expected = '2018-06-30T23:59:59+00:00';
      expect(actual).toBe(expected);
    });
  });

  describe('now with offset and marker', () => {
    it('is understood as startOf', () => {
      const actual = format(tokenToDate('now-2d/d'), dateFormat);
      const expected = '2018-06-16T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('is understood as endOf', () => {
      const actual = format(tokenToDate('now-2d@d'), dateFormat);
      const expected = '2018-06-16T23:59:59+00:00';
      expect(actual).toBe(expected);
    });
  });

  describe('now with two offsets', () => {
    it('is understood with two subtracts', () => {
      const actual = format(tokenToDate('now-2d-2h'), dateFormat);
      const expected = '2018-06-16T06:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('is understood with two adds', () => {
      const actual = format(tokenToDate('now+2d+2h'), dateFormat);
      const expected = '2018-06-20T10:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('is understood with a subtract and an add', () => {
      const actual = format(tokenToDate('now-2d+2h'), dateFormat);
      const expected = '2018-06-16T10:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('is understood with an add and a subtract', () => {
      const actual = format(tokenToDate('now+2d-2h'), dateFormat);
      const expected = '2018-06-20T06:39:07+00:00';
      expect(actual).toBe(expected);
    });
  });

  describe('using a day of the week as a snap', () => {
    // Guide for readers: 2018-06-18 was Monday.

    it('last Friday', () => {
      const actual = format(tokenToDate('now/fri'), dateFormat);
      const expected = '2018-06-15T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('last Tuesday', () => {
      const actual = format(tokenToDate('now/tue'), dateFormat);
      const expected = '2018-06-12T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('last Monday', () => {
      // Since today is Monday, it should snap to today.
      const actual = format(tokenToDate('now/mon'), dateFormat);
      const expected = '2018-06-18T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('next Friday', () => {
      const actual = format(tokenToDate('now@fri'), dateFormat);
      const expected = '2018-06-22T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('next Sunday', () => {
      const actual = format(tokenToDate('now@sun'), dateFormat);
      const expected = '2018-06-24T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('next Monday', () => {
      // Today is Monday, so it should snap to today.
      const actual = format(tokenToDate('now@mon'), dateFormat);
      const expected = '2018-06-18T08:39:07+00:00';
      expect(actual).toBe(expected);
    });

    it('snaps to the start of the day when combined', () => {
      const actual = format(tokenToDate('now-w/mon/d'), dateFormat);
      const expected = '2018-06-11T00:00:00+00:00';
      expect(actual).toBe(expected);
    });

    it('snaps to the end of the day when combined', () => {
      const actual = format(tokenToDate('now-w@fri@d'), dateFormat);
      const expected = '2018-06-15T23:59:59+00:00';
      expect(actual).toBe(expected);
    });
  });

  it('now-1w+3d-6m', () => {
    const actual = tokenToDate('now-1w+3d-6m');
    const delta = (-(7 * 24 * 3600) + 3 * 24 * 3600 - 6 * 60) * 1000;
    expect(actual.getTime()).toBe(nowFaked + delta);
  });

  describe('starting date can be configured', () => {
    it('now', () => {
      const delta = -60 * 60 * 1000;
      const oneHourAgo = new Date(nowFaked + delta);
      const actual = tokenToDate('now', oneHourAgo);
      expect(actual.getTime()).toBe(nowFaked + delta);
    });

    it('now+2w-20m', () => {
      const delta = (-2 * 7 * 24 * 3600 + 20 * 60) * 1000;
      const oneHourAgo = new Date(nowFaked + delta);
      const actual = tokenToDate('now', oneHourAgo);
      expect(actual.getTime()).toBe(nowFaked + delta);
    });
  });
});
