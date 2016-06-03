"use strict";

var Quill = require("quill");
var EventEmitter = require("eventemitter3");

/**
 *  Constructs an Editor (a thin wrapper around QuillJS)
 *  Should use the Builder to construct one of these
 *  @constructor
 *  @param {HTMLElement} targetEl - the DOM node that will be converted into the WYSIWYG editor
 *  @param {Object} options - the options provided to QuillJS
 */

function Editor(targetEl, options) {
    var quill = new Quill(targetEl, options);
    var emitter = new EventEmitter();

    this.targetEl = targetEl;
    this._quill = quill;
    this._emitter = emitter;

    /**
     * Text change event, fired whenever the contents of the editor have changed
     * @event Editor#text-change
     */

    quill.on("text-change", function () {
        emitter.emit("text-change");
    });
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

/**
 * Replaces the contents of the editor with specified html
 * @param {String} html
 */
Editor.prototype.setHTML = function(html) {
    this._quill.pasteHTML(html);
};

/**
 * Inserts html into the editor
 * @param {String} html
 * @param {number} index - the index (based on text content) to insert the html;
                           defaults to appending html to the end, after the trailing newline
 * @example
 * //Inserted before existing contents
 * editor.insertHTML("HODOR", 0);
 * //Inserted after last line of existing contents
 * editor.insertHTML("HODOR");
 * //Inserted at the end of the last line of existing contents (before trailing newline)
 * editor.insertHTML("HODOR", editor.getLength() - 1);
 */
Editor.prototype.insertHTML = function (html, index) {
    if(!index && index !== 0) {
        index = this.getLength();
    }
    this._quill.pasteHTML(index, html);
};

/**
 * Get the length of the Editor text content
 * @returns {number}
 */

Editor.prototype.getLength = function () {
    return this._quill.getLength();
};

/**
 * Returns an object representing the selection state if the editor is focused, otherwise `null`
 * @param forceFocus if true, the editor will be focused, otherwise it might return `null`
 * @returns {null | Object} Returned object (if any) has two properties, `index` and `length` indicating the start and length of the selection
 */
Editor.prototype.getSelection = function (forceFocus) {
    return this._quill.getSelection(forceFocus);
};

/**
 * See [EventEmitter.on](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)
 */

Editor.prototype.on = function() {
    this._emitter.on.apply(this._emitter, arguments);
};

/**
 * See [EventEmitter.removeListener](https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener)
 */

Editor.prototype.off = function() {
    this._emitter.off.apply(this._emitter, arguments);
};

/**
 * See [EventEmitter.once](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener)
 */

Editor.prototype.once = function() {
    this._emitter.once.apply(this._emitter, arguments);
};

module.exports = Editor;
