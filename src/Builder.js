"use strict";

const Editor = require("./Editor");
const _assign = require("lodash/assign");
const i18n = require("./i18n/i18n");

const DEFAULT_OPTIONS = {};
const DEFAULT_TOOLBAR_TEMPLATE = require("./templates/defaultToolbar.hbs");

/**
 * A builder that constructs the WYSIWYG editor with a fluent interface;
 * Used because QuillJS (v1.0.0) expects all configuration options upfront, but it's nice to avoid
 *     having that much complexity in a wrapper constructor
 * @constructor
 * @param {String | HTMLElement} target - DOM element, (or CSS selector) to hold the editor
*/
function Builder(target) {
    //Include the necessary CSS files, if it hasn't been included already
    require("quill/dist/quill.snow.css"); //quill.snow.css includes quill.core.css as well

    if(typeof target === "string") {
        target = document.querySelector(target);
    }
    if(!target) {
        throw new Error("Need a target element or selector for the editor");
    }

    this.target = target;
    this.options = _assign({bounds: target}, DEFAULT_OPTIONS);
}

/**
 * Adds a default toolbar, with preset options; the default toolbar HTML will be inserted into the
 *     specified element and hooked up to the editor
 * @param {String | HTMLElement} toolbarContainer - Element or CSS selector to hold the toolbar
 * @param {String} locale - The locale, used to translate tooltips for the default toolbar
 * @returns {this}
 */
Builder.prototype.withDefaultToolbar = function (toolbarContainer, locale) {
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
    i18n.setLocale(locale);
    toolbarContainer.innerHTML = DEFAULT_TOOLBAR_TEMPLATE({});

    this.options = _assign(this.options, {
        theme: "snow",
        modules: {
            toolbar: toolbarContainer
        }
    });

    return this;
};

/**
 * Adds placeholder text to display when the text editor is empty
 * @param {String} placeholder
 * @returns {this}
 */

Builder.prototype.withPlaceholderText = function (placeholder) {
    this.options = _assign(this.options, {
        placeholder: placeholder
    });

    return this;
};

/**
 * Builds the editor based on the specified options.
 * @returns {Editor}
 */

Builder.prototype.build = function () {
    return new Editor(this.target, this.options);
};

module.exports = Builder;
