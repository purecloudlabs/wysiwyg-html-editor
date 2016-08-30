"use strict";
/*
 * The boilerplate below is being used to extend the ES6 quill class for Inline so that us can properly be bundled with uglify
 * TODO - remove this when uglify supports ES6
 *

 "use strict";

 var Quill = require("quill");
 var Inline = Quill.import("blots/inline");

 class Placeholder extends Inline {
    static create(value) {
        var node = super.create(value);
        node.setAttribute("data-placeholder", "true");
        return node;
    }

    static formats() {
        return true;
    }
}
 Placeholder.className = "placeholder";
 Placeholder.tagName = "SPAN";
 Placeholder.blotName = "placeholder";

 module.exports = Placeholder;
 *
 *
 *
 */
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Quill = require("quill");
var Inline = Quill.import("blots/inline");

var Placeholder = function (_Inline) {
    _inherits(Placeholder, _Inline);

    function Placeholder() {
        _classCallCheck(this, Placeholder);

        return _possibleConstructorReturn(this, (Placeholder.__proto__ || Object.getPrototypeOf(Placeholder)).apply(this, arguments));
    }

    _createClass(Placeholder, null, [{
        key: "create",
        value: function create(value) {
            var node = _get(Placeholder.__proto__ || Object.getPrototypeOf(Placeholder), "create", this).call(this, value);
            node.setAttribute("data-placeholder", "true");
            return node;
        }
    }, {
        key: "formats",
        value: function formats() {
            return true;
        }
    }]);

    return Placeholder;
}(Inline);

Placeholder.className = "placeholder";
Placeholder.tagName = "SPAN";
Placeholder.blotName = "placeholder";

module.exports = Placeholder;