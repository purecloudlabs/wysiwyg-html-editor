"use strict";

var Quill = require("quill");

/**
 *  Constructs an Editor (a thin wrapper around QuillJS)
 *  Should use the EditorBuilder to construct one of these
 *  @constructor
 *  @param {HTMLElement} targetEl - the DOM node that will be converted into the WYSIWYG editor
 *  @param {Object} options - the options provided to QuillJS
 */

function Editor(targetEl, options) {
    var quill = new Quill(targetEl, options);

    this.targetEl = targetEl;
    this._quill = quill;
}

/**
 * Returns the contents of the editor as html
 * @returns {String}
 *
 */
Editor.prototype.getHTML = function() {
    var editorContentDiv = this.targetEl.querySelector(".ql-editor");
    if(!editorContentDiv) {
        throw new Error("Couldn't find editor contents");
    }
    return editorContentDiv.innerHTML;
};

module.exports = Editor;
