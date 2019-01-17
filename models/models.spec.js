"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var sinon = require("sinon");
var ast_1 = require("../ast");
var models_1 = require("../models");
var token_1 = require("../token");
var dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
var nowFaked = 1529311147000;
// 1529311147 => 2018-06-18T08:39:07+00:00
var fakeTimer = sinon.useFakeTimers(nowFaked);
describe('Token model', function () {
    it('toString()', function () {
        var model = new models_1.Token([
            new ast_1.NowExpression(new token_1.Token(token_1.TokenType.NOW, 'now')),
            new ast_1.ModifierExpression(new token_1.Token(token_1.TokenType.PLUS, '+'), 2, '+', 'h'),
            new ast_1.ModifierExpression(new token_1.Token(token_1.TokenType.MINUS, '-'), 1, '-', 's'),
            new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.SLASH, '/'), 'bw', '/'),
            new ast_1.ModifierExpression(new token_1.Token(token_1.TokenType.MINUS, '-'), 99, '-', 'M'),
            new ast_1.ModifierExpression(new token_1.Token(token_1.TokenType.MINUS, '-'), 2, '-', 'm'),
            new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.AT, '@'), 'd', '@'),
        ]);
        expect(model.toString()).toBe('now+2h-1s/bw-99M-2m@d');
        expect(model.isSnapped).toBeTruthy();
        expect(model.isModified).toBeTruthy();
    });
    it('<now> toDate()', function () {
        var model = new models_1.Token([new ast_1.NowExpression(new token_1.Token(token_1.TokenType.NOW, 'now'))]);
        expect(model.isSnapped).toBeFalsy();
        expect(model.isModified).toBeFalsy();
        expect(model.toString()).toBe('now');
        expect(model.toDate().getTime()).toBe(nowFaked);
    });
    it('<now/d> toDate()', function () {
        var model = new models_1.Token([
            new ast_1.NowExpression(new token_1.Token(token_1.TokenType.NOW, 'now')),
            new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.SLASH, '/'), 'd', '/'),
        ]);
        expect(model.isSnapped).toBeTruthy();
        expect(model.isModified).toBeFalsy();
        expect(model.toString()).toBe('now/d');
        expect(date_fns_1.format(model.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
    });
    it('<now/d@d/d@d> toDate()', function () {
        var model = new models_1.Token([
            new ast_1.NowExpression(new token_1.Token(token_1.TokenType.NOW, 'now')),
            new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.SLASH, '/'), 'd', '/'),
            new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.AT, '@'), 'd', '@'),
            new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.SLASH, '/'), 'd', '/'),
        ]);
        expect(model.isSnapped).toBeTruthy();
        expect(model.isModified).toBeFalsy();
        expect(model.toString()).toBe('now/d@d/d');
        expect(date_fns_1.format(model.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
    });
    it("<+5s>, 'now' is optional, only one amount modifier", function () {
        var model = new models_1.Token([new ast_1.ModifierExpression(new token_1.Token(token_1.TokenType.PLUS, '+'), 5, '+', 's')]);
        expect(model.isSnapped).toBeFalsy();
        expect(model.isModified).toBeTruthy();
        expect(model.toString()).toBe('+5s');
        expect(model.toDate().getTime()).toBe(nowFaked + 5 * 1000);
        expect(date_fns_1.format(model.toDate().getTime(), dateFormat)).toBe('2018-06-18T08:39:12+00:00');
    });
    it("</d>, 'now' is optional, only one snap modifier", function () {
        var model = new models_1.Token([new ast_1.SnapExpression(new token_1.Token(token_1.TokenType.SLASH, '/'), 'd', '/')]);
        expect(model.toString()).toBe('/d');
        expect(date_fns_1.format(model.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
    });
    describe('fromString()', function () {
        it('now is optional', function () {
            var token = models_1.Token.fromString('/d');
            expect(token.isSnapped).toBeTruthy();
            expect(token.isModified).toBeFalsy();
            expect(token.nodes).toHaveLength(1);
            expect(date_fns_1.format(token.toDate(), dateFormat)).toBe('2018-06-18T00:00:00+00:00');
        });
        it('starting date can be configured', function () {
            var oneHourAgo = new Date(nowFaked - 1000 * 60 * 60);
            var model = models_1.Token.fromString('now', oneHourAgo);
            expect(model.isSnapped).toBeFalsy();
            expect(model.isModified).toBeFalsy();
            expect(date_fns_1.format(model.toDate().getTime(), dateFormat)).toBe('2018-06-18T07:39:07+00:00');
        });
    });
});
