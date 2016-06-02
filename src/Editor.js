"use strict";

var Quill = require("quill");
var EventEmitter = require("eventemitter3");

/**
 *  Constructs an Editor (a thin wrapper around QuillJS)
 *  Should use the EditorBuilder to construct one of these
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
