"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
function tokenToDate(token, at) {
    return models_1.Token.fromString(token, at).toDate();
}
exports.tokenToDate = tokenToDate;
