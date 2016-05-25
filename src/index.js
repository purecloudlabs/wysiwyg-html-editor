var Quill = require("quill")

function Editor(target) {
    var quill = new Quill(target);

    this._quill = quill;
}

module.exports = Editor;
