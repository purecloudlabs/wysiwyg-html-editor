"use strict";
const Handlebars = require("handlebars");
const i18n = require("../../i18n/i18n");
module.exports = function (tooltipKey) {
    const safeText = Handlebars.Utils.escapeExpression(i18n.localize(tooltipKey));
    return new Handlebars.SafeString('data-toggle="tooltip" data-placement="top" data-tooltip-class="tt" title="' + safeText + '"');
};
