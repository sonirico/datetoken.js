import { format } from 'date-fns';
import * as sinon from 'sinon';
import { evalDatetoken, Datetoken } from './evaluator';

const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
const nowFaked = 1529311147000; // => 2018-06-18T08:39:07+00:00
const fakeTimer = sinon.useFakeTimers(nowFaked);

const tests = [
  {
    tz: 'UTC',
    expected: '2018-06-18T08:39:07+00:00',
    token: 'now'
  },
  {
    tz: 'Europe/Madrid',
    expected: '2018-06-18T10:39:07+00:00',
    token: 'now'
  },
  {
    tz: 'Europe/Moscow',
    expected: '2018-06-18T11:39:07+00:00',
    token: 'now'
  },
  {
    tz: 'America/Anguilla',
    expected: '2018-06-18T04:39:07+00:00',
    token: 'now'
  },
];

describe('evaluator.Datetoken', () => {
  for (const test of tests) {
    it(`in ${test.tz}`, () => {
      const datetoken = new Datetoken();
      const actual = datetoken.on(test.tz).eval(test.token).toDate();
      expect(format(actual, dateFormat)).toBe(test.expected)
    });
  }
});
