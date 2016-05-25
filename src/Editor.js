var Quill = require("quill");

function Editor(target, options) {
    var quill = new Quill(target, options);

    this._quill = quill;
}

module.exports = Editor;
