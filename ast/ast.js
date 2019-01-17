"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateFn = require("date-fns");
var token_1 = require("../token");
var NowExpression = /** @class */ (function () {
    function NowExpression(token) {
        this.token = token;
    }
    NowExpression.prototype.operate = function (date) {
        return date;
    };
    NowExpression.prototype.toString = function () {
        return this.token.literal;
    };
    return NowExpression;
}());
exports.NowExpression = NowExpression;
var ModifierExpression = /** @class */ (function () {
    function ModifierExpression(token, amount, operator, modifier) {
        if (amount === void 0) { amount = 1; }
        this.token = token;
        this.amount = amount;
        this.operator = operator;
        this.modifier = modifier;
    }
    ModifierExpression.prototype.operate = function (date) {
        // Lazy enough for not to type nested objects
        switch (this.operator) {
            case token_1.TokenType.PLUS:
                switch (this.modifier) {
                    case 's':
                        return dateFn.addSeconds(date, this.amount);
                    case 'm':
                        return dateFn.addMinutes(date, this.amount);
                    case 'h':
                        return dateFn.addHours(date, this.amount);
                    case 'd':
                        return dateFn.addDays(date, this.amount);
                    case 'w':
                        return dateFn.addWeeks(date, this.amount);
                    case 'M':
                        return dateFn.addMonths(date, this.amount);
                }
                break;
            case token_1.TokenType.MINUS:
                switch (this.modifier) {
                    case 's':
                        return dateFn.subSeconds(date, this.amount);
                    case 'm':
                        return dateFn.subMinutes(date, this.amount);
                    case 'h':
                        return dateFn.subHours(date, this.amount);
                    case 'd':
                        return dateFn.subDays(date, this.amount);
                    case 'w':
                        return dateFn.subWeeks(date, this.amount);
                    case 'M':
                        return dateFn.subMonths(date, this.amount);
                }
                break;
        }
        return date;
    };
    ModifierExpression.prototype.toString = function () {
        return "" + this.operator + this.amount + this.modifier;
    };
    return ModifierExpression;
}());
exports.ModifierExpression = ModifierExpression;
var SnapExpression = /** @class */ (function () {
    function SnapExpression(token, modifier, operator) {
        this.token = token;
        this.modifier = modifier;
        this.operator = operator;
    }
    SnapExpression.prototype.operate = function (date) {
        // Lazy enough for not to type nested objects
        switch (this.operator) {
            case token_1.TokenType.SLASH:
                switch (this.modifier) {
                    case 's':
                        return dateFn.startOfSecond(date);
                    case 'm':
                        return dateFn.startOfMinute(date);
                    case 'h':
                        return dateFn.startOfHour(date);
                    case 'd':
                        return dateFn.startOfDay(date);
                    case 'w':
                    case 'bw':
                        return dateFn.startOfWeek(date);
                    case 'M':
                        return dateFn.startOfMonth(date);
                }
                break;
            case token_1.TokenType.AT:
                switch (this.modifier) {
                    case 's':
                        return dateFn.endOfSecond(date);
                    case 'm':
                        return dateFn.endOfMinute(date);
                    case 'h':
                        return dateFn.endOfHour(date);
                    case 'd':
                        return dateFn.endOfDay(date);
                    case 'w':
                        return dateFn.endOfWeek(date);
                    case 'M':
                        return dateFn.endOfMonth(date);
                    case 'bw': {
                        if (dateFn.isThisWeek(date) && !dateFn.isWeekend(date)) {
                            return date;
                        }
                        return dateFn.endOfDay(dateFn.addDays(dateFn.startOfWeek(date), 5));
                    }
                }
                break;
        }
        return date;
    };
    SnapExpression.prototype.toString = function () {
        return "" + this.operator + this.modifier;
    };
    return SnapExpression;
}());
exports.SnapExpression = SnapExpression;
var AmountModifiers;
(function (AmountModifiers) {
    var values = ['s', 'm', 'h', 'd', 'w', 'M'];
    AmountModifiers.valuesString = "(" + values.map(function (v) { return "\"" + v + "\""; }).join(',') + ")";
    function checkModifier(modifier) {
        return values.includes(modifier);
    }
    AmountModifiers.checkModifier = checkModifier;
})(AmountModifiers = exports.AmountModifiers || (exports.AmountModifiers = {}));
var SnapModifiers;
(function (SnapModifiers) {
    var values = ['s', 'm', 'h', 'd', 'w', 'bw', 'M'];
    SnapModifiers.valuesString = "(" + values.map(function (v) { return "\"" + v + "\""; }).join(',') + ")";
    function checkModifier(modifier) {
        return values.includes(modifier);
    }
    SnapModifiers.checkModifier = checkModifier;
})(SnapModifiers = exports.SnapModifiers || (exports.SnapModifiers = {}));
function newNowExpression() {
    return new NowExpression(new token_1.Token(token_1.TokenType.NOW, 'now'));
}
exports.newNowExpression = newNowExpression;
