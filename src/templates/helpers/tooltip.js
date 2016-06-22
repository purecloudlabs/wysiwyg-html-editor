"use strict";
var Handlebars = require("handlebars");
var i18n = require("../../i18n/i18n");
module.exports = function (tooltipKey) {
    var safeText = Handlebars.Utils.escapeExpression(i18n.localize(tooltipKey));
    return new Handlebars.SafeString('data-toggle="tooltip" data-placement="top" title="' + safeText + '"');
};
