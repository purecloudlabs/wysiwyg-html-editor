var Editor = require("./Editor");
var _assign = require("lodash/assign");


var DEFAULT_OPTIONS = {};
var DEFAULT_TOOLBAR_HTML = require("./defaultToolbar.html");

/*
   A builder that constructs the WYSIWYG editor; allowing options like the toolbar to be specified
   Used because QuillJS (v1.0.0) expects all configuration options upfront, but it's nice to avoid
       having that much complexity in a wrapper constructor
   Uses a fluent interface
*/
function EditorBuilder(target) {
    this.target = target;
    this.options = _assign({}, DEFAULT_OPTIONS);
}

EditorBuilder.prototype.withDefaultToolbar = function (toolbarContainer) {
    if(typeof toolbarContainer === "string") {
        toolbarContainer = document.querySelector(toolbarContainer);
    }
    if(!toolbarContainer) {
        throw new Error("Need a toolbar container element or a selector");
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

EditorBuilder.prototype.build = function () {
    return new Editor(this.target, this.options);
}

module.exports = EditorBuilder;
