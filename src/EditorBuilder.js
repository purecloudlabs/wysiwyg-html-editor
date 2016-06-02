"use strict";

var Editor = require("./Editor");
var _assign = require("lodash/assign");

var DEFAULT_OPTIONS = {};
var DEFAULT_TOOLBAR_HTML = require("./defaultToolbar.html");

/**
 * A builder that constructs the WYSIWYG editor with a fluent interface;
 * Used because QuillJS (v1.0.0) expects all configuration options upfront, but it's nice to avoid
 *     having that much complexity in a wrapper constructor
 * @constructor
 * @param {String | HTMLElement} target - DOM element, (or CSS selector) to hold the editor
*/
function EditorBuilder(target) {
    //Include the necessary CSS files, if it hasn't been included already
    require("quill/dist/quill.css");

    if(typeof target === "string") {
        target = document.querySelector(target);
    }
    if(!target) {
        throw new Error("Need a target element or selector for the editor");
    }
    this.target = target;
    this.options = _assign({}, DEFAULT_OPTIONS);
}

/**
 * Adds a default toolbar, with preset options; the default toolbar HTML will be inserted into the
 *     specified element and hooked up to the editor
 * @param {String | HTMLElement} toolbarContainer - Element or CSS selector to hold the toolbar
 * @returns {this}
 */
EditorBuilder.prototype.withDefaultToolbar = function (toolbarContainer) {
    ///Include the theme style, if it hasn't been included already
    require("quill/dist/quill.snow.css");

    if(typeof toolbarContainer === "string") {
        toolbarContainer = document.querySelector(toolbarContainer);

        if(!toolbarContainer) {
            throw new Error("No toolbar found based on CSS selector");
        }
    }
    if(!toolbarContainer) {
        toolbarContainer = document.createElement("div");
        this.target.parentElement.insertBefore(toolbarContainer, this.target);
    }

    toolbarContainer.innerHTML = DEFAULT_TOOLBAR_HTML;

    this.options = _assign(this.options, {
        theme: "snow",
        modules: {
            toolbar: toolbarContainer
        }
    });

    return this;
};

EditorBuilder.prototype.withPlaceholderText = function (placeholder) {
    this.options = _assign(this.options, {
        placeholder: placeholder
    });

    return this;
};

/**
 * Builds the editor based on the specified options.
 * @returns {Editor}
 */

EditorBuilder.prototype.build = function () {
    return new Editor(this.target, this.options);
};

module.exports = EditorBuilder;
