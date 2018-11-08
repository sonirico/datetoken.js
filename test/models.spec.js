const models = require('../dist/models');
const constants = require('../dist/constants');
const chai = require('chai');
const expect = chai.expect;

const Token = models.Token;
const TokenModifier = models.TokenModifier;

const sinon = require('sinon');
const nowFaked = 153840255000; // Mon, 01 Oct 2018 14:03:01 GMT


describe('Token', function () {
    context('removeSnap', function () {
        it('should remove snapshots actually', function () {
          let actual = Token.fromString('now-2d/d');
          expect(actual.isSnapped).to.be.equal(true);
          actual.removeSnap();
          expect(actual.isSnapped).to.be.equal(false);
        })
    })

    context('addModifiers', function () {
        it('should modifiy the token', function () {
          let actual = Token.fromString('now');
          expect(actual.modifiers).to.have.lengthOf(0)
          actual.addModifier(new TokenModifier(constants.Sign.minus, 2, 'w'))
          expect(actual.toString()).to.be.equal('now-2w');
          expect(actual.modifiers).to.have.lengthOf(1)
        })
    })

    context('clearModifiers', function () {
        it('should leave the token unmodified', function () {
          let actual = Token.fromString('now-2w+3m');
          expect(actual.modifiers).to.have.lengthOf(2)
          actual.clearModifiers()
          expect(actual.toString()).to.be.equal('now');
          expect(actual.modifiers).to.have.lengthOf(0)
        })
    })

    context('fromString', function () {
        it('now', function () {
            const actual = Token.fromString('now')
            expect(actual).to.be.an.instanceOf(Token)
            expect(actual.toString()).to.be.equal('now');
            expect(actual.modifiers).to.have.lengthOf(0);
        })

        it('now-1M-2w+5d/d', function () {
            const actual = Token.fromString('now-1M-2w+5d/d');
            expect(actual.toString()).to.be.equal('now-1M-2w+5d/d');
            expect(actual.snapUnit).to.be.equal('d')
            expect(actual.snapTo).to.be.equal('/')
            expect(actual.modifiers).to.have.lengthOf(3)
            const expected = [
                {
                    amount: 1,
                    sign: '-',
                    unit: 'M'
                },
                {
                    amount: 2,
                    sign: '-',
                    unit: 'w'
                },
                {
                    amount: 5,
                    sign: '+',
                    unit: 'd'
                }
            ];

            actual.modifiers.forEach((m, i) => {
                const expectedModifier = expected[i];
                const actualModifier = m;
                expect(expectedModifier.amount).to.be.equal(actualModifier.amount)
                expect(expectedModifier.sign).to.be.equal(actualModifier.sign)
                expect(expectedModifier.unit).to.be.equal(actualModifier.unit)
            })
        })

        it('now-1M-2w+5d@d', function () {
            const actual = Token.fromString('now-1M-2w+5d@d');
            expect(actual.toString()).to.be.equal('now-1M-2w+5d@d');
            expect(actual.snapUnit).to.be.equal('d')
            expect(actual.snapTo).to.be.equal('@')
            expect(actual.modifiers).to.have.lengthOf(3)
            const expected = [
                {
                    amount: 1,
                    sign: '-',
                    unit: 'M'
                },
                {
                    amount: 2,
                    sign: '-',
                    unit: 'w'
                },
                {
                    amount: 5,
                    sign: '+',
                    unit: 'd'
                }
            ];
            actual.modifiers.forEach((m, i) => {
                const expectedModifier = expected[i];
                const actualModifier = m;
                expect(expectedModifier.amount).to.be.equal(actualModifier.amount)
                expect(expectedModifier.sign).to.be.equal(actualModifier.sign)
                expect(expectedModifier.unit).to.be.equal(actualModifier.unit)
            })
        })
    })

    context('toDate', function () {
        beforeEach(function () {
            this.fakeTimer = new sinon.useFakeTimers(nowFaked);
        })

        afterEach(function () {
            this.fakeTimer.restore();
        })

        it('now', function () {
            const actual = Token.fromString('now').toDate()
            expect(actual.getTime()).to.be.equal(nowFaked);
        })

        it('now-1w+3d-6m', function () {
            const actual = Token.fromString('now-1w+3d-6m').toDate()
            const delta = (-(7 * 24 * 3600) + (3 * 24 * 3600) - (6 * 60)) * 1000;
            expect(actual.getTime()).to.be.equal(nowFaked + delta);
        })
    })
})
