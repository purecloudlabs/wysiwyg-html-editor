var Quill = require("quilljs")

function Editor(target) {
    var quill = new Quill(target);

    this._quill = quill;
}

module.exports = Editor;
