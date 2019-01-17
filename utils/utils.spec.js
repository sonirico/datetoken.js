"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var sinon = require("sinon");
var utils_1 = require("./utils");
var dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
var nowFaked = 1529311147000; // => 2018-06-18T08:39:07+00:00
var fakeTimer = sinon.useFakeTimers(nowFaked);
describe('utils.tokenToDate', function () {
    describe('now', function () {
        it('is understood', function () {
            expect(utils_1.tokenToDate('now').getTime()).toBe(nowFaked);
        });
    });
    describe('now with offset', function () {
        it('and leaving the amount unset defaults to 1', function () {
            expect(utils_1.tokenToDate('now+s').getTime()).toBe(nowFaked + 1000);
        });
        it('can add seconds', function () {
            expect(utils_1.tokenToDate('now+5s').getTime()).toBe(nowFaked + 5000);
        });
        it('can subtract seconds', function () {
            expect(utils_1.tokenToDate('now-5s').getTime()).toBe(nowFaked - 5000);
        });
        it('can add minutes', function () {
            expect(utils_1.tokenToDate('now+5m').getTime()).toBe(nowFaked + 5 * 60 * 1000);
        });
        it('can subtract minutes', function () {
            expect(utils_1.tokenToDate('now-5m').getTime()).toBe(nowFaked - 5 * 60 * 1000);
        });
        it('can add hours', function () {
            expect(utils_1.tokenToDate('now+5h').getTime()).toBe(nowFaked + 5 * 60 * 60 * 1000);
        });
        it('can subtract hours', function () {
            expect(utils_1.tokenToDate('now-5h').getTime()).toBe(nowFaked - 5 * 60 * 60 * 1000);
        });
        it('can add days', function () {
            expect(utils_1.tokenToDate('now+2d').getTime()).toBe(nowFaked + 2 * 24 * 60 * 60 * 1000);
        });
        it('can subtract days', function () {
            expect(utils_1.tokenToDate('now-2d').getTime()).toBe(nowFaked - 2 * 24 * 60 * 60 * 1000);
        });
        it('can add weeks', function () {
            expect(utils_1.tokenToDate('now+1w').getTime()).toBe(nowFaked + 7 * 24 * 60 * 60 * 1000);
        });
        it('can subtract weeks', function () {
            expect(utils_1.tokenToDate('now-1w').getTime()).toBe(nowFaked - 7 * 24 * 60 * 60 * 1000);
        });
        it('can add months', function () {
            // 61 = 30 (June) + 31 (July)
            expect(utils_1.tokenToDate('now+2M').getTime()).toBe(nowFaked + 61 * 24 * 60 * 60 * 1000);
        });
        it('can subtract months', function () {
            // 61 = 30 (April) + 31 (May)
            expect(utils_1.tokenToDate('now-2M').getTime()).toBe(nowFaked - 61 * 24 * 60 * 60 * 1000);
        });
    });
    describe('now with markers', function () {
        it('understands the start of minute', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now/m'), dateFormat);
            expect(actual).toBe('2018-06-18T08:39:00+00:00');
        });
        it('understands the end of minute', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now@m'), dateFormat);
            var expected = '2018-06-18T08:39:59+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the start of hour', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now/h'), dateFormat);
            var expected = '2018-06-18T08:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of hour', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now@h'), dateFormat);
            var expected = '2018-06-18T08:59:59+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the start of day', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now/d'), dateFormat);
            var expected = '2018-06-18T00:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of day', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now@d'), dateFormat);
            var expected = '2018-06-18T23:59:59+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the start of week', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now/w'), dateFormat);
            var expected = '2018-06-17T00:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of week', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now@w'), dateFormat);
            var expected = '2018-06-23T23:59:59+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the start of the last business week', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now-w/bw'), dateFormat);
            var expected = '2018-06-10T00:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of the last business week', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now-w@bw'), dateFormat);
            var expected = '2018-06-15T23:59:59+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the start of this business week', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now/bw'), dateFormat);
            var expected = '2018-06-17T00:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of this business week', function () {
            /**
             * In this case, now is faked to monday, which means that
             * "business week to date" ranges from 17 to {nowFaked}
             */
            var actual = date_fns_1.format(utils_1.tokenToDate('now@bw'), dateFormat);
            var expected = '2018-06-18T08:39:07+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of this business week on weekends', function () {
            /**
             * This case covers the schedule of the "business week to date" preset
             * on weekends, which should range from monday to friday (Spanish locale)
             * or, better said, have a length of 5 days.
             */
            // Saturday, 29 September 2018 9:40:25
            var ft = sinon.useFakeTimers(1538214025000);
            var actual = date_fns_1.format(utils_1.tokenToDate('now@bw'), dateFormat);
            var expected = '2018-09-28T23:59:59+00:00';
            ft.restore();
            expect(actual).toBe(expected);
        });
        it('understands the start of month', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now/M'), dateFormat);
            var expected = '2018-06-01T00:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('understands the end of month', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now@M'), dateFormat);
            var expected = '2018-06-30T23:59:59+00:00';
            expect(actual).toBe(expected);
        });
    });
    describe('now with offset and marker', function () {
        it('is understood as startOf', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now-2d/d'), dateFormat);
            var expected = '2018-06-16T00:00:00+00:00';
            expect(actual).toBe(expected);
        });
        it('is understood as endOf', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now-2d@d'), dateFormat);
            var expected = '2018-06-16T23:59:59+00:00';
            expect(actual).toBe(expected);
        });
    });
    describe('now with two offsets', function () {
        it('is understood with two subtracts', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now-2d-2h'), dateFormat);
            var expected = '2018-06-16T06:39:07+00:00';
            expect(actual).toBe(expected);
        });
        it('is understood with two adds', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now+2d+2h'), dateFormat);
            var expected = '2018-06-20T10:39:07+00:00';
            expect(actual).toBe(expected);
        });
        it('is understood with a subtract and an add', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now-2d+2h'), dateFormat);
            var expected = '2018-06-16T10:39:07+00:00';
            expect(actual).toBe(expected);
        });
        it('is understood with an add and a subtract', function () {
            var actual = date_fns_1.format(utils_1.tokenToDate('now+2d-2h'), dateFormat);
            var expected = '2018-06-20T06:39:07+00:00';
            expect(actual).toBe(expected);
        });
    });
    it('now-1w+3d-6m', function () {
        var actual = utils_1.tokenToDate('now-1w+3d-6m');
        var delta = (-(7 * 24 * 3600) + 3 * 24 * 3600 - 6 * 60) * 1000;
        expect(actual.getTime()).toBe(nowFaked + delta);
    });
    describe('starting date can be configured', function () {
        it('now', function () {
            var delta = -60 * 60 * 1000;
            var oneHourAgo = new Date(nowFaked + delta);
            var actual = utils_1.tokenToDate('now', oneHourAgo);
            expect(actual.getTime()).toBe(nowFaked + delta);
        });
        it('now+2w-20m', function () {
            var delta = (-2 * 7 * 24 * 3600 + 20 * 60) * 1000;
            var oneHourAgo = new Date(nowFaked + delta);
            var actual = utils_1.tokenToDate('now', oneHourAgo);
            expect(actual.getTime()).toBe(nowFaked + delta);
        });
    });
});
