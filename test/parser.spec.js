const {tokentodate} = require('../lib/utils/tokentodate');
const format = require('date-fns').format;
const sinon = require('sinon');
const chai = require('chai');

const expect = chai.expect;
const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ'

const nowFaked = 1529311147000;
// 1529311147 => 2018-06-18T08:39:07+00:00

describe('parsers.tokentodate', function() {
    beforeEach(function() {
        this.fakeTimer = new sinon.useFakeTimers(nowFaked);
    });

    afterEach(function() {
        this.fakeTimer.restore();
    });

    describe('now', function() {
        it('is understood', function() {
            expect(tokentodate('now').getTime()).to.be.equal(nowFaked)
        });
    });

    describe('now with offset', function() {
        it('and leaving the amount unset defaults to 1', function () {
            expect(tokentodate('now+s').getTime()).to.be.equal(nowFaked + 1000);
        });

        it('can add seconds', function() {
            expect(tokentodate('now+5s').getTime()).to.be.equal(nowFaked + 5000);
        });

        it('can substract seconds', function() {
            expect(tokentodate('now-5s').getTime()).to.be.equal(nowFaked - 5000);
        });

        it('can add minutes', function() {
            expect(tokentodate('now+5m').getTime()).to.be.equal(nowFaked + (5 * 60 * 1000));
        });

        it('can substract minutes', function() {
            expect(tokentodate('now-5m').getTime()).to.be.equal(nowFaked - (5 * 60 * 1000));
        });

        it('can add hours', function() {
            expect(tokentodate('now+5h').getTime()).to.be.equal(nowFaked + (5 * 60 * 60 * 1000));
        });

        it('can substract hours', function() {
            expect(tokentodate('now-5h').getTime()).to.be.equal(nowFaked - (5 * 60 * 60 * 1000));
        });

        it('can add days', function() {
            expect(tokentodate('now+2d').getTime()).to.be.equal(nowFaked + (2 * 24 * 60 * 60 * 1000));
        });

        it('can substract days', function() {
            expect(tokentodate('now-2d').getTime()).to.be.equal(nowFaked - (2 * 24 * 60 * 60 * 1000));
        });

        it('can add weeks', function() {
            expect(tokentodate('now+1w').getTime()).to.be.equal(nowFaked + (7 * 24 * 60 * 60 * 1000));
        });

        it('can substract weeks', function() {
            expect(tokentodate('now-1w').getTime()).to.be.equal(nowFaked - (7 * 24 * 60 * 60 * 1000));
        });

        it('can add months', function() {
            // 61 = 30 (June) + 31 (July)
            expect(tokentodate('now+2M').getTime()).to.be.equal(nowFaked + (61 * 24 * 60 * 60 * 1000));
        });

        it('can substract months', function() {
            // 61 = 30 (April) + 31 (May)
            expect(tokentodate('now-2M').getTime()).to.be.equal(nowFaked - (61 * 24 * 60 * 60 * 1000));
        });
    });

    describe('now with markers', function() {
        it('understands the start of minute', function() {
            const actual = format(tokentodate('now/m'), dateFormat);
            expect(actual).to.be.equal('2018-06-18T08:39:00+00:00');
        });

        it('understands the end of minute', function() {
            const actual = format(tokentodate('now@m'), dateFormat);
            const expected = '2018-06-18T08:39:59+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the start of hour', function() {
            const actual = format(tokentodate('now/h'), dateFormat);
            const expected = '2018-06-18T08:00:00+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the end of hour', function() {
            const actual = format(tokentodate('now@h'), dateFormat);
            const expected = '2018-06-18T08:59:59+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the start of day', function() {
            const actual = format(tokentodate('now/d'), dateFormat);
            const expected = '2018-06-18T00:00:00+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the end of day', function() {
            const actual = format(tokentodate('now@d'), dateFormat);
            const expected = '2018-06-18T23:59:59+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the start of week', function() {
            const actual = format(tokentodate('now/w'), dateFormat);
            const expected = '2018-06-17T00:00:00+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the end of week', function() {
            const actual = format(tokentodate('now@w'), dateFormat);
            const expected = '2018-06-23T23:59:59+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the start of the last business week', function () {
            const actual = format(tokentodate('now-w/bw'), dateFormat);
            const expected = '2018-06-10T00:00:00+00:00';
            expect(actual).to.be.equal(expected);
        })

        it('understands the end of the last business week', function () {
            const actual = format(tokentodate('now-w@bw'), dateFormat);
            const expected = '2018-06-15T23:59:59+00:00';
            expect(actual).to.be.equal(expected);
        })

        it('understands the start of this business week', function () {
            const actual = format(tokentodate('now/bw'), dateFormat);
            const expected = '2018-06-17T00:00:00+00:00';
            expect(actual).to.be.equal(expected);
        })

        it('understands the end of this business week', function () {
            /**
             * In this case, now is faked to monday, which means that
             * "business week to date" ranges from 17 to {nowFaked}
             */
            const actual = format(tokentodate('now@bw'), dateFormat);
            const expected = '2018-06-18T08:39:07+00:00';
            expect(actual).to.be.equal(expected);
        })

        it('understands the end of this business week on weekends', function () {
            /**
             * This case covers the schedule of the "business week to date" preset
             * on weekends, which should range from monday to friday (on Spain locale)
             * or, better said, have a length of 5 days.
             */

            // Saturday, 29 September 2018 9:40:25
            this.fakeTimer = new sinon.useFakeTimers(1538214025000);
            const actual = format(tokentodate('now@bw'), dateFormat);
            const expected = '2018-09-28T23:59:59+00:00';
            this.fakeTimer.restore()
            expect(actual).to.be.equal(expected);
        })

        it('understands the start of month', function() {
            const actual = format(tokentodate('now/M'), dateFormat);
            const expected = '2018-06-01T00:00:00+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('understands the end of month', function() {
            const actual = format(tokentodate('now@M'), dateFormat);
            const expected = '2018-06-30T23:59:59+00:00';
            expect(actual).to.be.equal(expected);
        });
    });

    describe('now with offset and marker', function() {
        it('is understood as startOf', function() {
            const actual = format(tokentodate('now-2d/d'), dateFormat);
            const expected = '2018-06-16T00:00:00+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('is understood as endOf', function() {
            const actual = format(tokentodate('now-2d@d'), dateFormat);
            const expected = '2018-06-16T23:59:59+00:00';
            expect(actual).to.be.equal(expected);
        });
    });

    describe('now with two offsets', function() {
        it('is understood with two subtracts', function() {
            const actual = format(tokentodate('now-2d-2h'), dateFormat);
            const expected = '2018-06-16T06:39:07+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('is understood with two adds', function() {
            const actual = format(tokentodate('now+2d+2h'), dateFormat);
            const expected = '2018-06-20T10:39:07+00:00';
            expect(actual).to.be.equal(expected);
        });

        it('is understood with a substract and an add', function() {
            const actual = format(tokentodate('now-2d+2h'), dateFormat);
            const expected = ('2018-06-16T10:39:07+00:00');
            expect(actual).to.be.equal(expected);
        });

        it('is understood with an add and a substract', function() {
            const actual = format(tokentodate('now+2d-2h'), dateFormat);
            const expected = '2018-06-20T06:39:07+00:00';
            expect(actual).to.be.equal(expected);
        });
    });
});
