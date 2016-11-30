(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HTMLEditor"] = factory();
	else
		root["HTMLEditor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Builder = __webpack_require__(1);
	var Quill = __webpack_require__(3);
	__webpack_require__(95);
	
	module.exports = {
	    Builder: Builder,
	    _Quill: Quill
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Editor = __webpack_require__(2);
	var _assign = __webpack_require__(9);
	var i18n = __webpack_require__(49);
	
	var DEFAULT_OPTIONS = {};
	var DEFAULT_TOOLBAR_TEMPLATE = __webpack_require__(66);
	
	/**
	 * A builder that constructs the WYSIWYG editor with a fluent interface;
	 * Used because QuillJS (v1.0.0) expects all configuration options upfront, but it's nice to avoid
	 *     having that much complexity in a wrapper constructor
	 * @constructor
	 * @param {String | HTMLElement} target - DOM element, (or CSS selector) to hold the editor
	*/
	function Builder(target) {
	    //Include the necessary CSS files, if it hasn't been included already
	    __webpack_require__(89);
	
	    if (typeof target === "string") {
	        target = document.querySelector(target);
	    }
	    if (!target) {
	        throw new Error("Need a target element or selector for the editor");
	    }
	    this.target = target;
	    this.options = _assign({}, DEFAULT_OPTIONS);
	}
	
	/**
	 * Adds a default toolbar, with preset options; the default toolbar HTML will be inserted into the
	 *     specified element and hooked up to the editor
	 * @param {String | HTMLElement} toolbarContainer - Element or CSS selector to hold the toolbar
	 * @param {String} locale - The locale, used to translate tooltips for the default toolbar
	 * @returns {this}
	 */
	Builder.prototype.withDefaultToolbar = function (toolbarContainer, locale) {
	    ///Include the theme style, if it hasn't been included already
	    __webpack_require__(93);
	    if (typeof toolbarContainer === "string") {
	        toolbarContainer = document.querySelector(toolbarContainer);
	
	        if (!toolbarContainer) {
	            throw new Error("No toolbar found based on CSS selector");
	        }
	    }
	    if (!toolbarContainer) {
	        toolbarContainer = document.createElement("div");
	        this.target.parentElement.insertBefore(toolbarContainer, this.target);
	    }
	    i18n.setLocale(locale);
	    toolbarContainer.innerHTML = DEFAULT_TOOLBAR_TEMPLATE({});
	
	    this.options = _assign(this.options, {
	        bounds: document.body,
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Quill = __webpack_require__(3);
	var EventEmitter = __webpack_require__(8);
	
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
	
	    // Override the default link tooltip logic to prepend `https://`
	    var Link = Quill.import('formats/link');
	    Link.sanitize = function (url) {
	        // modify url if desired
	        var urlStartsWithHttp = url.indexOf("http") === 0;
	        if (!urlStartsWithHttp) {
	            url = "https://" + url;
	        }
	        return url;
	    };
	}
	
	/**
	 * Returns the contents of the editor as html
	 * @returns {String}
	 *
	 */
	Editor.prototype.getHTML = function () {
	    var editorContentDiv = this.targetEl.querySelector(".ql-editor");
	    if (!editorContentDiv) {
	        throw new Error("Couldn't find editor contents");
	    }
	    return editorContentDiv.innerHTML;
	};
	
	/**
	 * Replaces the contents of the editor with specified html
	 * @param {String} html
	 */
	Editor.prototype.setHTML = function (html) {
	    html = html || ""; //Cooerce undefined or null to empty string to prevent error from pasteHTML
	    this._quill.pasteHTML(html);
	};
	
	/**
	 * Removes formatting from a beginning at an index
	 */
	Editor.prototype.removeFormat = function (index, length) {
	    this._quill.removeFormat(index, length);
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
	    if (!index && index !== 0) {
	        index = this.getLength();
	    }
	    this._quill.pasteHTML(index, html);
	};
	
	/**
	 * Inserts text with an optional formatting parameter into the Editor.  This is useful when creating spans or other blots
	 * that have a specific purpose and formatting
	 *
	 ```
	 editor.insertText("COMPANY_NAME", "placeholder", editor.getSelection(true).index);
	 ```
	 * This will wrap the string in inputString in the tag and style/attribute specified in the placeholder blot
	 * see: http://quilljs.com/docs/api/#content
	 *
	 * @param text The String to be wrapped by the custom wrapper
	 * @param name The name of the blot or object with formats to use for wrapping the text in the first parameter.
	 * @param index the point at which the formatting wrapped text should be inserted.
	 */
	Editor.prototype.insertText = function (text, name, index) {
	    if (!index && index !== 0) {
	        index = this.getLength();
	    }
	
	    this._quill.insertText(index, text, name, true);
	};
	
	/**
	 * Deletes text from the editor based on the passed in index and length
	 * @param index start index
	 * @param length length of deletion
	 */
	Editor.prototype.deleteText = function (index, length) {
	    this._quill.deleteText(index, length);
	};
	
	/**
	 * Get the contents of the editor with the html stripped out
	 * @returns {String}
	 */
	Editor.prototype.getText = function () {
	    return this._quill.getText();
	};
	
	/**
	 * Get the length of the Editor text content
	 * @returns {number}
	 */
	
	Editor.prototype.getLength = function () {
	    return this._quill.getLength();
	};
	
	/**
	 * Returns true if the editor is empty
	 * @returns {Boolean}
	 */
	Editor.prototype.isBlank = function () {
	    return this._quill.editor.isBlank();
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
	 * Set the selection to the index and through the length specified
	 * @param index the beginning index of the selection
	 * @param length the length of the selection range
	 * @returns {*}
	 */
	Editor.prototype.setSelection = function (index, length) {
	    return this._quill.setSelection(index, length);
	};
	
	/**
	 * See [EventEmitter.on](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)
	 */
	
	Editor.prototype.on = function () {
	    this._emitter.on.apply(this._emitter, arguments);
	};
	
	/**
	 * See [EventEmitter.removeListener](https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener)
	 */
	
	Editor.prototype.off = function () {
	    this._emitter.off.apply(this._emitter, arguments);
	};
	
	/**
	 * See [EventEmitter.once](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener)
	 */
	
	Editor.prototype.once = function () {
	    this._emitter.once.apply(this._emitter, arguments);
	};
	
	module.exports = Editor;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * Quill Editor v1.0.0
	 * https://quilljs.com/
	 * Copyright (c) 2014, Jason Chen
	 * Copyright (c) 2013, salesforce.com
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["Quill"] = factory();
		else
			root["Quill"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	
	
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		module.exports = __webpack_require__(1);
	
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		var _core = __webpack_require__(2);
	
		var _core2 = _interopRequireDefault(_core);
	
		var _align = __webpack_require__(46);
	
		var _direction = __webpack_require__(49);
	
		var _indent = __webpack_require__(54);
	
		var _blockquote = __webpack_require__(55);
	
		var _blockquote2 = _interopRequireDefault(_blockquote);
	
		var _header = __webpack_require__(56);
	
		var _header2 = _interopRequireDefault(_header);
	
		var _list = __webpack_require__(57);
	
		var _list2 = _interopRequireDefault(_list);
	
		var _background = __webpack_require__(47);
	
		var _color = __webpack_require__(48);
	
		var _font = __webpack_require__(50);
	
		var _size = __webpack_require__(51);
	
		var _bold = __webpack_require__(58);
	
		var _bold2 = _interopRequireDefault(_bold);
	
		var _italic = __webpack_require__(59);
	
		var _italic2 = _interopRequireDefault(_italic);
	
		var _link = __webpack_require__(60);
	
		var _link2 = _interopRequireDefault(_link);
	
		var _script = __webpack_require__(61);
	
		var _script2 = _interopRequireDefault(_script);
	
		var _strike = __webpack_require__(62);
	
		var _strike2 = _interopRequireDefault(_strike);
	
		var _underline = __webpack_require__(63);
	
		var _underline2 = _interopRequireDefault(_underline);
	
		var _image = __webpack_require__(64);
	
		var _image2 = _interopRequireDefault(_image);
	
		var _video = __webpack_require__(65);
	
		var _video2 = _interopRequireDefault(_video);
	
		var _code = __webpack_require__(32);
	
		var _code2 = _interopRequireDefault(_code);
	
		var _formula = __webpack_require__(66);
	
		var _formula2 = _interopRequireDefault(_formula);
	
		var _syntax = __webpack_require__(67);
	
		var _syntax2 = _interopRequireDefault(_syntax);
	
		var _toolbar = __webpack_require__(68);
	
		var _toolbar2 = _interopRequireDefault(_toolbar);
	
		var _icons = __webpack_require__(69);
	
		var _icons2 = _interopRequireDefault(_icons);
	
		var _picker = __webpack_require__(101);
	
		var _picker2 = _interopRequireDefault(_picker);
	
		var _colorPicker = __webpack_require__(103);
	
		var _colorPicker2 = _interopRequireDefault(_colorPicker);
	
		var _iconPicker = __webpack_require__(104);
	
		var _iconPicker2 = _interopRequireDefault(_iconPicker);
	
		var _tooltip = __webpack_require__(105);
	
		var _tooltip2 = _interopRequireDefault(_tooltip);
	
		var _bubble = __webpack_require__(106);
	
		var _bubble2 = _interopRequireDefault(_bubble);
	
		var _snow = __webpack_require__(108);
	
		var _snow2 = _interopRequireDefault(_snow);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		_core2.default.register({
		  'attributors/class/align': _align.AlignClass,
		  'attributors/class/background': _background.BackgroundClass,
		  'attributors/class/color': _color.ColorClass,
		  'attributors/class/direction': _direction.DirectionClass,
		  'attributors/class/font': _font.FontClass,
		  'attributors/class/size': _size.SizeClass,
	
		  'attributors/style/align': _align.AlignStyle,
		  'attributors/style/background': _background.BackgroundStyle,
		  'attributors/style/color': _color.ColorStyle,
		  'attributors/style/direction': _direction.DirectionStyle,
		  'attributors/style/font': _font.FontStyle,
		  'attributors/style/size': _size.SizeStyle
		}, true);
	
		_core2.default.register({
		  'formats/align': _align.AlignClass,
		  'formats/direction': _direction.DirectionClass,
		  'formats/indent': _indent.IndentClass,
	
		  'formats/background': _background.BackgroundStyle,
		  'formats/color': _color.ColorStyle,
		  'formats/font': _font.FontClass,
		  'formats/size': _size.SizeClass,
	
		  'formats/blockquote': _blockquote2.default,
		  'formats/code-block': _code2.default,
		  'formats/header': _header2.default,
		  'formats/list': _list2.default,
	
		  'formats/bold': _bold2.default,
		  'formats/code': _code.Code,
		  'formats/italic': _italic2.default,
		  'formats/link': _link2.default,
		  'formats/script': _script2.default,
		  'formats/strike': _strike2.default,
		  'formats/underline': _underline2.default,
	
		  'formats/image': _image2.default,
		  'formats/video': _video2.default,
	
		  'formats/list/item': _list.ListItem,
	
		  'modules/formula': _formula2.default,
		  'modules/syntax': _syntax2.default,
		  'modules/toolbar': _toolbar2.default,
	
		  'themes/bubble': _bubble2.default,
		  'themes/snow': _snow2.default,
	
		  'ui/icons': _icons2.default,
		  'ui/picker': _picker2.default,
		  'ui/icon-picker': _iconPicker2.default,
		  'ui/color-picker': _colorPicker2.default,
		  'ui/tooltip': _tooltip2.default
		}, true);
	
		module.exports = _core2.default;
	
	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		var _break = __webpack_require__(34);
	
		var _break2 = _interopRequireDefault(_break);
	
		var _container = __webpack_require__(43);
	
		var _container2 = _interopRequireDefault(_container);
	
		var _cursor = __webpack_require__(38);
	
		var _cursor2 = _interopRequireDefault(_cursor);
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		var _scroll = __webpack_require__(44);
	
		var _scroll2 = _interopRequireDefault(_scroll);
	
		var _text = __webpack_require__(37);
	
		var _text2 = _interopRequireDefault(_text);
	
		var _clipboard = __webpack_require__(45);
	
		var _clipboard2 = _interopRequireDefault(_clipboard);
	
		var _history = __webpack_require__(52);
	
		var _history2 = _interopRequireDefault(_history);
	
		var _keyboard = __webpack_require__(53);
	
		var _keyboard2 = _interopRequireDefault(_keyboard);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		_quill2.default.register({
		  'blots/block': _block2.default,
		  'blots/block/embed': _block.BlockEmbed,
		  'blots/break': _break2.default,
		  'blots/container': _container2.default,
		  'blots/cursor': _cursor2.default,
		  'blots/embed': _embed2.default,
		  'blots/inline': _inline2.default,
		  'blots/scroll': _scroll2.default,
		  'blots/text': _text2.default,
	
		  'modules/clipboard': _clipboard2.default,
		  'modules/history': _history2.default,
		  'modules/keyboard': _keyboard2.default
		});
	
		_parchment2.default.register(_block2.default, _break2.default, _cursor2.default, _inline2.default, _scroll2.default, _text2.default);
	
		module.exports = _quill2.default;
	
	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var container_1 = __webpack_require__(4);
		var format_1 = __webpack_require__(8);
		var leaf_1 = __webpack_require__(13);
		var scroll_1 = __webpack_require__(14);
		var inline_1 = __webpack_require__(15);
		var block_1 = __webpack_require__(16);
		var embed_1 = __webpack_require__(17);
		var text_1 = __webpack_require__(18);
		var attributor_1 = __webpack_require__(9);
		var class_1 = __webpack_require__(11);
		var style_1 = __webpack_require__(12);
		var store_1 = __webpack_require__(10);
		var Registry = __webpack_require__(7);
		var Parchment = {
		    Scope: Registry.Scope,
		    create: Registry.create,
		    find: Registry.find,
		    query: Registry.query,
		    register: Registry.register,
		    Container: container_1.default,
		    Format: format_1.default,
		    Leaf: leaf_1.default,
		    Embed: embed_1.default,
		    Scroll: scroll_1.default,
		    Block: block_1.default,
		    Inline: inline_1.default,
		    Text: text_1.default,
		    Attributor: {
		        Attribute: attributor_1.default,
		        Class: class_1.default,
		        Style: style_1.default,
		        Store: store_1.default
		    }
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = Parchment;
	
	
	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var linked_list_1 = __webpack_require__(5);
		var shadow_1 = __webpack_require__(6);
		var Registry = __webpack_require__(7);
		var ContainerBlot = (function (_super) {
		    __extends(ContainerBlot, _super);
		    function ContainerBlot() {
		        _super.apply(this, arguments);
		    }
		    ContainerBlot.prototype.appendChild = function (other) {
		        this.insertBefore(other);
		    };
		    ContainerBlot.prototype.attach = function () {
		        var _this = this;
		        _super.prototype.attach.call(this);
		        this.children = new linked_list_1.default();
		        // Need to be reversed for if DOM nodes already in order
		        [].slice.call(this.domNode.childNodes).reverse().forEach(function (node) {
		            try {
		                var child = makeBlot(node);
		                _this.insertBefore(child, _this.children.head);
		            }
		            catch (err) {
		                if (err instanceof Registry.ParchmentError)
		                    return;
		                else
		                    throw err;
		            }
		        });
		    };
		    ContainerBlot.prototype.deleteAt = function (index, length) {
		        if (index === 0 && length === this.length()) {
		            return this.remove();
		        }
		        this.children.forEachAt(index, length, function (child, offset, length) {
		            child.deleteAt(offset, length);
		        });
		    };
		    ContainerBlot.prototype.descendant = function (criteria, index) {
		        var _a = this.children.find(index), child = _a[0], offset = _a[1];
		        if ((criteria.blotName == null && criteria(child)) ||
		            (criteria.blotName != null && child instanceof criteria)) {
		            return [child, offset];
		        }
		        else if (child instanceof ContainerBlot) {
		            return child.descendant(criteria, offset);
		        }
		        else {
		            return [null, -1];
		        }
		    };
		    ContainerBlot.prototype.descendants = function (criteria, index, length) {
		        if (index === void 0) { index = 0; }
		        if (length === void 0) { length = Number.MAX_VALUE; }
		        var descendants = [], lengthLeft = length;
		        this.children.forEachAt(index, length, function (child, index, length) {
		            if ((criteria.blotName == null && criteria(child)) ||
		                (criteria.blotName != null && child instanceof criteria)) {
		                descendants.push(child);
		            }
		            if (child instanceof ContainerBlot) {
		                descendants = descendants.concat(child.descendants(criteria, index, lengthLeft));
		            }
		            lengthLeft -= length;
		        });
		        return descendants;
		    };
		    ContainerBlot.prototype.detach = function () {
		        this.children.forEach(function (child) {
		            child.detach();
		        });
		        _super.prototype.detach.call(this);
		    };
		    ContainerBlot.prototype.formatAt = function (index, length, name, value) {
		        this.children.forEachAt(index, length, function (child, offset, length) {
		            child.formatAt(offset, length, name, value);
		        });
		    };
		    ContainerBlot.prototype.insertAt = function (index, value, def) {
		        var _a = this.children.find(index), child = _a[0], offset = _a[1];
		        if (child) {
		            child.insertAt(offset, value, def);
		        }
		        else {
		            var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
		            this.appendChild(blot);
		        }
		    };
		    ContainerBlot.prototype.insertBefore = function (childBlot, refBlot) {
		        if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function (child) {
		            return childBlot instanceof child;
		        })) {
		            throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
		        }
		        childBlot.insertInto(this, refBlot);
		    };
		    ContainerBlot.prototype.length = function () {
		        return this.children.reduce(function (memo, child) {
		            return memo + child.length();
		        }, 0);
		    };
		    ContainerBlot.prototype.moveChildren = function (targetParent, refNode) {
		        this.children.forEach(function (child) {
		            targetParent.insertBefore(child, refNode);
		        });
		    };
		    ContainerBlot.prototype.optimize = function () {
		        _super.prototype.optimize.call(this);
		        if (this.children.length === 0) {
		            if (this.statics.defaultChild != null) {
		                var child = Registry.create(this.statics.defaultChild);
		                this.appendChild(child);
		                child.optimize();
		            }
		            else {
		                this.remove();
		            }
		        }
		    };
		    ContainerBlot.prototype.path = function (index, inclusive) {
		        if (inclusive === void 0) { inclusive = false; }
		        var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
		        var position = [[this, index]];
		        if (child instanceof ContainerBlot) {
		            return position.concat(child.path(offset, inclusive));
		        }
		        else if (child != null) {
		            position.push([child, offset]);
		        }
		        return position;
		    };
		    ContainerBlot.prototype.removeChild = function (child) {
		        this.children.remove(child);
		    };
		    ContainerBlot.prototype.replace = function (target) {
		        if (target instanceof ContainerBlot) {
		            target.moveChildren(this);
		        }
		        _super.prototype.replace.call(this, target);
		    };
		    ContainerBlot.prototype.split = function (index, force) {
		        if (force === void 0) { force = false; }
		        if (!force) {
		            if (index === 0)
		                return this;
		            if (index === this.length())
		                return this.next;
		        }
		        var after = this.clone();
		        this.parent.insertBefore(after, this.next);
		        this.children.forEachAt(index, this.length(), function (child, offset, length) {
		            child = child.split(offset, force);
		            after.appendChild(child);
		        });
		        return after;
		    };
		    ContainerBlot.prototype.unwrap = function () {
		        this.moveChildren(this.parent, this.next);
		        this.remove();
		    };
		    ContainerBlot.prototype.update = function (mutations) {
		        var _this = this;
		        var addedNodes = [], removedNodes = [];
		        mutations.forEach(function (mutation) {
		            if (mutation.target === _this.domNode && mutation.type === 'childList') {
		                addedNodes.push.apply(addedNodes, mutation.addedNodes);
		                removedNodes.push.apply(removedNodes, mutation.removedNodes);
		            }
		        });
		        removedNodes.forEach(function (node) {
		            var blot = Registry.find(node);
		            if (blot == null)
		                return;
		            if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
		                blot.detach();
		            }
		        });
		        addedNodes.filter(function (node) {
		            return node.parentNode == _this.domNode;
		        }).sort(function (a, b) {
		            if (a === b)
		                return 0;
		            if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
		                return 1;
		            }
		            return -1;
		        }).forEach(function (node) {
		            var refBlot = null;
		            if (node.nextSibling != null) {
		                refBlot = Registry.find(node.nextSibling);
		            }
		            var blot = makeBlot(node);
		            if (blot.next != refBlot || blot.next == null) {
		                if (blot.parent != null) {
		                    blot.parent.removeChild(_this);
		                }
		                _this.insertBefore(blot, refBlot);
		            }
		        });
		    };
		    return ContainerBlot;
		}(shadow_1.default));
		function makeBlot(node) {
		    var blot = Registry.find(node);
		    if (blot == null) {
		        try {
		            blot = Registry.create(node);
		        }
		        catch (e) {
		            blot = Registry.create(Registry.Scope.INLINE);
		            [].slice.call(node.childNodes).forEach(function (child) {
		                blot.domNode.appendChild(child);
		            });
		            node.parentNode.replaceChild(blot.domNode, node);
		            blot.attach();
		        }
		    }
		    return blot;
		}
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ContainerBlot;
	
	
	/***/ },
	/* 5 */
	/***/ function(module, exports) {
	
		"use strict";
		var LinkedList = (function () {
		    function LinkedList() {
		        this.head = this.tail = undefined;
		        this.length = 0;
		    }
		    LinkedList.prototype.append = function () {
		        var nodes = [];
		        for (var _i = 0; _i < arguments.length; _i++) {
		            nodes[_i - 0] = arguments[_i];
		        }
		        this.insertBefore(nodes[0], undefined);
		        if (nodes.length > 1) {
		            this.append.apply(this, nodes.slice(1));
		        }
		    };
		    LinkedList.prototype.contains = function (node) {
		        var cur, next = this.iterator();
		        while (cur = next()) {
		            if (cur === node)
		                return true;
		        }
		        return false;
		    };
		    LinkedList.prototype.insertBefore = function (node, refNode) {
		        node.next = refNode;
		        if (refNode != null) {
		            node.prev = refNode.prev;
		            if (refNode.prev != null) {
		                refNode.prev.next = node;
		            }
		            refNode.prev = node;
		            if (refNode === this.head) {
		                this.head = node;
		            }
		        }
		        else if (this.tail != null) {
		            this.tail.next = node;
		            node.prev = this.tail;
		            this.tail = node;
		        }
		        else {
		            node.prev = undefined;
		            this.head = this.tail = node;
		        }
		        this.length += 1;
		    };
		    LinkedList.prototype.offset = function (target) {
		        var index = 0, cur = this.head;
		        while (cur != null) {
		            if (cur === target)
		                return index;
		            index += cur.length();
		            cur = cur.next;
		        }
		        return -1;
		    };
		    LinkedList.prototype.remove = function (node) {
		        if (!this.contains(node))
		            return;
		        if (node.prev != null)
		            node.prev.next = node.next;
		        if (node.next != null)
		            node.next.prev = node.prev;
		        if (node === this.head)
		            this.head = node.next;
		        if (node === this.tail)
		            this.tail = node.prev;
		        this.length -= 1;
		    };
		    LinkedList.prototype.iterator = function (curNode) {
		        if (curNode === void 0) { curNode = this.head; }
		        // TODO use yield when we can
		        return function () {
		            var ret = curNode;
		            if (curNode != null)
		                curNode = curNode.next;
		            return ret;
		        };
		    };
		    LinkedList.prototype.find = function (index, inclusive) {
		        if (inclusive === void 0) { inclusive = false; }
		        var cur, next = this.iterator();
		        while (cur = next()) {
		            var length_1 = cur.length();
		            if (index < length_1 || (inclusive && index === length_1 && (cur.next == null || cur.next.length() !== 0))) {
		                return [cur, index];
		            }
		            index -= length_1;
		        }
		        return [null, 0];
		    };
		    LinkedList.prototype.forEach = function (callback) {
		        var cur, next = this.iterator();
		        while (cur = next()) {
		            callback(cur);
		        }
		    };
		    LinkedList.prototype.forEachAt = function (index, length, callback) {
		        if (length <= 0)
		            return;
		        var _a = this.find(index), startNode = _a[0], offset = _a[1];
		        var cur, curIndex = index - offset, next = this.iterator(startNode);
		        while ((cur = next()) && curIndex < index + length) {
		            var curLength = cur.length();
		            if (index > curIndex) {
		                callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
		            }
		            else {
		                callback(cur, 0, Math.min(curLength, index + length - curIndex));
		            }
		            curIndex += curLength;
		        }
		    };
		    LinkedList.prototype.map = function (callback) {
		        return this.reduce(function (memo, cur) {
		            memo.push(callback(cur));
		            return memo;
		        }, []);
		    };
		    LinkedList.prototype.reduce = function (callback, memo) {
		        var cur, next = this.iterator();
		        while (cur = next()) {
		            memo = callback(memo, cur);
		        }
		        return memo;
		    };
		    return LinkedList;
		}());
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = LinkedList;
	
	
	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var Registry = __webpack_require__(7);
		var ShadowBlot = (function () {
		    function ShadowBlot(domNode) {
		        this.domNode = domNode;
		        this.attach();
		    }
		    Object.defineProperty(ShadowBlot.prototype, "statics", {
		        // Hack for accessing inherited static methods
		        get: function () {
		            return this.constructor;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    ShadowBlot.create = function (value) {
		        if (this.tagName == null) {
		            throw new Registry.ParchmentError('Blot definition missing tagName');
		        }
		        var node;
		        if (Array.isArray(this.tagName)) {
		            if (typeof value === 'string') {
		                value = value.toUpperCase();
		                if (parseInt(value).toString() === value) {
		                    value = parseInt(value);
		                }
		            }
		            if (typeof value === 'number') {
		                node = document.createElement(this.tagName[value - 1]);
		            }
		            else if (this.tagName.indexOf(value) > -1) {
		                node = document.createElement(value);
		            }
		            else {
		                node = document.createElement(this.tagName[0]);
		            }
		        }
		        else {
		            node = document.createElement(this.tagName);
		        }
		        if (this.className) {
		            node.classList.add(this.className);
		        }
		        return node;
		    };
		    ShadowBlot.prototype.attach = function () {
		        this.domNode[Registry.DATA_KEY] = { blot: this };
		    };
		    ShadowBlot.prototype.clone = function () {
		        var domNode = this.domNode.cloneNode();
		        return Registry.create(domNode);
		    };
		    ShadowBlot.prototype.detach = function () {
		        if (this.parent != null)
		            this.parent.removeChild(this);
		        delete this.domNode[Registry.DATA_KEY];
		    };
		    ShadowBlot.prototype.deleteAt = function (index, length) {
		        var blot = this.isolate(index, length);
		        blot.remove();
		    };
		    ShadowBlot.prototype.formatAt = function (index, length, name, value) {
		        var blot = this.isolate(index, length);
		        if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
		            blot.wrap(name, value);
		        }
		        else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
		            var parent_1 = Registry.create(this.statics.scope);
		            blot.wrap(parent_1);
		            parent_1.format(name, value);
		        }
		    };
		    ShadowBlot.prototype.insertAt = function (index, value, def) {
		        var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
		        var ref = this.split(index);
		        this.parent.insertBefore(blot, ref);
		    };
		    ShadowBlot.prototype.insertInto = function (parentBlot, refBlot) {
		        if (this.parent != null) {
		            this.parent.children.remove(this);
		        }
		        parentBlot.children.insertBefore(this, refBlot);
		        if (refBlot != null) {
		            var refDomNode = refBlot.domNode;
		        }
		        if (this.next == null || this.domNode.nextSibling != refDomNode) {
		            parentBlot.domNode.insertBefore(this.domNode, refDomNode);
		        }
		        this.parent = parentBlot;
		    };
		    ShadowBlot.prototype.isolate = function (index, length) {
		        var target = this.split(index);
		        target.split(length);
		        return target;
		    };
		    ShadowBlot.prototype.length = function () {
		        return 1;
		    };
		    ;
		    ShadowBlot.prototype.offset = function (root) {
		        if (root === void 0) { root = this.parent; }
		        if (this.parent == null || this == root)
		            return 0;
		        return this.parent.children.offset(this) + this.parent.offset(root);
		    };
		    ShadowBlot.prototype.optimize = function () {
		        // TODO clean up once we use WeakMap
		        if (this.domNode[Registry.DATA_KEY] != null) {
		            delete this.domNode[Registry.DATA_KEY].mutations;
		        }
		    };
		    ShadowBlot.prototype.remove = function () {
		        if (this.domNode.parentNode != null) {
		            this.domNode.parentNode.removeChild(this.domNode);
		        }
		        this.detach();
		    };
		    ShadowBlot.prototype.replace = function (target) {
		        if (target.parent == null)
		            return;
		        target.parent.insertBefore(this, target.next);
		        target.remove();
		    };
		    ShadowBlot.prototype.replaceWith = function (name, value) {
		        var replacement = typeof name === 'string' ? Registry.create(name, value) : name;
		        replacement.replace(this);
		        return replacement;
		    };
		    ShadowBlot.prototype.split = function (index, force) {
		        return index === 0 ? this : this.next;
		    };
		    ShadowBlot.prototype.update = function (mutations) {
		        if (mutations === void 0) { mutations = []; }
		        // Nothing to do by default
		    };
		    ShadowBlot.prototype.wrap = function (name, value) {
		        var wrapper = typeof name === 'string' ? Registry.create(name, value) : name;
		        if (this.parent != null) {
		            this.parent.insertBefore(wrapper, this.next);
		        }
		        wrapper.appendChild(this);
		        return wrapper;
		    };
		    ShadowBlot.blotName = 'abstract';
		    return ShadowBlot;
		}());
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ShadowBlot;
	
	
	/***/ },
	/* 7 */
	/***/ function(module, exports) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var ParchmentError = (function (_super) {
		    __extends(ParchmentError, _super);
		    function ParchmentError(message) {
		        message = '[Parchment] ' + message;
		        _super.call(this, message);
		        this.message = message;
		        this.name = this.constructor.name;
		    }
		    return ParchmentError;
		}(Error));
		exports.ParchmentError = ParchmentError;
		var attributes = {};
		var classes = {};
		var tags = {};
		var types = {};
		exports.DATA_KEY = '__blot';
		(function (Scope) {
		    Scope[Scope["TYPE"] = 3] = "TYPE";
		    Scope[Scope["LEVEL"] = 12] = "LEVEL";
		    Scope[Scope["ATTRIBUTE"] = 13] = "ATTRIBUTE";
		    Scope[Scope["BLOT"] = 14] = "BLOT";
		    Scope[Scope["INLINE"] = 7] = "INLINE";
		    Scope[Scope["BLOCK"] = 11] = "BLOCK";
		    Scope[Scope["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
		    Scope[Scope["INLINE_BLOT"] = 6] = "INLINE_BLOT";
		    Scope[Scope["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
		    Scope[Scope["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
		    Scope[Scope["ANY"] = 15] = "ANY";
		})(exports.Scope || (exports.Scope = {}));
		var Scope = exports.Scope;
		;
		function create(input, value) {
		    var match = query(input);
		    if (match == null) {
		        throw new ParchmentError("Unable to create " + input + " blot");
		    }
		    var BlotClass = match;
		    var node = input instanceof Node ? input : BlotClass.create(value);
		    return new BlotClass(node, value);
		}
		exports.create = create;
		function find(node, bubble) {
		    if (bubble === void 0) { bubble = false; }
		    if (node == null)
		        return null;
		    if (node[exports.DATA_KEY] != null)
		        return node[exports.DATA_KEY].blot;
		    if (bubble)
		        return find(node.parentNode, bubble);
		    return null;
		}
		exports.find = find;
		function query(query, scope) {
		    if (scope === void 0) { scope = Scope.ANY; }
		    var match;
		    if (typeof query === 'string') {
		        match = types[query] || attributes[query];
		    }
		    else if (query instanceof Text) {
		        match = types['text'];
		    }
		    else if (typeof query === 'number') {
		        if (query & Scope.LEVEL & Scope.BLOCK) {
		            match = types['block'];
		        }
		        else if (query & Scope.LEVEL & Scope.INLINE) {
		            match = types['inline'];
		        }
		    }
		    else if (query instanceof HTMLElement) {
		        var names = (query.getAttribute('class') || '').split(/\s+/);
		        for (var i in names) {
		            if (match = classes[names[i]])
		                break;
		        }
		        match = match || tags[query.tagName];
		    }
		    if (match == null)
		        return null;
		    if ((scope & Scope.LEVEL & match.scope) && (scope & Scope.TYPE & match.scope))
		        return match;
		    return null;
		}
		exports.query = query;
		function register() {
		    var Definitions = [];
		    for (var _i = 0; _i < arguments.length; _i++) {
		        Definitions[_i - 0] = arguments[_i];
		    }
		    if (Definitions.length > 1) {
		        return Definitions.map(function (d) {
		            return register(d);
		        });
		    }
		    var Definition = Definitions[0];
		    if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
		        throw new ParchmentError('Invalid definition');
		    }
		    else if (Definition.blotName === 'abstract') {
		        throw new ParchmentError('Cannot register abstract class');
		    }
		    types[Definition.blotName || Definition.attrName] = Definition;
		    if (typeof Definition.keyName === 'string') {
		        attributes[Definition.keyName] = Definition;
		    }
		    else {
		        if (Definition.className != null) {
		            classes[Definition.className] = Definition;
		        }
		        if (Definition.tagName != null) {
		            if (Array.isArray(Definition.tagName)) {
		                Definition.tagName = Definition.tagName.map(function (tagName) {
		                    return tagName.toUpperCase();
		                });
		            }
		            else {
		                Definition.tagName = Definition.tagName.toUpperCase();
		            }
		            var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
		            tagNames.forEach(function (tag) {
		                if (tags[tag] == null || Definition.className == null) {
		                    tags[tag] = Definition;
		                }
		            });
		        }
		    }
		    return Definition;
		}
		exports.register = register;
	
	
	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var attributor_1 = __webpack_require__(9);
		var store_1 = __webpack_require__(10);
		var container_1 = __webpack_require__(4);
		var Registry = __webpack_require__(7);
		var FormatBlot = (function (_super) {
		    __extends(FormatBlot, _super);
		    function FormatBlot() {
		        _super.apply(this, arguments);
		    }
		    FormatBlot.formats = function (domNode) {
		        if (typeof this.tagName === 'string') {
		            return true;
		        }
		        else if (Array.isArray(this.tagName)) {
		            return domNode.tagName.toLowerCase();
		        }
		        return undefined;
		    };
		    FormatBlot.prototype.attach = function () {
		        _super.prototype.attach.call(this);
		        this.attributes = new store_1.default(this.domNode);
		    };
		    FormatBlot.prototype.format = function (name, value) {
		        var format = Registry.query(name);
		        if (format instanceof attributor_1.default) {
		            this.attributes.attribute(format, value);
		        }
		        else if (value) {
		            if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
		                this.replaceWith(name, value);
		            }
		        }
		    };
		    FormatBlot.prototype.formats = function () {
		        var formats = this.attributes.values();
		        var format = this.statics.formats(this.domNode);
		        if (format != null) {
		            formats[this.statics.blotName] = format;
		        }
		        return formats;
		    };
		    FormatBlot.prototype.replaceWith = function (name, value) {
		        var replacement = _super.prototype.replaceWith.call(this, name, value);
		        this.attributes.copy(replacement);
		        return replacement;
		    };
		    FormatBlot.prototype.update = function (mutations) {
		        var _this = this;
		        _super.prototype.update.call(this, mutations);
		        if (mutations.some(function (mutation) {
		            return mutation.target === _this.domNode && mutation.type === 'attributes';
		        })) {
		            this.attributes.build();
		        }
		    };
		    FormatBlot.prototype.wrap = function (name, value) {
		        var wrapper = _super.prototype.wrap.call(this, name, value);
		        if (wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
		            this.attributes.move(wrapper);
		        }
		        return wrapper;
		    };
		    return FormatBlot;
		}(container_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = FormatBlot;
	
	
	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var Registry = __webpack_require__(7);
		var Attributor = (function () {
		    function Attributor(attrName, keyName, options) {
		        if (options === void 0) { options = {}; }
		        this.attrName = attrName;
		        this.keyName = keyName;
		        var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
		        if (options.scope != null) {
		            // Ignore type bits, force attribute bit
		            this.scope = (options.scope & Registry.Scope.LEVEL) | attributeBit;
		        }
		        else {
		            this.scope = Registry.Scope.ATTRIBUTE;
		        }
		        if (options.whitelist != null)
		            this.whitelist = options.whitelist;
		    }
		    Attributor.keys = function (node) {
		        return [].map.call(node.attributes, function (item) {
		            return item.name;
		        });
		    };
		    Attributor.prototype.add = function (node, value) {
		        if (!this.canAdd(node, value))
		            return false;
		        node.setAttribute(this.keyName, value);
		        return true;
		    };
		    Attributor.prototype.canAdd = function (node, value) {
		        var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
		        if (match != null && (this.whitelist == null || this.whitelist.indexOf(value) > -1)) {
		            return true;
		        }
		        return false;
		    };
		    Attributor.prototype.remove = function (node) {
		        node.removeAttribute(this.keyName);
		    };
		    Attributor.prototype.value = function (node) {
		        return node.getAttribute(this.keyName);
		    };
		    return Attributor;
		}());
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = Attributor;
	
	
	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var attributor_1 = __webpack_require__(9);
		var class_1 = __webpack_require__(11);
		var style_1 = __webpack_require__(12);
		var Registry = __webpack_require__(7);
		var AttributorStore = (function () {
		    function AttributorStore(domNode) {
		        this.attributes = {};
		        this.domNode = domNode;
		        this.build();
		    }
		    AttributorStore.prototype.attribute = function (attribute, value) {
		        if (value) {
		            if (attribute.add(this.domNode, value)) {
		                if (attribute.value(this.domNode) != null) {
		                    this.attributes[attribute.attrName] = attribute;
		                }
		                else {
		                    delete this.attributes[attribute.attrName];
		                }
		            }
		        }
		        else {
		            attribute.remove(this.domNode);
		            delete this.attributes[attribute.attrName];
		        }
		    };
		    AttributorStore.prototype.build = function () {
		        var _this = this;
		        this.attributes = {};
		        var attributes = attributor_1.default.keys(this.domNode);
		        var classes = class_1.default.keys(this.domNode);
		        var styles = style_1.default.keys(this.domNode);
		        attributes.concat(classes).concat(styles).forEach(function (name) {
		            var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
		            if (attr instanceof attributor_1.default) {
		                _this.attributes[attr.attrName] = attr;
		            }
		        });
		    };
		    AttributorStore.prototype.copy = function (target) {
		        var _this = this;
		        Object.keys(this.attributes).forEach(function (key) {
		            var value = _this.attributes[key].value(_this.domNode);
		            target.format(key, value);
		        });
		    };
		    AttributorStore.prototype.move = function (target) {
		        var _this = this;
		        this.copy(target);
		        Object.keys(this.attributes).forEach(function (key) {
		            _this.attributes[key].remove(_this.domNode);
		        });
		        this.attributes = {};
		    };
		    AttributorStore.prototype.values = function () {
		        var _this = this;
		        return Object.keys(this.attributes).reduce(function (attributes, name) {
		            attributes[name] = _this.attributes[name].value(_this.domNode);
		            return attributes;
		        }, {});
		    };
		    return AttributorStore;
		}());
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = AttributorStore;
	
	
	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var attributor_1 = __webpack_require__(9);
		function match(node, prefix) {
		    var className = node.getAttribute('class') || '';
		    return className.split(/\s+/).filter(function (name) {
		        return name.indexOf(prefix + "-") === 0;
		    });
		}
		var ClassAttributor = (function (_super) {
		    __extends(ClassAttributor, _super);
		    function ClassAttributor() {
		        _super.apply(this, arguments);
		    }
		    ClassAttributor.keys = function (node) {
		        return (node.getAttribute('class') || '').split(/\s+/).map(function (name) {
		            return name.split('-').slice(0, -1).join('-');
		        });
		    };
		    ClassAttributor.prototype.add = function (node, value) {
		        if (!this.canAdd(node, value))
		            return false;
		        this.remove(node);
		        node.classList.add(this.keyName + "-" + value);
		        return true;
		    };
		    ClassAttributor.prototype.remove = function (node) {
		        var matches = match(node, this.keyName);
		        matches.forEach(function (name) {
		            node.classList.remove(name);
		        });
		        if (node.classList.length === 0) {
		            node.removeAttribute('class');
		        }
		    };
		    ClassAttributor.prototype.value = function (node) {
		        var result = match(node, this.keyName)[0] || '';
		        return result.slice(this.keyName.length + 1); // +1 for hyphen
		    };
		    return ClassAttributor;
		}(attributor_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ClassAttributor;
	
	
	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var attributor_1 = __webpack_require__(9);
		function camelize(name) {
		    var parts = name.split('-');
		    var rest = parts.slice(1).map(function (part) {
		        return part[0].toUpperCase() + part.slice(1);
		    }).join('');
		    return parts[0] + rest;
		}
		var StyleAttributor = (function (_super) {
		    __extends(StyleAttributor, _super);
		    function StyleAttributor() {
		        _super.apply(this, arguments);
		    }
		    StyleAttributor.keys = function (node) {
		        return (node.getAttribute('style') || '').split(';').map(function (value) {
		            var arr = value.split(':');
		            return arr[0].trim();
		        });
		    };
		    StyleAttributor.prototype.add = function (node, value) {
		        if (!this.canAdd(node, value))
		            return false;
		        node.style[camelize(this.keyName)] = value;
		        return true;
		    };
		    StyleAttributor.prototype.remove = function (node) {
		        node.style[camelize(this.keyName)] = '';
		        if (!node.getAttribute('style')) {
		            node.removeAttribute('style');
		        }
		    };
		    StyleAttributor.prototype.value = function (node) {
		        return node.style[camelize(this.keyName)];
		    };
		    return StyleAttributor;
		}(attributor_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = StyleAttributor;
	
	
	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var shadow_1 = __webpack_require__(6);
		var Registry = __webpack_require__(7);
		var LeafBlot = (function (_super) {
		    __extends(LeafBlot, _super);
		    function LeafBlot() {
		        _super.apply(this, arguments);
		    }
		    LeafBlot.value = function (domNode) {
		        return true;
		    };
		    LeafBlot.prototype.index = function (node, offset) {
		        if (node !== this.domNode)
		            return -1;
		        return Math.min(offset, 1);
		    };
		    LeafBlot.prototype.position = function (index, inclusive) {
		        var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
		        if (index > 0)
		            offset += 1;
		        return [this.parent.domNode, offset];
		    };
		    LeafBlot.prototype.value = function () {
		        return (_a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a);
		        var _a;
		    };
		    LeafBlot.scope = Registry.Scope.INLINE_BLOT;
		    return LeafBlot;
		}(shadow_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = LeafBlot;
	
	
	/***/ },
	/* 14 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var container_1 = __webpack_require__(4);
		var Registry = __webpack_require__(7);
		var OBSERVER_CONFIG = {
		    attributes: true,
		    characterData: true,
		    characterDataOldValue: true,
		    childList: true,
		    subtree: true
		};
		var MAX_OPTIMIZE_ITERATIONS = 100;
		var ScrollBlot = (function (_super) {
		    __extends(ScrollBlot, _super);
		    function ScrollBlot(node) {
		        var _this = this;
		        _super.call(this, node);
		        this.parent = null;
		        this.observer = new MutationObserver(function (mutations) {
		            _this.update(mutations);
		        });
		        this.observer.observe(this.domNode, OBSERVER_CONFIG);
		    }
		    ScrollBlot.prototype.detach = function () {
		        _super.prototype.detach.call(this);
		        this.observer.disconnect();
		    };
		    ScrollBlot.prototype.deleteAt = function (index, length) {
		        this.update();
		        if (index === 0 && length === this.length()) {
		            this.children.forEach(function (child) {
		                child.remove();
		            });
		        }
		        else {
		            _super.prototype.deleteAt.call(this, index, length);
		        }
		    };
		    ScrollBlot.prototype.formatAt = function (index, length, name, value) {
		        this.update();
		        _super.prototype.formatAt.call(this, index, length, name, value);
		    };
		    ScrollBlot.prototype.insertAt = function (index, value, def) {
		        this.update();
		        _super.prototype.insertAt.call(this, index, value, def);
		    };
		    ScrollBlot.prototype.optimize = function (mutations) {
		        var _this = this;
		        if (mutations === void 0) { mutations = []; }
		        _super.prototype.optimize.call(this);
		        mutations.push.apply(mutations, this.observer.takeRecords());
		        // TODO use WeakMap
		        var mark = function (blot, markParent) {
		            if (markParent === void 0) { markParent = true; }
		            if (blot == null || blot === _this)
		                return;
		            if (blot.domNode.parentNode == null)
		                return;
		            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
		                blot.domNode[Registry.DATA_KEY].mutations = [];
		            }
		            if (markParent)
		                mark(blot.parent);
		        };
		        var optimize = function (blot) {
		            if (blot.domNode[Registry.DATA_KEY] == null || blot.domNode[Registry.DATA_KEY].mutations == null) {
		                return;
		            }
		            if (blot instanceof container_1.default) {
		                blot.children.forEach(optimize);
		            }
		            blot.optimize();
		        };
		        var remaining = mutations;
		        for (var i = 0; remaining.length > 0; i += 1) {
		            if (i >= MAX_OPTIMIZE_ITERATIONS) {
		                throw new Error('[Parchment] Maximum optimize iterations reached');
		            }
		            remaining.forEach(function (mutation) {
		                var blot = Registry.find(mutation.target, true);
		                if (blot == null)
		                    return;
		                if (blot.domNode === mutation.target) {
		                    if (mutation.type === 'childList') {
		                        mark(Registry.find(mutation.previousSibling, false));
		                        [].forEach.call(mutation.addedNodes, function (node) {
		                            var child = Registry.find(node, false);
		                            mark(child, false);
		                            if (child instanceof container_1.default) {
		                                child.children.forEach(function (grandChild) {
		                                    mark(grandChild, false);
		                                });
		                            }
		                        });
		                    }
		                    else if (mutation.type === 'attributes') {
		                        mark(blot.prev);
		                    }
		                }
		                mark(blot);
		            });
		            this.children.forEach(optimize);
		            remaining = this.observer.takeRecords();
		            mutations.push.apply(mutations, remaining);
		        }
		    };
		    ScrollBlot.prototype.update = function (mutations) {
		        var _this = this;
		        mutations = mutations || this.observer.takeRecords();
		        // TODO use WeakMap
		        mutations.map(function (mutation) {
		            var blot = Registry.find(mutation.target, true);
		            if (blot == null)
		                return;
		            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
		                blot.domNode[Registry.DATA_KEY].mutations = [mutation];
		                return blot;
		            }
		            else {
		                blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
		                return null;
		            }
		        }).forEach(function (blot) {
		            if (blot == null || blot === _this)
		                return;
		            blot.update(blot.domNode[Registry.DATA_KEY].mutations || []);
		        });
		        if (this.domNode[Registry.DATA_KEY].mutations != null) {
		            _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations);
		        }
		        this.optimize(mutations);
		    };
		    ScrollBlot.blotName = 'scroll';
		    ScrollBlot.defaultChild = 'block';
		    ScrollBlot.scope = Registry.Scope.BLOCK_BLOT;
		    ScrollBlot.tagName = 'DIV';
		    return ScrollBlot;
		}(container_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ScrollBlot;
	
	
	/***/ },
	/* 15 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var format_1 = __webpack_require__(8);
		var Registry = __webpack_require__(7);
		// Shallow object comparison
		function isEqual(obj1, obj2) {
		    if (Object.keys(obj1).length !== Object.keys(obj2).length)
		        return false;
		    for (var prop in obj1) {
		        if (obj1[prop] !== obj2[prop])
		            return false;
		    }
		    return true;
		}
		var InlineBlot = (function (_super) {
		    __extends(InlineBlot, _super);
		    function InlineBlot() {
		        _super.apply(this, arguments);
		    }
		    InlineBlot.formats = function (domNode) {
		        if (domNode.tagName === InlineBlot.tagName)
		            return undefined;
		        return _super.formats.call(this, domNode);
		    };
		    InlineBlot.prototype.format = function (name, value) {
		        var _this = this;
		        if (name === this.statics.blotName && !value) {
		            this.children.forEach(function (child) {
		                if (!(child instanceof format_1.default)) {
		                    child = child.wrap(InlineBlot.blotName, true);
		                }
		                _this.attributes.copy(child);
		            });
		            this.unwrap();
		        }
		        else {
		            _super.prototype.format.call(this, name, value);
		        }
		    };
		    InlineBlot.prototype.formatAt = function (index, length, name, value) {
		        if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
		            var blot = this.isolate(index, length);
		            blot.format(name, value);
		        }
		        else {
		            _super.prototype.formatAt.call(this, index, length, name, value);
		        }
		    };
		    InlineBlot.prototype.optimize = function () {
		        _super.prototype.optimize.call(this);
		        var formats = this.formats();
		        if (Object.keys(formats).length === 0) {
		            return this.unwrap(); // unformatted span
		        }
		        var next = this.next;
		        if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
		            next.moveChildren(this);
		            next.remove();
		        }
		    };
		    InlineBlot.blotName = 'inline';
		    InlineBlot.scope = Registry.Scope.INLINE_BLOT;
		    InlineBlot.tagName = 'SPAN';
		    return InlineBlot;
		}(format_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = InlineBlot;
	
	
	/***/ },
	/* 16 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var format_1 = __webpack_require__(8);
		var Registry = __webpack_require__(7);
		var BlockBlot = (function (_super) {
		    __extends(BlockBlot, _super);
		    function BlockBlot() {
		        _super.apply(this, arguments);
		    }
		    BlockBlot.formats = function (domNode) {
		        var tagName = Registry.query(BlockBlot.blotName).tagName;
		        if (domNode.tagName === tagName)
		            return undefined;
		        return _super.formats.call(this, domNode);
		    };
		    BlockBlot.prototype.format = function (name, value) {
		        if (name === this.statics.blotName && !value) {
		            this.replaceWith(BlockBlot.blotName);
		        }
		        else {
		            _super.prototype.format.call(this, name, value);
		        }
		    };
		    BlockBlot.prototype.formatAt = function (index, length, name, value) {
		        if (Registry.query(name, Registry.Scope.BLOCK) != null) {
		            this.format(name, value);
		        }
		        else {
		            _super.prototype.formatAt.call(this, index, length, name, value);
		        }
		    };
		    BlockBlot.prototype.insertAt = function (index, value, def) {
		        if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
		            // Insert text or inline
		            _super.prototype.insertAt.call(this, index, value, def);
		        }
		        else {
		            var after = this.split(index);
		            var blot = Registry.create(value, def);
		            after.parent.insertBefore(blot, after);
		        }
		    };
		    BlockBlot.blotName = 'block';
		    BlockBlot.scope = Registry.Scope.BLOCK_BLOT;
		    BlockBlot.tagName = 'P';
		    return BlockBlot;
		}(format_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = BlockBlot;
	
	
	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var leaf_1 = __webpack_require__(13);
		var EmbedBlot = (function (_super) {
		    __extends(EmbedBlot, _super);
		    function EmbedBlot() {
		        _super.apply(this, arguments);
		    }
		    EmbedBlot.formats = function (domNode) {
		        return undefined;
		    };
		    EmbedBlot.prototype.format = function (name, value) {
		        // super.formatAt wraps, which is what we want in general,
		        // but this allows subclasses to overwrite for formats
		        // that just apply to particular embeds
		        _super.prototype.formatAt.call(this, 0, this.length(), name, value);
		    };
		    EmbedBlot.prototype.formatAt = function (index, length, name, value) {
		        if (index === 0 && length === this.length()) {
		            this.format(name, value);
		        }
		        else {
		            _super.prototype.formatAt.call(this, index, length, name, value);
		        }
		    };
		    EmbedBlot.prototype.formats = function () {
		        return this.statics.formats(this.domNode);
		    };
		    return EmbedBlot;
		}(leaf_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = EmbedBlot;
	
	
	/***/ },
	/* 18 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var leaf_1 = __webpack_require__(13);
		var Registry = __webpack_require__(7);
		var TextBlot = (function (_super) {
		    __extends(TextBlot, _super);
		    function TextBlot(node) {
		        _super.call(this, node);
		        this.text = this.statics.value(this.domNode);
		    }
		    TextBlot.create = function (value) {
		        return document.createTextNode(value);
		    };
		    TextBlot.value = function (domNode) {
		        return domNode.data;
		    };
		    TextBlot.prototype.deleteAt = function (index, length) {
		        this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
		    };
		    TextBlot.prototype.index = function (node, offset) {
		        if (this.domNode === node) {
		            return offset;
		        }
		        return -1;
		    };
		    TextBlot.prototype.insertAt = function (index, value, def) {
		        if (def == null) {
		            this.text = this.text.slice(0, index) + value + this.text.slice(index);
		            this.domNode.data = this.text;
		        }
		        else {
		            _super.prototype.insertAt.call(this, index, value, def);
		        }
		    };
		    TextBlot.prototype.length = function () {
		        return this.text.length;
		    };
		    TextBlot.prototype.optimize = function () {
		        _super.prototype.optimize.call(this);
		        this.text = this.statics.value(this.domNode);
		        if (this.text.length === 0) {
		            this.remove();
		        }
		        else if (this.next instanceof TextBlot && this.next.prev === this) {
		            this.insertAt(this.length(), this.next.value());
		            this.next.remove();
		        }
		    };
		    TextBlot.prototype.position = function (index, inclusive) {
		        if (inclusive === void 0) { inclusive = false; }
		        return [this.domNode, index];
		    };
		    TextBlot.prototype.split = function (index, force) {
		        if (force === void 0) { force = false; }
		        if (!force) {
		            if (index === 0)
		                return this;
		            if (index === this.length())
		                return this.next;
		        }
		        var after = Registry.create(this.domNode.splitText(index));
		        this.parent.insertBefore(after, this.next);
		        this.text = this.statics.value(this.domNode);
		        return after;
		    };
		    TextBlot.prototype.update = function (mutations) {
		        var _this = this;
		        if (mutations.some(function (mutation) {
		            return mutation.type === 'characterData' && mutation.target === _this.domNode;
		        })) {
		            this.text = this.statics.value(this.domNode);
		        }
		    };
		    TextBlot.prototype.value = function () {
		        return this.text;
		    };
		    TextBlot.blotName = 'text';
		    TextBlot.scope = Registry.Scope.INLINE_BLOT;
		    return TextBlot;
		}(leaf_1.default));
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = TextBlot;
	
	
	/***/ },
	/* 19 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.overload = exports.expandConfig = undefined;
	
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		__webpack_require__(20);
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _editor = __webpack_require__(28);
	
		var _editor2 = _interopRequireDefault(_editor);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		var _module = __webpack_require__(40);
	
		var _module2 = _interopRequireDefault(_module);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _selection = __webpack_require__(41);
	
		var _selection2 = _interopRequireDefault(_selection);
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _logger = __webpack_require__(31);
	
		var _logger2 = _interopRequireDefault(_logger);
	
		var _theme = __webpack_require__(42);
	
		var _theme2 = _interopRequireDefault(_theme);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var debug = (0, _logger2.default)('quill');
	
		var Quill = function () {
		  _createClass(Quill, null, [{
		    key: 'debug',
		    value: function debug(limit) {
		      _logger2.default.level(limit);
		    }
		  }, {
		    key: 'import',
		    value: function _import(name) {
		      if (this.imports[name] == null) {
		        debug.error('Cannot import ' + name + '. Are you sure it was registered?');
		      }
		      return this.imports[name];
		    }
		  }, {
		    key: 'register',
		    value: function register(path, target) {
		      var _this = this;
	
		      var overwrite = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
		      if (typeof path !== 'string') {
		        var name = path.attrName || path.blotName;
		        if (typeof name === 'string') {
		          // register(Blot | Attributor, overwrite)
		          this.register('formats/' + name, path, target);
		        } else {
		          Object.keys(path).forEach(function (key) {
		            _this.register(key, path[key], target);
		          });
		        }
		      } else {
		        if (this.imports[path] != null && !overwrite) {
		          debug.warn('Overwriting ' + path + ' with', target);
		        }
		        this.imports[path] = target;
		        if ((path.startsWith('blots/') || path.startsWith('formats/')) && target.blotName !== 'abstract') {
		          _parchment2.default.register(target);
		        }
		      }
		    }
		  }]);
	
		  function Quill(container) {
		    var _this2 = this;
	
		    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
		    _classCallCheck(this, Quill);
	
		    options = expandConfig(container, options);
		    this.container = options.container;
		    if (this.container == null) {
		      return debug.error('Invalid Quill container', container);
		    }
		    if (options.debug) {
		      Quill.debug(options.debug);
		    }
		    var html = this.container.innerHTML.trim();
		    this.container.classList.add('ql-container');
		    this.container.innerHTML = '';
		    this.root = this.addContainer('ql-editor');
		    this.emitter = new _emitter2.default();
		    this.scroll = _parchment2.default.create(this.root, {
		      emitter: this.emitter,
		      whitelist: options.formats
		    });
		    this.editor = new _editor2.default(this.scroll, this.emitter);
		    this.selection = new _selection2.default(this.scroll, this.emitter);
		    this.theme = new options.theme(this, options);
		    this.keyboard = this.theme.addModule('keyboard');
		    this.clipboard = this.theme.addModule('clipboard');
		    this.history = this.theme.addModule('history');
		    this.theme.init();
		    this.pasteHTML('<div class=\'ql-editor\' style="white-space: normal;">' + html + '<p><br></p></div>');
		    this.history.clear();
		    if (options.readOnly) {
		      this.disable();
		    }
		    if (options.placeholder) {
		      this.root.setAttribute('data-placeholder', options.placeholder);
		    }
		    this.root.classList.toggle('ql-blank', this.editor.isBlank());
		    this.emitter.on(_emitter2.default.events.TEXT_CHANGE, function (delta) {
		      _this2.root.classList.toggle('ql-blank', _this2.editor.isBlank());
		    });
		  }
	
		  _createClass(Quill, [{
		    key: 'addContainer',
		    value: function addContainer(container) {
		      var refNode = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
		      if (typeof container === 'string') {
		        var className = container;
		        container = document.createElement('div');
		        container.classList.add(className);
		      }
		      this.container.insertBefore(container, refNode);
		      return container;
		    }
		  }, {
		    key: 'blur',
		    value: function blur() {
		      this.selection.setRange(null);
		    }
		  }, {
		    key: 'deleteText',
		    value: function deleteText(index, length, source) {
		      var _overload = overload(index, length, source);
	
		      var _overload2 = _slicedToArray(_overload, 4);
	
		      index = _overload2[0];
		      length = _overload2[1];
		      source = _overload2[3];
	
		      var range = this.getSelection();
		      var change = this.editor.deleteText(index, length, source);
		      range = shiftRange(range, index, -1 * length, source);
		      this.setSelection(range, _emitter2.default.sources.SILENT);
		      return change;
		    }
		  }, {
		    key: 'disable',
		    value: function disable() {
		      this.enable(false);
		    }
		  }, {
		    key: 'enable',
		    value: function enable() {
		      var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
		      this.editor.enable(enabled);
		      if (!enabled) {
		        this.blur();
		      }
		    }
		  }, {
		    key: 'focus',
		    value: function focus() {
		      this.selection.focus();
		      this.selection.scrollIntoView();
		    }
		  }, {
		    key: 'format',
		    value: function format(name, value) {
		      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter2.default.sources.API : arguments[2];
	
		      var range = this.getSelection(true);
		      var change = new _delta2.default();
		      if (range == null) return change;
		      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
		        change = this.formatLine(range, name, value, source);
		      } else if (range.length === 0) {
		        this.selection.format(name, value);
		        return change;
		      } else {
		        change = this.formatText(range, name, value, source);
		      }
		      this.setSelection(range, _emitter2.default.sources.SILENT);
		      return change;
		    }
		  }, {
		    key: 'formatLine',
		    value: function formatLine(index, length, name, value, source) {
		      var formats = void 0;
	
		      var _overload3 = overload(index, length, name, value, source);
	
		      var _overload4 = _slicedToArray(_overload3, 4);
	
		      index = _overload4[0];
		      length = _overload4[1];
		      formats = _overload4[2];
		      source = _overload4[3];
	
		      var range = this.getSelection();
		      var change = this.editor.formatLine(index, length, formats, source);
		      this.selection.setRange(range, true, _emitter2.default.sources.SILENT);
		      this.selection.scrollIntoView();
		      return change;
		    }
		  }, {
		    key: 'formatText',
		    value: function formatText(index, length, name, value, source) {
		      var formats = void 0;
	
		      var _overload5 = overload(index, length, name, value, source);
	
		      var _overload6 = _slicedToArray(_overload5, 4);
	
		      index = _overload6[0];
		      length = _overload6[1];
		      formats = _overload6[2];
		      source = _overload6[3];
	
		      var range = this.getSelection();
		      var change = this.editor.formatText(index, length, formats, source);
		      this.selection.setRange(range, true, _emitter2.default.sources.SILENT);
		      this.selection.scrollIntoView();
		      return change;
		    }
		  }, {
		    key: 'getBounds',
		    value: function getBounds(index) {
		      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
		      if (typeof index === 'number') {
		        return this.selection.getBounds(index, length);
		      } else {
		        return this.selection.getBounds(index.index, index.length);
		      }
		    }
		  }, {
		    key: 'getContents',
		    value: function getContents() {
		      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		      var length = arguments.length <= 1 || arguments[1] === undefined ? this.getLength() - index : arguments[1];
	
		      var _overload7 = overload(index, length);
	
		      var _overload8 = _slicedToArray(_overload7, 2);
	
		      index = _overload8[0];
		      length = _overload8[1];
	
		      return this.editor.getContents(index, length);
		    }
		  }, {
		    key: 'getFormat',
		    value: function getFormat() {
		      var index = arguments.length <= 0 || arguments[0] === undefined ? this.getSelection() : arguments[0];
		      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
		      if (typeof index === 'number') {
		        return this.editor.getFormat(index, length);
		      } else {
		        return this.editor.getFormat(index.index, index.length);
		      }
		    }
		  }, {
		    key: 'getLength',
		    value: function getLength() {
		      return this.scroll.length();
		    }
		  }, {
		    key: 'getModule',
		    value: function getModule(name) {
		      return this.theme.modules[name];
		    }
		  }, {
		    key: 'getSelection',
		    value: function getSelection() {
		      var focus = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
		      if (focus) this.focus();
		      this.update(); // Make sure we access getRange with editor in consistent state
		      return this.selection.getRange()[0];
		    }
		  }, {
		    key: 'getText',
		    value: function getText() {
		      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		      var length = arguments.length <= 1 || arguments[1] === undefined ? this.getLength() - index : arguments[1];
	
		      var _overload9 = overload(index, length);
	
		      var _overload10 = _slicedToArray(_overload9, 2);
	
		      index = _overload10[0];
		      length = _overload10[1];
	
		      return this.editor.getText(index, length);
		    }
		  }, {
		    key: 'hasFocus',
		    value: function hasFocus() {
		      return this.selection.hasFocus();
		    }
		  }, {
		    key: 'insertEmbed',
		    value: function insertEmbed(index, embed, value) {
		      var source = arguments.length <= 3 || arguments[3] === undefined ? Quill.sources.API : arguments[3];
	
		      var range = this.getSelection();
		      var change = this.editor.insertEmbed(index, embed, value, source);
		      range = shiftRange(range, change, source);
		      this.setSelection(range, _emitter2.default.sources.SILENT);
		      return change;
		    }
		  }, {
		    key: 'insertText',
		    value: function insertText(index, text, name, value, source) {
		      var formats = void 0,
		          range = this.getSelection();
	
		      var _overload11 = overload(index, 0, name, value, source);
	
		      var _overload12 = _slicedToArray(_overload11, 4);
	
		      index = _overload12[0];
		      formats = _overload12[2];
		      source = _overload12[3];
	
		      var change = this.editor.insertText(index, text, formats, source);
		      range = shiftRange(range, index, text.length, source);
		      this.setSelection(range, _emitter2.default.sources.SILENT);
		      return change;
		    }
		  }, {
		    key: 'off',
		    value: function off() {
		      return this.emitter.off.apply(this.emitter, arguments);
		    }
		  }, {
		    key: 'on',
		    value: function on() {
		      return this.emitter.on.apply(this.emitter, arguments);
		    }
		  }, {
		    key: 'once',
		    value: function once() {
		      return this.emitter.once.apply(this.emitter, arguments);
		    }
		  }, {
		    key: 'pasteHTML',
		    value: function pasteHTML(index, html) {
		      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter2.default.sources.API : arguments[2];
	
		      if (typeof index === 'string') {
		        return this.setContents(this.clipboard.convert(index), html);
		      } else {
		        var paste = this.clipboard.convert(html);
		        return this.updateContents(new _delta2.default().retain(index).concat(paste), source);
		      }
		    }
		  }, {
		    key: 'removeFormat',
		    value: function removeFormat(index, length, source) {
		      var range = this.getSelection();
	
		      var _overload13 = overload(index, length, source);
	
		      var _overload14 = _slicedToArray(_overload13, 4);
	
		      index = _overload14[0];
		      length = _overload14[1];
		      source = _overload14[3];
	
		      var change = this.editor.removeFormat(index, length, source);
		      range = shiftRange(range, change, source);
		      this.setSelection(range, _emitter2.default.sources.SILENT);
		      return change;
		    }
		  }, {
		    key: 'setContents',
		    value: function setContents(delta) {
		      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter2.default.sources.API : arguments[1];
	
		      delta = new _delta2.default(delta).slice();
		      var lastOp = delta.ops[delta.ops.length - 1];
		      // Quill contents must always end with newline
		      if (lastOp == null || lastOp.insert[lastOp.insert.length - 1] !== '\n') {
		        delta.insert('\n');
		      }
		      delta.delete(this.getLength());
		      return this.editor.applyDelta(delta, source);
		    }
		  }, {
		    key: 'setSelection',
		    value: function setSelection(index, length, source) {
		      if (index == null) {
		        this.selection.setRange(null, length || Quill.sources.API);
		      } else {
		        var _overload15 = overload(index, length, source);
	
		        var _overload16 = _slicedToArray(_overload15, 4);
	
		        index = _overload16[0];
		        length = _overload16[1];
		        source = _overload16[3];
	
		        this.selection.setRange(new _selection.Range(index, length), source);
		      }
		      this.selection.scrollIntoView();
		    }
		  }, {
		    key: 'setText',
		    value: function setText(text) {
		      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter2.default.sources.API : arguments[1];
	
		      var delta = new _delta2.default().insert(text);
		      return this.setContents(delta, source);
		    }
		  }, {
		    key: 'update',
		    value: function update() {
		      var source = arguments.length <= 0 || arguments[0] === undefined ? _emitter2.default.sources.USER : arguments[0];
	
		      var change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
		      this.selection.update(source);
		      return change;
		    }
		  }, {
		    key: 'updateContents',
		    value: function updateContents(delta) {
		      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter2.default.sources.API : arguments[1];
	
		      var range = this.getSelection();
		      if (Array.isArray(delta)) {
		        delta = new _delta2.default(delta.slice());
		      }
		      var change = this.editor.applyDelta(delta, source);
		      if (range != null) {
		        range = shiftRange(range, change, source);
		        this.setSelection(range, _emitter2.default.sources.SILENT);
		      }
		      return change;
		    }
		  }]);
	
		  return Quill;
		}();
	
		Quill.DEFAULTS = {
		  bounds: document.body,
		  formats: null,
		  modules: {},
		  placeholder: '',
		  readOnly: false,
		  theme: 'default'
		};
		Quill.events = _emitter2.default.events;
		Quill.sources = _emitter2.default.sources;
		Quill.version =  false ? 'dev' : ("1.0.0");
	
		Quill.imports = {
		  'delta': _delta2.default,
		  'parchment': _parchment2.default,
		  'core/module': _module2.default,
		  'core/theme': _theme2.default
		};
	
		function expandConfig(container, userConfig) {
		  userConfig = (0, _extend2.default)(true, {
		    container: container,
		    modules: {
		      clipboard: true,
		      keyboard: true,
		      history: true
		    }
		  }, userConfig);
		  if (userConfig.theme == null || userConfig.theme === Quill.DEFAULTS.theme) {
		    userConfig.theme = _theme2.default;
		  } else {
		    userConfig.theme = Quill.import('themes/' + userConfig.theme);
		    if (userConfig.theme == null) {
		      throw new Error('Invalid theme ' + userConfig.theme + '. Did you register it?');
		    }
		  }
		  var themeConfig = (0, _extend2.default)(true, {}, userConfig.theme.DEFAULTS);
		  [themeConfig, userConfig].forEach(function (config) {
		    config.modules = config.modules || {};
		    Object.keys(config.modules).forEach(function (module) {
		      if (config.modules[module] === true) {
		        config.modules[module] = {};
		      }
		    });
		  });
		  var moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
		  var moduleConfig = moduleNames.reduce(function (config, name) {
		    var moduleClass = Quill.import('modules/' + name);
		    if (moduleClass == null) {
		      debug.error('Cannot load ' + name + ' module. Are you sure you registered it?');
		    } else {
		      config[name] = moduleClass.DEFAULTS || {};
		    }
		    return config;
		  }, {});
		  // Special case toolbar shorthand
		  if (userConfig.modules != null && userConfig.modules.toolbar != null && userConfig.modules.toolbar.constructor !== Object) {
		    userConfig.modules.toolbar = {
		      container: userConfig.modules.toolbar
		    };
		  }
		  userConfig = (0, _extend2.default)(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
		  ['bounds', 'container'].forEach(function (key) {
		    if (typeof userConfig[key] === 'string') {
		      userConfig[key] = document.querySelector(userConfig[key]);
		    }
		  });
		  return userConfig;
		}
	
		function overload(index, length, name, value, source) {
		  var formats = {};
		  if (typeof index.index === 'number' && typeof index.length === 'number') {
		    // Allow for throwaway end (used by insertText/insertEmbed)
		    if (typeof length !== 'number') {
		      source = value, value = name, name = length, length = index.length, index = index.index;
		    } else {
		      length = index.length, index = index.index;
		    }
		  } else if (typeof length !== 'number') {
		    source = value, value = name, name = length, length = 0;
		  }
		  // Handle format being object, two format name/value strings or excluded
		  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
		    formats = name;
		    source = value;
		  } else if (typeof name === 'string') {
		    if (value != null) {
		      formats[name] = value;
		    } else {
		      source = name;
		    }
		  }
		  // Handle optional source
		  source = source || _emitter2.default.sources.API;
		  return [index, length, formats, source];
		}
	
		function shiftRange(range, index, length, source) {
		  if (range == null) return null;
		  var start = void 0,
		      end = void 0;
		  if (index instanceof _delta2.default) {
		    var _map = [range.index, range.index + range.length].map(function (pos) {
		      return index.transformPosition(pos, source === _emitter2.default.sources.USER);
		    });
	
		    var _map2 = _slicedToArray(_map, 2);
	
		    start = _map2[0];
		    end = _map2[1];
		  } else {
		    var _map3 = [range.index, range.index + range.length].map(function (pos) {
		      if (pos < index || pos === index && source !== _emitter2.default.sources.USER) return pos;
		      if (length >= 0) {
		        return pos + length;
		      } else {
		        return Math.max(index, pos + length);
		      }
		    });
	
		    var _map4 = _slicedToArray(_map3, 2);
	
		    start = _map4[0];
		    end = _map4[1];
		  }
		  return new _selection.Range(start, end - start);
		}
	
		exports.expandConfig = expandConfig;
		exports.overload = overload;
		exports.default = Quill;
	
	/***/ },
	/* 20 */
	/***/ function(module, exports) {
	
		'use strict';
	
		var elem = document.createElement('div');
		elem.classList.toggle('test-class', false);
		if (elem.classList.contains('test-class')) {
		  (function () {
		    var _toggle = DOMTokenList.prototype.toggle;
		    DOMTokenList.prototype.toggle = function (token, force) {
		      if (arguments.length > 1 && !this.contains(token) === !force) {
		        return force;
		      } else {
		        return _toggle.call(this, token);
		      }
		    };
		  })();
		}
	
		if (!String.prototype.startsWith) {
		  String.prototype.startsWith = function (searchString, position) {
		    position = position || 0;
		    return this.substr(position, searchString.length) === searchString;
		  };
		}
	
		if (!String.prototype.endsWith) {
		  String.prototype.endsWith = function (searchString, position) {
		    var subjectString = this.toString();
		    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
		      position = subjectString.length;
		    }
		    position -= searchString.length;
		    var lastIndex = subjectString.indexOf(searchString, position);
		    return lastIndex !== -1 && lastIndex === position;
		  };
		}
	
		if (!Array.prototype.find) {
		  Object.defineProperty(Array.prototype, "find", {
		    value: function value(predicate) {
		      if (this === null) {
		        throw new TypeError('Array.prototype.find called on null or undefined');
		      }
		      if (typeof predicate !== 'function') {
		        throw new TypeError('predicate must be a function');
		      }
		      var list = Object(this);
		      var length = list.length >>> 0;
		      var thisArg = arguments[1];
		      var value;
	
		      for (var i = 0; i < length; i++) {
		        value = list[i];
		        if (predicate.call(thisArg, value, i, list)) {
		          return value;
		        }
		      }
		      return undefined;
		    }
		  });
		}
	
		// Disable resizing in Firefox
		document.addEventListener("DOMContentLoaded", function () {
		  document.execCommand("enableObjectResizing", false, false);
		});
	
	/***/ },
	/* 21 */
	/***/ function(module, exports, __webpack_require__) {
	
		var diff = __webpack_require__(22);
		var equal = __webpack_require__(23);
		var extend = __webpack_require__(26);
		var op = __webpack_require__(27);
	
	
		var NULL_CHARACTER = String.fromCharCode(0);  // Placeholder char for embed in diff()
	
	
		var Delta = function (ops) {
		  // Assume we are given a well formed ops
		  if (Array.isArray(ops)) {
		    this.ops = ops;
		  } else if (ops != null && Array.isArray(ops.ops)) {
		    this.ops = ops.ops;
		  } else {
		    this.ops = [];
		  }
		};
	
	
		Delta.prototype.insert = function (text, attributes) {
		  var newOp = {};
		  if (text.length === 0) return this;
		  newOp.insert = text;
		  if (typeof attributes === 'object' && Object.keys(attributes).length > 0) newOp.attributes = attributes;
		  return this.push(newOp);
		};
	
		Delta.prototype['delete'] = function (length) {
		  if (length <= 0) return this;
		  return this.push({ 'delete': length });
		};
	
		Delta.prototype.retain = function (length, attributes) {
		  if (length <= 0) return this;
		  var newOp = { retain: length };
		  if (typeof attributes === 'object' && Object.keys(attributes).length > 0) newOp.attributes = attributes;
		  return this.push(newOp);
		};
	
		Delta.prototype.push = function (newOp) {
		  var index = this.ops.length;
		  var lastOp = this.ops[index - 1];
		  newOp = extend(true, {}, newOp);
		  if (typeof lastOp === 'object') {
		    if (typeof newOp['delete'] === 'number' && typeof lastOp['delete'] === 'number') {
		      this.ops[index - 1] = { 'delete': lastOp['delete'] + newOp['delete'] };
		      return this;
		    }
		    // Since it does not matter if we insert before or after deleting at the same index,
		    // always prefer to insert first
		    if (typeof lastOp['delete'] === 'number' && newOp.insert != null) {
		      index -= 1;
		      lastOp = this.ops[index - 1];
		      if (typeof lastOp !== 'object') {
		        this.ops.unshift(newOp);
		        return this;
		      }
		    }
		    if (equal(newOp.attributes, lastOp.attributes)) {
		      if (typeof newOp.insert === 'string' && typeof lastOp.insert === 'string') {
		        this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
		        if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes
		        return this;
		      } else if (typeof newOp.retain === 'number' && typeof lastOp.retain === 'number') {
		        this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
		        if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes
		        return this;
		      }
		    }
		  }
		  if (index === this.ops.length) {
		    this.ops.push(newOp);
		  } else {
		    this.ops.splice(index, 0, newOp);
		  }
		  return this;
		};
	
		Delta.prototype.chop = function () {
		  var lastOp = this.ops[this.ops.length - 1];
		  if (lastOp && lastOp.retain && !lastOp.attributes) {
		    this.ops.pop();
		  }
		  return this;
		};
	
		Delta.prototype.length = function () {
		  return this.ops.reduce(function (length, elem) {
		    return length + op.length(elem);
		  }, 0);
		};
	
		Delta.prototype.slice = function (start, end) {
		  start = start || 0;
		  if (typeof end !== 'number') end = Infinity;
		  var ops = [];
		  var iter = op.iterator(this.ops);
		  var index = 0;
		  while (index < end && iter.hasNext()) {
		    var nextOp;
		    if (index < start) {
		      nextOp = iter.next(start - index);
		    } else {
		      nextOp = iter.next(end - index);
		      ops.push(nextOp);
		    }
		    index += op.length(nextOp);
		  }
		  return new Delta(ops);
		};
	
	
		Delta.prototype.compose = function (other) {
		  var thisIter = op.iterator(this.ops);
		  var otherIter = op.iterator(other.ops);
		  var delta = new Delta();
		  while (thisIter.hasNext() || otherIter.hasNext()) {
		    if (otherIter.peekType() === 'insert') {
		      delta.push(otherIter.next());
		    } else if (thisIter.peekType() === 'delete') {
		      delta.push(thisIter.next());
		    } else {
		      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
		      var thisOp = thisIter.next(length);
		      var otherOp = otherIter.next(length);
		      if (typeof otherOp.retain === 'number') {
		        var newOp = {};
		        if (typeof thisOp.retain === 'number') {
		          newOp.retain = length;
		        } else {
		          newOp.insert = thisOp.insert;
		        }
		        // Preserve null when composing with a retain, otherwise remove it for inserts
		        var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
		        if (attributes) newOp.attributes = attributes;
		        delta.push(newOp);
		      // Other op should be delete, we could be an insert or retain
		      // Insert + delete cancels out
		      } else if (typeof otherOp['delete'] === 'number' && typeof thisOp.retain === 'number') {
		        delta.push(otherOp);
		      }
		    }
		  }
		  return delta.chop();
		};
	
		Delta.prototype.concat = function (other) {
		  var delta = new Delta(this.ops.slice());
		  if (other.ops.length > 0) {
		    delta.push(other.ops[0]);
		    delta.ops = delta.ops.concat(other.ops.slice(1));
		  }
		  return delta;
		};
	
		Delta.prototype.diff = function (other) {
		  var delta = new Delta();
		  if (this.ops === other.ops) {
		    return delta;
		  }
		  var strings = [this.ops, other.ops].map(function (ops) {
		    return ops.map(function (op) {
		      if (op.insert != null) {
		        return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
		      }
		      var prep = (ops === other.ops) ? 'on' : 'with';
		      throw new Error('diff() called ' + prep + ' non-document');
		    }).join('');
		  });
		  var diffResult = diff(strings[0], strings[1]);
		  var thisIter = op.iterator(this.ops);
		  var otherIter = op.iterator(other.ops);
		  diffResult.forEach(function (component) {
		    var length = component[1].length;
		    while (length > 0) {
		      var opLength = 0;
		      switch (component[0]) {
		        case diff.INSERT:
		          opLength = Math.min(otherIter.peekLength(), length);
		          delta.push(otherIter.next(opLength));
		          break;
		        case diff.DELETE:
		          opLength = Math.min(length, thisIter.peekLength());
		          thisIter.next(opLength);
		          delta['delete'](opLength);
		          break;
		        case diff.EQUAL:
		          opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
		          var thisOp = thisIter.next(opLength);
		          var otherOp = otherIter.next(opLength);
		          if (equal(thisOp.insert, otherOp.insert)) {
		            delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
		          } else {
		            delta.push(otherOp)['delete'](opLength);
		          }
		          break;
		      }
		      length -= opLength;
		    }
		  });
		  return delta.chop();
		};
	
		Delta.prototype.transform = function (other, priority) {
		  priority = !!priority;
		  if (typeof other === 'number') {
		    return this.transformPosition(other, priority);
		  }
		  var thisIter = op.iterator(this.ops);
		  var otherIter = op.iterator(other.ops);
		  var delta = new Delta();
		  while (thisIter.hasNext() || otherIter.hasNext()) {
		    if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
		      delta.retain(op.length(thisIter.next()));
		    } else if (otherIter.peekType() === 'insert') {
		      delta.push(otherIter.next());
		    } else {
		      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
		      var thisOp = thisIter.next(length);
		      var otherOp = otherIter.next(length);
		      if (thisOp['delete']) {
		        // Our delete either makes their delete redundant or removes their retain
		        continue;
		      } else if (otherOp['delete']) {
		        delta.push(otherOp);
		      } else {
		        // We retain either their retain or insert
		        delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
		      }
		    }
		  }
		  return delta.chop();
		};
	
		Delta.prototype.transformPosition = function (index, priority) {
		  priority = !!priority;
		  var thisIter = op.iterator(this.ops);
		  var offset = 0;
		  while (thisIter.hasNext() && offset <= index) {
		    var length = thisIter.peekLength();
		    var nextType = thisIter.peekType();
		    thisIter.next();
		    if (nextType === 'delete') {
		      index -= Math.min(length, index - offset);
		      continue;
		    } else if (nextType === 'insert' && (offset < index || !priority)) {
		      index += length;
		    }
		    offset += length;
		  }
		  return index;
		};
	
	
		module.exports = Delta;
	
	
	/***/ },
	/* 22 */
	/***/ function(module, exports) {
	
		/**
		 * This library modifies the diff-patch-match library by Neil Fraser
		 * by removing the patch and match functionality and certain advanced
		 * options in the diff function. The original license is as follows:
		 *
		 * ===
		 *
		 * Diff Match and Patch
		 *
		 * Copyright 2006 Google Inc.
		 * http://code.google.com/p/google-diff-match-patch/
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *   http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
	
	
		/**
		 * The data structure representing a diff is an array of tuples:
		 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
		 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
		 */
		var DIFF_DELETE = -1;
		var DIFF_INSERT = 1;
		var DIFF_EQUAL = 0;
	
	
		/**
		 * Find the differences between two texts.  Simplifies the problem by stripping
		 * any common prefix or suffix off the texts before diffing.
		 * @param {string} text1 Old string to be diffed.
		 * @param {string} text2 New string to be diffed.
		 * @return {Array} Array of diff tuples.
		 */
		function diff_main(text1, text2) {
		  // Check for equality (speedup).
		  if (text1 == text2) {
		    if (text1) {
		      return [[DIFF_EQUAL, text1]];
		    }
		    return [];
		  }
	
		  // Trim off common prefix (speedup).
		  var commonlength = diff_commonPrefix(text1, text2);
		  var commonprefix = text1.substring(0, commonlength);
		  text1 = text1.substring(commonlength);
		  text2 = text2.substring(commonlength);
	
		  // Trim off common suffix (speedup).
		  commonlength = diff_commonSuffix(text1, text2);
		  var commonsuffix = text1.substring(text1.length - commonlength);
		  text1 = text1.substring(0, text1.length - commonlength);
		  text2 = text2.substring(0, text2.length - commonlength);
	
		  // Compute the diff on the middle block.
		  var diffs = diff_compute_(text1, text2);
	
		  // Restore the prefix and suffix.
		  if (commonprefix) {
		    diffs.unshift([DIFF_EQUAL, commonprefix]);
		  }
		  if (commonsuffix) {
		    diffs.push([DIFF_EQUAL, commonsuffix]);
		  }
		  diff_cleanupMerge(diffs);
		  return diffs;
		};
	
	
		/**
		 * Find the differences between two texts.  Assumes that the texts do not
		 * have any common prefix or suffix.
		 * @param {string} text1 Old string to be diffed.
		 * @param {string} text2 New string to be diffed.
		 * @return {Array} Array of diff tuples.
		 */
		function diff_compute_(text1, text2) {
		  var diffs;
	
		  if (!text1) {
		    // Just add some text (speedup).
		    return [[DIFF_INSERT, text2]];
		  }
	
		  if (!text2) {
		    // Just delete some text (speedup).
		    return [[DIFF_DELETE, text1]];
		  }
	
		  var longtext = text1.length > text2.length ? text1 : text2;
		  var shorttext = text1.length > text2.length ? text2 : text1;
		  var i = longtext.indexOf(shorttext);
		  if (i != -1) {
		    // Shorter text is inside the longer text (speedup).
		    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
		             [DIFF_EQUAL, shorttext],
		             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
		    // Swap insertions for deletions if diff is reversed.
		    if (text1.length > text2.length) {
		      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
		    }
		    return diffs;
		  }
	
		  if (shorttext.length == 1) {
		    // Single character string.
		    // After the previous speedup, the character can't be an equality.
		    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
		  }
	
		  // Check to see if the problem can be split in two.
		  var hm = diff_halfMatch_(text1, text2);
		  if (hm) {
		    // A half-match was found, sort out the return data.
		    var text1_a = hm[0];
		    var text1_b = hm[1];
		    var text2_a = hm[2];
		    var text2_b = hm[3];
		    var mid_common = hm[4];
		    // Send both pairs off for separate processing.
		    var diffs_a = diff_main(text1_a, text2_a);
		    var diffs_b = diff_main(text1_b, text2_b);
		    // Merge the results.
		    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
		  }
	
		  return diff_bisect_(text1, text2);
		};
	
	
		/**
		 * Find the 'middle snake' of a diff, split the problem in two
		 * and return the recursively constructed diff.
		 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
		 * @param {string} text1 Old string to be diffed.
		 * @param {string} text2 New string to be diffed.
		 * @return {Array} Array of diff tuples.
		 * @private
		 */
		function diff_bisect_(text1, text2) {
		  // Cache the text lengths to prevent multiple calls.
		  var text1_length = text1.length;
		  var text2_length = text2.length;
		  var max_d = Math.ceil((text1_length + text2_length) / 2);
		  var v_offset = max_d;
		  var v_length = 2 * max_d;
		  var v1 = new Array(v_length);
		  var v2 = new Array(v_length);
		  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
		  // integers and undefined.
		  for (var x = 0; x < v_length; x++) {
		    v1[x] = -1;
		    v2[x] = -1;
		  }
		  v1[v_offset + 1] = 0;
		  v2[v_offset + 1] = 0;
		  var delta = text1_length - text2_length;
		  // If the total number of characters is odd, then the front path will collide
		  // with the reverse path.
		  var front = (delta % 2 != 0);
		  // Offsets for start and end of k loop.
		  // Prevents mapping of space beyond the grid.
		  var k1start = 0;
		  var k1end = 0;
		  var k2start = 0;
		  var k2end = 0;
		  for (var d = 0; d < max_d; d++) {
		    // Walk the front path one step.
		    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
		      var k1_offset = v_offset + k1;
		      var x1;
		      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
		        x1 = v1[k1_offset + 1];
		      } else {
		        x1 = v1[k1_offset - 1] + 1;
		      }
		      var y1 = x1 - k1;
		      while (x1 < text1_length && y1 < text2_length &&
		             text1.charAt(x1) == text2.charAt(y1)) {
		        x1++;
		        y1++;
		      }
		      v1[k1_offset] = x1;
		      if (x1 > text1_length) {
		        // Ran off the right of the graph.
		        k1end += 2;
		      } else if (y1 > text2_length) {
		        // Ran off the bottom of the graph.
		        k1start += 2;
		      } else if (front) {
		        var k2_offset = v_offset + delta - k1;
		        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
		          // Mirror x2 onto top-left coordinate system.
		          var x2 = text1_length - v2[k2_offset];
		          if (x1 >= x2) {
		            // Overlap detected.
		            return diff_bisectSplit_(text1, text2, x1, y1);
		          }
		        }
		      }
		    }
	
		    // Walk the reverse path one step.
		    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
		      var k2_offset = v_offset + k2;
		      var x2;
		      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
		        x2 = v2[k2_offset + 1];
		      } else {
		        x2 = v2[k2_offset - 1] + 1;
		      }
		      var y2 = x2 - k2;
		      while (x2 < text1_length && y2 < text2_length &&
		             text1.charAt(text1_length - x2 - 1) ==
		             text2.charAt(text2_length - y2 - 1)) {
		        x2++;
		        y2++;
		      }
		      v2[k2_offset] = x2;
		      if (x2 > text1_length) {
		        // Ran off the left of the graph.
		        k2end += 2;
		      } else if (y2 > text2_length) {
		        // Ran off the top of the graph.
		        k2start += 2;
		      } else if (!front) {
		        var k1_offset = v_offset + delta - k2;
		        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
		          var x1 = v1[k1_offset];
		          var y1 = v_offset + x1 - k1_offset;
		          // Mirror x2 onto top-left coordinate system.
		          x2 = text1_length - x2;
		          if (x1 >= x2) {
		            // Overlap detected.
		            return diff_bisectSplit_(text1, text2, x1, y1);
		          }
		        }
		      }
		    }
		  }
		  // Diff took too long and hit the deadline or
		  // number of diffs equals number of characters, no commonality at all.
		  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
		};
	
	
		/**
		 * Given the location of the 'middle snake', split the diff in two parts
		 * and recurse.
		 * @param {string} text1 Old string to be diffed.
		 * @param {string} text2 New string to be diffed.
		 * @param {number} x Index of split point in text1.
		 * @param {number} y Index of split point in text2.
		 * @return {Array} Array of diff tuples.
		 */
		function diff_bisectSplit_(text1, text2, x, y) {
		  var text1a = text1.substring(0, x);
		  var text2a = text2.substring(0, y);
		  var text1b = text1.substring(x);
		  var text2b = text2.substring(y);
	
		  // Compute both diffs serially.
		  var diffs = diff_main(text1a, text2a);
		  var diffsb = diff_main(text1b, text2b);
	
		  return diffs.concat(diffsb);
		};
	
	
		/**
		 * Determine the common prefix of two strings.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {number} The number of characters common to the start of each
		 *     string.
		 */
		function diff_commonPrefix(text1, text2) {
		  // Quick check for common null cases.
		  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
		    return 0;
		  }
		  // Binary search.
		  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
		  var pointermin = 0;
		  var pointermax = Math.min(text1.length, text2.length);
		  var pointermid = pointermax;
		  var pointerstart = 0;
		  while (pointermin < pointermid) {
		    if (text1.substring(pointerstart, pointermid) ==
		        text2.substring(pointerstart, pointermid)) {
		      pointermin = pointermid;
		      pointerstart = pointermin;
		    } else {
		      pointermax = pointermid;
		    }
		    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
		  }
		  return pointermid;
		};
	
	
		/**
		 * Determine the common suffix of two strings.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {number} The number of characters common to the end of each string.
		 */
		function diff_commonSuffix(text1, text2) {
		  // Quick check for common null cases.
		  if (!text1 || !text2 ||
		      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
		    return 0;
		  }
		  // Binary search.
		  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
		  var pointermin = 0;
		  var pointermax = Math.min(text1.length, text2.length);
		  var pointermid = pointermax;
		  var pointerend = 0;
		  while (pointermin < pointermid) {
		    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
		        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
		      pointermin = pointermid;
		      pointerend = pointermin;
		    } else {
		      pointermax = pointermid;
		    }
		    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
		  }
		  return pointermid;
		};
	
	
		/**
		 * Do the two texts share a substring which is at least half the length of the
		 * longer text?
		 * This speedup can produce non-minimal diffs.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {Array.<string>} Five element Array, containing the prefix of
		 *     text1, the suffix of text1, the prefix of text2, the suffix of
		 *     text2 and the common middle.  Or null if there was no match.
		 */
		function diff_halfMatch_(text1, text2) {
		  var longtext = text1.length > text2.length ? text1 : text2;
		  var shorttext = text1.length > text2.length ? text2 : text1;
		  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
		    return null;  // Pointless.
		  }
	
		  /**
		   * Does a substring of shorttext exist within longtext such that the substring
		   * is at least half the length of longtext?
		   * Closure, but does not reference any external variables.
		   * @param {string} longtext Longer string.
		   * @param {string} shorttext Shorter string.
		   * @param {number} i Start index of quarter length substring within longtext.
		   * @return {Array.<string>} Five element Array, containing the prefix of
		   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
		   *     of shorttext and the common middle.  Or null if there was no match.
		   * @private
		   */
		  function diff_halfMatchI_(longtext, shorttext, i) {
		    // Start with a 1/4 length substring at position i as a seed.
		    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
		    var j = -1;
		    var best_common = '';
		    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
		    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
		      var prefixLength = diff_commonPrefix(longtext.substring(i),
		                                           shorttext.substring(j));
		      var suffixLength = diff_commonSuffix(longtext.substring(0, i),
		                                           shorttext.substring(0, j));
		      if (best_common.length < suffixLength + prefixLength) {
		        best_common = shorttext.substring(j - suffixLength, j) +
		            shorttext.substring(j, j + prefixLength);
		        best_longtext_a = longtext.substring(0, i - suffixLength);
		        best_longtext_b = longtext.substring(i + prefixLength);
		        best_shorttext_a = shorttext.substring(0, j - suffixLength);
		        best_shorttext_b = shorttext.substring(j + prefixLength);
		      }
		    }
		    if (best_common.length * 2 >= longtext.length) {
		      return [best_longtext_a, best_longtext_b,
		              best_shorttext_a, best_shorttext_b, best_common];
		    } else {
		      return null;
		    }
		  }
	
		  // First check if the second quarter is the seed for a half-match.
		  var hm1 = diff_halfMatchI_(longtext, shorttext,
		                             Math.ceil(longtext.length / 4));
		  // Check again based on the third quarter.
		  var hm2 = diff_halfMatchI_(longtext, shorttext,
		                             Math.ceil(longtext.length / 2));
		  var hm;
		  if (!hm1 && !hm2) {
		    return null;
		  } else if (!hm2) {
		    hm = hm1;
		  } else if (!hm1) {
		    hm = hm2;
		  } else {
		    // Both matched.  Select the longest.
		    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
		  }
	
		  // A half-match was found, sort out the return data.
		  var text1_a, text1_b, text2_a, text2_b;
		  if (text1.length > text2.length) {
		    text1_a = hm[0];
		    text1_b = hm[1];
		    text2_a = hm[2];
		    text2_b = hm[3];
		  } else {
		    text2_a = hm[0];
		    text2_b = hm[1];
		    text1_a = hm[2];
		    text1_b = hm[3];
		  }
		  var mid_common = hm[4];
		  return [text1_a, text1_b, text2_a, text2_b, mid_common];
		};
	
	
		/**
		 * Reorder and merge like edit sections.  Merge equalities.
		 * Any edit section can move as long as it doesn't cross an equality.
		 * @param {Array} diffs Array of diff tuples.
		 */
		function diff_cleanupMerge(diffs) {
		  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
		  var pointer = 0;
		  var count_delete = 0;
		  var count_insert = 0;
		  var text_delete = '';
		  var text_insert = '';
		  var commonlength;
		  while (pointer < diffs.length) {
		    switch (diffs[pointer][0]) {
		      case DIFF_INSERT:
		        count_insert++;
		        text_insert += diffs[pointer][1];
		        pointer++;
		        break;
		      case DIFF_DELETE:
		        count_delete++;
		        text_delete += diffs[pointer][1];
		        pointer++;
		        break;
		      case DIFF_EQUAL:
		        // Upon reaching an equality, check for prior redundancies.
		        if (count_delete + count_insert > 1) {
		          if (count_delete !== 0 && count_insert !== 0) {
		            // Factor out any common prefixies.
		            commonlength = diff_commonPrefix(text_insert, text_delete);
		            if (commonlength !== 0) {
		              if ((pointer - count_delete - count_insert) > 0 &&
		                  diffs[pointer - count_delete - count_insert - 1][0] ==
		                  DIFF_EQUAL) {
		                diffs[pointer - count_delete - count_insert - 1][1] +=
		                    text_insert.substring(0, commonlength);
		              } else {
		                diffs.splice(0, 0, [DIFF_EQUAL,
		                                    text_insert.substring(0, commonlength)]);
		                pointer++;
		              }
		              text_insert = text_insert.substring(commonlength);
		              text_delete = text_delete.substring(commonlength);
		            }
		            // Factor out any common suffixies.
		            commonlength = diff_commonSuffix(text_insert, text_delete);
		            if (commonlength !== 0) {
		              diffs[pointer][1] = text_insert.substring(text_insert.length -
		                  commonlength) + diffs[pointer][1];
		              text_insert = text_insert.substring(0, text_insert.length -
		                  commonlength);
		              text_delete = text_delete.substring(0, text_delete.length -
		                  commonlength);
		            }
		          }
		          // Delete the offending records and add the merged ones.
		          if (count_delete === 0) {
		            diffs.splice(pointer - count_insert,
		                count_delete + count_insert, [DIFF_INSERT, text_insert]);
		          } else if (count_insert === 0) {
		            diffs.splice(pointer - count_delete,
		                count_delete + count_insert, [DIFF_DELETE, text_delete]);
		          } else {
		            diffs.splice(pointer - count_delete - count_insert,
		                count_delete + count_insert, [DIFF_DELETE, text_delete],
		                [DIFF_INSERT, text_insert]);
		          }
		          pointer = pointer - count_delete - count_insert +
		                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
		        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
		          // Merge this equality with the previous one.
		          diffs[pointer - 1][1] += diffs[pointer][1];
		          diffs.splice(pointer, 1);
		        } else {
		          pointer++;
		        }
		        count_insert = 0;
		        count_delete = 0;
		        text_delete = '';
		        text_insert = '';
		        break;
		    }
		  }
		  if (diffs[diffs.length - 1][1] === '') {
		    diffs.pop();  // Remove the dummy entry at the end.
		  }
	
		  // Second pass: look for single edits surrounded on both sides by equalities
		  // which can be shifted sideways to eliminate an equality.
		  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
		  var changes = false;
		  pointer = 1;
		  // Intentionally ignore the first and last element (don't need checking).
		  while (pointer < diffs.length - 1) {
		    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
		        diffs[pointer + 1][0] == DIFF_EQUAL) {
		      // This is a single edit surrounded by equalities.
		      if (diffs[pointer][1].substring(diffs[pointer][1].length -
		          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
		        // Shift the edit over the previous equality.
		        diffs[pointer][1] = diffs[pointer - 1][1] +
		            diffs[pointer][1].substring(0, diffs[pointer][1].length -
		                                        diffs[pointer - 1][1].length);
		        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
		        diffs.splice(pointer - 1, 1);
		        changes = true;
		      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
		          diffs[pointer + 1][1]) {
		        // Shift the edit over the next equality.
		        diffs[pointer - 1][1] += diffs[pointer + 1][1];
		        diffs[pointer][1] =
		            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
		            diffs[pointer + 1][1];
		        diffs.splice(pointer + 1, 1);
		        changes = true;
		      }
		    }
		    pointer++;
		  }
		  // If shifts were made, the diff needs reordering and another shift sweep.
		  if (changes) {
		    diff_cleanupMerge(diffs);
		  }
		};
	
	
		var diff = diff_main;
		diff.INSERT = DIFF_INSERT;
		diff.DELETE = DIFF_DELETE;
		diff.EQUAL = DIFF_EQUAL;
	
	
		module.exports = diff;
	
	
	/***/ },
	/* 23 */
	/***/ function(module, exports, __webpack_require__) {
	
		var pSlice = Array.prototype.slice;
		var objectKeys = __webpack_require__(24);
		var isArguments = __webpack_require__(25);
	
		var deepEqual = module.exports = function (actual, expected, opts) {
		  if (!opts) opts = {};
		  // 7.1. All identical values are equivalent, as determined by ===.
		  if (actual === expected) {
		    return true;
	
		  } else if (actual instanceof Date && expected instanceof Date) {
		    return actual.getTime() === expected.getTime();
	
		  // 7.3. Other pairs that do not both pass typeof value == 'object',
		  // equivalence is determined by ==.
		  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
		    return opts.strict ? actual === expected : actual == expected;
	
		  // 7.4. For all other Object pairs, including Array objects, equivalence is
		  // determined by having the same number of owned properties (as verified
		  // with Object.prototype.hasOwnProperty.call), the same set of keys
		  // (although not necessarily the same order), equivalent values for every
		  // corresponding key, and an identical 'prototype' property. Note: this
		  // accounts for both named and indexed properties on Arrays.
		  } else {
		    return objEquiv(actual, expected, opts);
		  }
		}
	
		function isUndefinedOrNull(value) {
		  return value === null || value === undefined;
		}
	
		function isBuffer (x) {
		  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
		  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
		    return false;
		  }
		  if (x.length > 0 && typeof x[0] !== 'number') return false;
		  return true;
		}
	
		function objEquiv(a, b, opts) {
		  var i, key;
		  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
		    return false;
		  // an identical 'prototype' property.
		  if (a.prototype !== b.prototype) return false;
		  //~~~I've managed to break Object.keys through screwy arguments passing.
		  //   Converting to array solves the problem.
		  if (isArguments(a)) {
		    if (!isArguments(b)) {
		      return false;
		    }
		    a = pSlice.call(a);
		    b = pSlice.call(b);
		    return deepEqual(a, b, opts);
		  }
		  if (isBuffer(a)) {
		    if (!isBuffer(b)) {
		      return false;
		    }
		    if (a.length !== b.length) return false;
		    for (i = 0; i < a.length; i++) {
		      if (a[i] !== b[i]) return false;
		    }
		    return true;
		  }
		  try {
		    var ka = objectKeys(a),
		        kb = objectKeys(b);
		  } catch (e) {//happens when one is a string literal and the other isn't
		    return false;
		  }
		  // having the same number of owned properties (keys incorporates
		  // hasOwnProperty)
		  if (ka.length != kb.length)
		    return false;
		  //the same set of keys (although not necessarily the same order),
		  ka.sort();
		  kb.sort();
		  //~~~cheap key test
		  for (i = ka.length - 1; i >= 0; i--) {
		    if (ka[i] != kb[i])
		      return false;
		  }
		  //equivalent values for every corresponding key, and
		  //~~~possibly expensive deep test
		  for (i = ka.length - 1; i >= 0; i--) {
		    key = ka[i];
		    if (!deepEqual(a[key], b[key], opts)) return false;
		  }
		  return typeof a === typeof b;
		}
	
	
	/***/ },
	/* 24 */
	/***/ function(module, exports) {
	
		exports = module.exports = typeof Object.keys === 'function'
		  ? Object.keys : shim;
	
		exports.shim = shim;
		function shim (obj) {
		  var keys = [];
		  for (var key in obj) keys.push(key);
		  return keys;
		}
	
	
	/***/ },
	/* 25 */
	/***/ function(module, exports) {
	
		var supportsArgumentsClass = (function(){
		  return Object.prototype.toString.call(arguments)
		})() == '[object Arguments]';
	
		exports = module.exports = supportsArgumentsClass ? supported : unsupported;
	
		exports.supported = supported;
		function supported(object) {
		  return Object.prototype.toString.call(object) == '[object Arguments]';
		};
	
		exports.unsupported = unsupported;
		function unsupported(object){
		  return object &&
		    typeof object == 'object' &&
		    typeof object.length == 'number' &&
		    Object.prototype.hasOwnProperty.call(object, 'callee') &&
		    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
		    false;
		};
	
	
	/***/ },
	/* 26 */
	/***/ function(module, exports) {
	
		'use strict';
	
		var hasOwn = Object.prototype.hasOwnProperty;
		var toStr = Object.prototype.toString;
	
		var isArray = function isArray(arr) {
			if (typeof Array.isArray === 'function') {
				return Array.isArray(arr);
			}
	
			return toStr.call(arr) === '[object Array]';
		};
	
		var isPlainObject = function isPlainObject(obj) {
			if (!obj || toStr.call(obj) !== '[object Object]') {
				return false;
			}
	
			var hasOwnConstructor = hasOwn.call(obj, 'constructor');
			var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
			// Not own constructor property must be Object
			if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
				return false;
			}
	
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			var key;
			for (key in obj) {/**/}
	
			return typeof key === 'undefined' || hasOwn.call(obj, key);
		};
	
		module.exports = function extend() {
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0],
				i = 1,
				length = arguments.length,
				deep = false;
	
			// Handle a deep copy situation
			if (typeof target === 'boolean') {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
				target = {};
			}
	
			for (; i < length; ++i) {
				options = arguments[i];
				// Only deal with non-null/undefined values
				if (options != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];
	
						// Prevent never-ending loop
						if (target !== copy) {
							// Recurse if we're merging plain objects or arrays
							if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
								if (copyIsArray) {
									copyIsArray = false;
									clone = src && isArray(src) ? src : [];
								} else {
									clone = src && isPlainObject(src) ? src : {};
								}
	
								// Never move original objects, clone them
								target[name] = extend(deep, clone, copy);
	
							// Don't bring in undefined values
							} else if (typeof copy !== 'undefined') {
								target[name] = copy;
							}
						}
					}
				}
			}
	
			// Return the modified object
			return target;
		};
	
	
	
	/***/ },
	/* 27 */
	/***/ function(module, exports, __webpack_require__) {
	
		var equal = __webpack_require__(23);
		var extend = __webpack_require__(26);
	
	
		var lib = {
		  attributes: {
		    compose: function (a, b, keepNull) {
		      if (typeof a !== 'object') a = {};
		      if (typeof b !== 'object') b = {};
		      var attributes = extend(true, {}, b);
		      if (!keepNull) {
		        attributes = Object.keys(attributes).reduce(function (copy, key) {
		          if (attributes[key] != null) {
		            copy[key] = attributes[key];
		          }
		          return copy;
		        }, {});
		      }
		      for (var key in a) {
		        if (a[key] !== undefined && b[key] === undefined) {
		          attributes[key] = a[key];
		        }
		      }
		      return Object.keys(attributes).length > 0 ? attributes : undefined;
		    },
	
		    diff: function(a, b) {
		      if (typeof a !== 'object') a = {};
		      if (typeof b !== 'object') b = {};
		      var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attributes, key) {
		        if (!equal(a[key], b[key])) {
		          attributes[key] = b[key] === undefined ? null : b[key];
		        }
		        return attributes;
		      }, {});
		      return Object.keys(attributes).length > 0 ? attributes : undefined;
		    },
	
		    transform: function (a, b, priority) {
		      if (typeof a !== 'object') return b;
		      if (typeof b !== 'object') return undefined;
		      if (!priority) return b;  // b simply overwrites us without priority
		      var attributes = Object.keys(b).reduce(function (attributes, key) {
		        if (a[key] === undefined) attributes[key] = b[key];  // null is a valid value
		        return attributes;
		      }, {});
		      return Object.keys(attributes).length > 0 ? attributes : undefined;
		    }
		  },
	
		  iterator: function (ops) {
		    return new Iterator(ops);
		  },
	
		  length: function (op) {
		    if (typeof op['delete'] === 'number') {
		      return op['delete'];
		    } else if (typeof op.retain === 'number') {
		      return op.retain;
		    } else {
		      return typeof op.insert === 'string' ? op.insert.length : 1;
		    }
		  }
		};
	
	
		function Iterator(ops) {
		  this.ops = ops;
		  this.index = 0;
		  this.offset = 0;
		};
	
		Iterator.prototype.hasNext = function () {
		  return this.peekLength() < Infinity;
		};
	
		Iterator.prototype.next = function (length) {
		  if (!length) length = Infinity;
		  var nextOp = this.ops[this.index];
		  if (nextOp) {
		    var offset = this.offset;
		    var opLength = lib.length(nextOp)
		    if (length >= opLength - offset) {
		      length = opLength - offset;
		      this.index += 1;
		      this.offset = 0;
		    } else {
		      this.offset += length;
		    }
		    if (typeof nextOp['delete'] === 'number') {
		      return { 'delete': length };
		    } else {
		      var retOp = {};
		      if (nextOp.attributes) {
		        retOp.attributes = nextOp.attributes;
		      }
		      if (typeof nextOp.retain === 'number') {
		        retOp.retain = length;
		      } else if (typeof nextOp.insert === 'string') {
		        retOp.insert = nextOp.insert.substr(offset, length);
		      } else {
		        // offset should === 0, length should === 1
		        retOp.insert = nextOp.insert;
		      }
		      return retOp;
		    }
		  } else {
		    return { retain: Infinity };
		  }
		};
	
		Iterator.prototype.peekLength = function () {
		  if (this.ops[this.index]) {
		    // Should never return 0 if our index is being managed correctly
		    return lib.length(this.ops[this.index]) - this.offset;
		  } else {
		    return Infinity;
		  }
		};
	
		Iterator.prototype.peekType = function () {
		  if (this.ops[this.index]) {
		    if (typeof this.ops[this.index]['delete'] === 'number') {
		      return 'delete';
		    } else if (typeof this.ops[this.index].retain === 'number') {
		      return 'retain';
		    } else {
		      return 'insert';
		    }
		  }
		  return 'retain';
		};
	
	
		module.exports = lib;
	
	
	/***/ },
	/* 28 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _op = __webpack_require__(27);
	
		var _op2 = _interopRequireDefault(_op);
	
		var _emitter3 = __webpack_require__(29);
	
		var _emitter4 = _interopRequireDefault(_emitter3);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _code = __webpack_require__(32);
	
		var _code2 = _interopRequireDefault(_code);
	
		var _cursor = __webpack_require__(38);
	
		var _cursor2 = _interopRequireDefault(_cursor);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		var _clone = __webpack_require__(39);
	
		var _clone2 = _interopRequireDefault(_clone);
	
		var _deepEqual = __webpack_require__(23);
	
		var _deepEqual2 = _interopRequireDefault(_deepEqual);
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var Editor = function () {
		  function Editor(scroll, emitter) {
		    _classCallCheck(this, Editor);
	
		    this.scroll = scroll;
		    this.emitter = emitter;
		    this.emitter.on(_emitter4.default.events.SCROLL_UPDATE, this.update.bind(this, null));
		    this.delta = this.getDelta();
		    this.enable();
		  }
	
		  _createClass(Editor, [{
		    key: 'applyDelta',
		    value: function applyDelta(delta) {
		      var _this = this;
	
		      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter4.default.sources.API : arguments[1];
	
		      var consumeNextNewline = false;
		      this.scroll.update();
		      var scrollLength = this.scroll.length();
		      this.scroll.batch = true;
		      delta = normalizeDelta(delta);
		      delta.ops.reduce(function (index, op) {
		        var length = op.retain || op.delete || op.insert.length || 1;
		        var attributes = op.attributes || {};
		        if (op.insert != null) {
		          if (typeof op.insert === 'string') {
		            var text = op.insert;
		            if (text.endsWith('\n') && consumeNextNewline) {
		              consumeNextNewline = false;
		              text = text.slice(0, -1);
		            }
		            if (index >= scrollLength && !text.endsWith('\n')) {
		              consumeNextNewline = true;
		            }
		            _this.scroll.insertAt(index, text);
	
		            var _scroll$line = _this.scroll.line(index);
	
		            var _scroll$line2 = _slicedToArray(_scroll$line, 2);
	
		            var line = _scroll$line2[0];
		            var offset = _scroll$line2[1];
	
		            var formats = (0, _extend2.default)({}, (0, _block.bubbleFormats)(line));
		            if (line instanceof _block2.default) {
		              var _line$descendant = line.descendant(_parchment2.default.Leaf, offset);
	
		              var _line$descendant2 = _slicedToArray(_line$descendant, 1);
	
		              var leaf = _line$descendant2[0];
	
		              formats = (0, _extend2.default)(formats, (0, _block.bubbleFormats)(leaf));
		            }
		            attributes = _op2.default.attributes.diff(formats, attributes) || {};
		          } else if (_typeof(op.insert) === 'object') {
		            var key = Object.keys(op.insert)[0]; // There should only be one key
		            if (key == null) return index;
		            _this.scroll.insertAt(index, key, op.insert[key]);
		          }
		          scrollLength += length;
		        }
		        Object.keys(attributes).forEach(function (name) {
		          _this.scroll.formatAt(index, length, name, attributes[name]);
		        });
		        return index + length;
		      }, 0);
		      delta.ops.reduce(function (index, op) {
		        if (typeof op.delete === 'number') {
		          _this.scroll.deleteAt(index, op.delete);
		          return index;
		        }
		        return index + (op.retain || op.insert.length || 1);
		      }, 0);
		      this.scroll.batch = false;
		      this.scroll.optimize();
		      return this.update(delta, source);
		    }
		  }, {
		    key: 'deleteText',
		    value: function deleteText(index, length) {
		      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter4.default.sources.API : arguments[2];
	
		      this.scroll.deleteAt(index, length);
		      return this.update(new _delta2.default().retain(index).delete(length), source);
		    }
		  }, {
		    key: 'enable',
		    value: function enable() {
		      var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
		      this.scroll.domNode.setAttribute('contenteditable', enabled);
		    }
		  }, {
		    key: 'formatLine',
		    value: function formatLine(index, length) {
		      var _this2 = this;
	
		      var formats = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];
	
		      this.scroll.update();
		      Object.keys(formats).forEach(function (format) {
		        var lines = _this2.scroll.lines(index, Math.max(length, 1));
		        var lengthRemaining = length;
		        lines.forEach(function (line, i) {
		          var lineLength = line.length();
		          if (!(line instanceof _code2.default)) {
		            line.format(format, formats[format]);
		          } else {
		            var codeIndex = index - line.offset(_this2.scroll);
		            var codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
		            line.formatAt(codeIndex, codeLength, format, formats[format]);
		          }
		          lengthRemaining -= lineLength;
		        });
		      });
		      this.scroll.optimize();
		      return this.update(new _delta2.default().retain(index).retain(length, (0, _clone2.default)(formats)), source);
		    }
		  }, {
		    key: 'formatText',
		    value: function formatText(index, length) {
		      var _this3 = this;
	
		      var formats = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];
	
		      Object.keys(formats).forEach(function (format) {
		        _this3.scroll.formatAt(index, length, format, formats[format]);
		      });
		      return this.update(new _delta2.default().retain(index).retain(length, (0, _clone2.default)(formats)), source);
		    }
		  }, {
		    key: 'getContents',
		    value: function getContents(index, length) {
		      return this.delta.slice(index, index + length);
		    }
		  }, {
		    key: 'getDelta',
		    value: function getDelta() {
		      return this.scroll.lines().reduce(function (delta, line) {
		        return delta.concat(line.delta());
		      }, new _delta2.default());
		    }
		  }, {
		    key: 'getFormat',
		    value: function getFormat(index) {
		      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
		      var lines = [],
		          leaves = [];
		      if (length === 0) {
		        this.scroll.path(index).forEach(function (path) {
		          var _path = _slicedToArray(path, 1);
	
		          var blot = _path[0];
	
		          if (blot instanceof _block2.default) {
		            lines.push(blot);
		          } else if (blot instanceof _parchment2.default.Leaf) {
		            leaves.push(blot);
		          }
		        });
		      } else {
		        lines = this.scroll.lines(index, length);
		        leaves = this.scroll.descendants(_parchment2.default.Leaf, index, length);
		      }
		      var formatsArr = [lines, leaves].map(function (blots) {
		        if (blots.length === 0) return {};
		        var formats = (0, _block.bubbleFormats)(blots.shift());
		        while (Object.keys(formats).length > 0) {
		          var blot = blots.shift();
		          if (blot == null) return formats;
		          formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
		        }
		        return formats;
		      });
		      return _extend2.default.apply(_extend2.default, formatsArr);
		    }
		  }, {
		    key: 'getText',
		    value: function getText(index, length) {
		      return this.getContents(index, length).ops.map(function (op) {
		        return typeof op.insert === 'string' ? op.insert : '';
		      }).join('');
		    }
		  }, {
		    key: 'insertEmbed',
		    value: function insertEmbed(index, embed, value) {
		      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];
	
		      this.scroll.insertAt(index, embed, value);
		      return this.update(new _delta2.default().retain(index).insert(_defineProperty({}, embed, value)), source);
		    }
		  }, {
		    key: 'insertText',
		    value: function insertText(index, text) {
		      var _this4 = this;
	
		      var formats = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];
	
		      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
		      this.scroll.insertAt(index, text);
		      Object.keys(formats).forEach(function (format) {
		        _this4.scroll.formatAt(index, text.length, format, formats[format]);
		      });
		      return this.update(new _delta2.default().retain(index).insert(text, (0, _clone2.default)(formats)), source);
		    }
		  }, {
		    key: 'isBlank',
		    value: function isBlank() {
		      if (this.scroll.children.length == 0) return true;
		      if (this.scroll.children.length > 1) return false;
		      var child = this.scroll.children.head;
		      return child.length() <= 1 && Object.keys(child.formats()).length == 0;
		    }
		  }, {
		    key: 'removeFormat',
		    value: function removeFormat(index, length, source) {
		      var text = this.getText(index, length);
	
		      var _scroll$line3 = this.scroll.line(index + length);
	
		      var _scroll$line4 = _slicedToArray(_scroll$line3, 2);
	
		      var line = _scroll$line4[0];
		      var offset = _scroll$line4[1];
	
		      var suffixLength = 0,
		          suffix = new _delta2.default();
		      if (line != null) {
		        if (!(line instanceof _code2.default)) {
		          suffixLength = line.length() - offset;
		        } else {
		          suffixLength = line.newlineIndex(offset) - offset + 1;
		        }
		        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
		      }
		      var contents = this.getContents(index, length + suffixLength);
		      var diff = contents.diff(new _delta2.default().insert(text).concat(suffix));
		      var delta = new _delta2.default().retain(index).concat(diff);
		      return this.applyDelta(delta, source);
		    }
		  }, {
		    key: 'update',
		    value: function update(change) {
		      var _this5 = this;
	
		      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter4.default.sources.USER : arguments[1];
		      var mutations = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
		      var oldDelta = this.delta;
		      if (mutations.length === 1 && mutations[0].type === 'characterData' && _parchment2.default.find(mutations[0].target)) {
		        (function () {
		          // Optimization for character changes
		          var textBlot = _parchment2.default.find(mutations[0].target);
		          var formats = (0, _block.bubbleFormats)(textBlot);
		          var index = textBlot.offset(_this5.scroll);
		          var oldValue = mutations[0].oldValue.replace(_cursor2.default.CONTENTS, '');
		          var oldText = new _delta2.default().insert(oldValue);
		          var newText = new _delta2.default().insert(textBlot.value());
		          var diffDelta = new _delta2.default().retain(index).concat(oldText.diff(newText));
		          change = diffDelta.ops.reduce(function (delta, op) {
		            if (op.insert) {
		              return delta.insert(op.insert, formats);
		            } else {
		              return delta.push(op);
		            }
		          }, new _delta2.default());
		          _this5.delta = oldDelta.compose(change);
		        })();
		      } else {
		        this.delta = this.getDelta();
		        if (!change || !(0, _deepEqual2.default)(oldDelta.compose(change), this.delta)) {
		          change = oldDelta.diff(this.delta);
		        }
		      }
		      if (change.length() > 0) {
		        var _emitter;
	
		        var args = [_emitter4.default.events.TEXT_CHANGE, change, oldDelta, source];
		        (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
		        if (source !== _emitter4.default.sources.SILENT) {
		          var _emitter2;
	
		          (_emitter2 = this.emitter).emit.apply(_emitter2, args);
		        }
		      }
		      return change;
		    }
		  }]);
	
		  return Editor;
		}();
	
		function combineFormats(formats, combined) {
		  return Object.keys(combined).reduce(function (merged, name) {
		    if (formats[name] == null) return merged;
		    if (combined[name] === formats[name]) {
		      merged[name] = combined[name];
		    } else if (Array.isArray(combined[name])) {
		      if (combined[name].indexOf(formats[name]) < 0) {
		        merged[name] = combined[name].concat([formats[name]]);
		      }
		    } else {
		      merged[name] = [combined[name], formats[name]];
		    }
		    return merged;
		  }, {});
		}
	
		function normalizeDelta(delta) {
		  return delta.ops.reduce(function (delta, op) {
		    if (op.insert === 1) {
		      var attributes = (0, _clone2.default)(op.attributes);
		      delete attributes['image'];
		      return delta.insert({ image: op.attributes.image }, attributes);
		    }
		    if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
		      op = (0, _clone2.default)(op);
		      if (op.attributes.list) {
		        op.attributes.list = 'ordered';
		      } else {
		        op.attributes.list = 'bullet';
		        delete op.attributes.bullet;
		      }
		    }
		    if (typeof op.insert === 'string') {
		      var text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
		      return delta.insert(text, op.attributes);
		    }
		    return delta.push(op);
		  }, new _delta2.default());
		}
	
		exports.default = Editor;
	
	/***/ },
	/* 29 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _eventemitter = __webpack_require__(30);
	
		var _eventemitter2 = _interopRequireDefault(_eventemitter);
	
		var _logger = __webpack_require__(31);
	
		var _logger2 = _interopRequireDefault(_logger);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var debug = (0, _logger2.default)('quill:events');
	
		var Emitter = function (_EventEmitter) {
		  _inherits(Emitter, _EventEmitter);
	
		  function Emitter() {
		    _classCallCheck(this, Emitter);
	
		    var _this = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this));
	
		    _this.on('error', debug.error);
		    return _this;
		  }
	
		  _createClass(Emitter, [{
		    key: 'emit',
		    value: function emit() {
		      debug.log.apply(debug, arguments);
		      _get(Emitter.prototype.__proto__ || Object.getPrototypeOf(Emitter.prototype), 'emit', this).apply(this, arguments);
		    }
		  }]);
	
		  return Emitter;
		}(_eventemitter2.default);
	
		Emitter.events = {
		  EDITOR_CHANGE: 'editor-change',
		  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
		  SCROLL_OPTIMIZE: 'scroll-optimize',
		  SCROLL_UPDATE: 'scroll-update',
		  SELECTION_CHANGE: 'selection-change',
		  TEXT_CHANGE: 'text-change'
		};
		Emitter.sources = {
		  API: 'api',
		  SILENT: 'silent',
		  USER: 'user'
		};
	
		exports.default = Emitter;
	
	/***/ },
	/* 30 */
	/***/ function(module, exports) {
	
		'use strict';
	
		var has = Object.prototype.hasOwnProperty;
	
		//
		// We store our EE objects in a plain object whose properties are event names.
		// If `Object.create(null)` is not supported we prefix the event names with a
		// `~` to make sure that the built-in object properties are not overridden or
		// used as an attack vector.
		// We also assume that `Object.create(null)` is available when the event name
		// is an ES6 Symbol.
		//
		var prefix = typeof Object.create !== 'function' ? '~' : false;
	
		/**
		 * Representation of a single EventEmitter function.
		 *
		 * @param {Function} fn Event handler to be called.
		 * @param {Mixed} context Context for function execution.
		 * @param {Boolean} [once=false] Only emit once
		 * @api private
		 */
		function EE(fn, context, once) {
		  this.fn = fn;
		  this.context = context;
		  this.once = once || false;
		}
	
		/**
		 * Minimal EventEmitter interface that is molded against the Node.js
		 * EventEmitter interface.
		 *
		 * @constructor
		 * @api public
		 */
		function EventEmitter() { /* Nothing to set */ }
	
		/**
		 * Hold the assigned EventEmitters by name.
		 *
		 * @type {Object}
		 * @private
		 */
		EventEmitter.prototype._events = undefined;
	
		/**
		 * Return an array listing the events for which the emitter has registered
		 * listeners.
		 *
		 * @returns {Array}
		 * @api public
		 */
		EventEmitter.prototype.eventNames = function eventNames() {
		  var events = this._events
		    , names = []
		    , name;
	
		  if (!events) return names;
	
		  for (name in events) {
		    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		  }
	
		  if (Object.getOwnPropertySymbols) {
		    return names.concat(Object.getOwnPropertySymbols(events));
		  }
	
		  return names;
		};
	
		/**
		 * Return a list of assigned event listeners.
		 *
		 * @param {String} event The events that should be listed.
		 * @param {Boolean} exists We only need to know if there are listeners.
		 * @returns {Array|Boolean}
		 * @api public
		 */
		EventEmitter.prototype.listeners = function listeners(event, exists) {
		  var evt = prefix ? prefix + event : event
		    , available = this._events && this._events[evt];
	
		  if (exists) return !!available;
		  if (!available) return [];
		  if (available.fn) return [available.fn];
	
		  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
		    ee[i] = available[i].fn;
		  }
	
		  return ee;
		};
	
		/**
		 * Emit an event to all registered event listeners.
		 *
		 * @param {String} event The name of the event.
		 * @returns {Boolean} Indication if we've emitted an event.
		 * @api public
		 */
		EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		  var evt = prefix ? prefix + event : event;
	
		  if (!this._events || !this._events[evt]) return false;
	
		  var listeners = this._events[evt]
		    , len = arguments.length
		    , args
		    , i;
	
		  if ('function' === typeof listeners.fn) {
		    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
		    switch (len) {
		      case 1: return listeners.fn.call(listeners.context), true;
		      case 2: return listeners.fn.call(listeners.context, a1), true;
		      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
		      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
		      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
		      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
		    }
	
		    for (i = 1, args = new Array(len -1); i < len; i++) {
		      args[i - 1] = arguments[i];
		    }
	
		    listeners.fn.apply(listeners.context, args);
		  } else {
		    var length = listeners.length
		      , j;
	
		    for (i = 0; i < length; i++) {
		      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
		      switch (len) {
		        case 1: listeners[i].fn.call(listeners[i].context); break;
		        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
		        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
		        default:
		          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
		            args[j - 1] = arguments[j];
		          }
	
		          listeners[i].fn.apply(listeners[i].context, args);
		      }
		    }
		  }
	
		  return true;
		};
	
		/**
		 * Register a new EventListener for the given event.
		 *
		 * @param {String} event Name of the event.
		 * @param {Function} fn Callback function.
		 * @param {Mixed} [context=this] The context of the function.
		 * @api public
		 */
		EventEmitter.prototype.on = function on(event, fn, context) {
		  var listener = new EE(fn, context || this)
		    , evt = prefix ? prefix + event : event;
	
		  if (!this._events) this._events = prefix ? {} : Object.create(null);
		  if (!this._events[evt]) this._events[evt] = listener;
		  else {
		    if (!this._events[evt].fn) this._events[evt].push(listener);
		    else this._events[evt] = [
		      this._events[evt], listener
		    ];
		  }
	
		  return this;
		};
	
		/**
		 * Add an EventListener that's only called once.
		 *
		 * @param {String} event Name of the event.
		 * @param {Function} fn Callback function.
		 * @param {Mixed} [context=this] The context of the function.
		 * @api public
		 */
		EventEmitter.prototype.once = function once(event, fn, context) {
		  var listener = new EE(fn, context || this, true)
		    , evt = prefix ? prefix + event : event;
	
		  if (!this._events) this._events = prefix ? {} : Object.create(null);
		  if (!this._events[evt]) this._events[evt] = listener;
		  else {
		    if (!this._events[evt].fn) this._events[evt].push(listener);
		    else this._events[evt] = [
		      this._events[evt], listener
		    ];
		  }
	
		  return this;
		};
	
		/**
		 * Remove event listeners.
		 *
		 * @param {String} event The event we want to remove.
		 * @param {Function} fn The listener that we need to find.
		 * @param {Mixed} context Only remove listeners matching this context.
		 * @param {Boolean} once Only remove once listeners.
		 * @api public
		 */
		EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		  var evt = prefix ? prefix + event : event;
	
		  if (!this._events || !this._events[evt]) return this;
	
		  var listeners = this._events[evt]
		    , events = [];
	
		  if (fn) {
		    if (listeners.fn) {
		      if (
		           listeners.fn !== fn
		        || (once && !listeners.once)
		        || (context && listeners.context !== context)
		      ) {
		        events.push(listeners);
		      }
		    } else {
		      for (var i = 0, length = listeners.length; i < length; i++) {
		        if (
		             listeners[i].fn !== fn
		          || (once && !listeners[i].once)
		          || (context && listeners[i].context !== context)
		        ) {
		          events.push(listeners[i]);
		        }
		      }
		    }
		  }
	
		  //
		  // Reset the array, or remove it completely if we have no more listeners.
		  //
		  if (events.length) {
		    this._events[evt] = events.length === 1 ? events[0] : events;
		  } else {
		    delete this._events[evt];
		  }
	
		  return this;
		};
	
		/**
		 * Remove all listeners or only the listeners for the specified event.
		 *
		 * @param {String} event The event want to remove all listeners for.
		 * @api public
		 */
		EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		  if (!this._events) return this;
	
		  if (event) delete this._events[prefix ? prefix + event : event];
		  else this._events = prefix ? {} : Object.create(null);
	
		  return this;
		};
	
		//
		// Alias methods names because people roll like that.
		//
		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
		EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
		//
		// This function doesn't apply anymore.
		//
		EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
		  return this;
		};
	
		//
		// Expose the prefix.
		//
		EventEmitter.prefixed = prefix;
	
		//
		// Expose the module.
		//
		if ('undefined' !== typeof module) {
		  module.exports = EventEmitter;
		}
	
	
	/***/ },
	/* 31 */
	/***/ function(module, exports) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		var levels = ['error', 'warn', 'log', 'info'];
		var level = 'warn';
	
		function debug(method) {
		  if (levels.indexOf(method) <= levels.indexOf(level)) {
		    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		      args[_key - 1] = arguments[_key];
		    }
	
		    console[method].apply(console, args);
		  }
		}
	
		function namespace(ns) {
		  return levels.reduce(function (logger, method) {
		    logger[method] = debug.bind(console, method, ns);
		    return logger;
		  }, {});
		}
	
		debug.level = namespace.level = function (newLevel) {
		  level = newLevel;
		};
	
		exports.default = namespace;
	
	/***/ },
	/* 32 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.Code = undefined;
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		var _text = __webpack_require__(37);
	
		var _text2 = _interopRequireDefault(_text);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Code = function (_Inline) {
		  _inherits(Code, _Inline);
	
		  function Code() {
		    _classCallCheck(this, Code);
	
		    return _possibleConstructorReturn(this, (Code.__proto__ || Object.getPrototypeOf(Code)).apply(this, arguments));
		  }
	
		  return Code;
		}(_inline2.default);
	
		Code.blotName = 'code';
		Code.tagName = 'CODE';
	
		var CodeBlock = function (_Block) {
		  _inherits(CodeBlock, _Block);
	
		  function CodeBlock() {
		    _classCallCheck(this, CodeBlock);
	
		    return _possibleConstructorReturn(this, (CodeBlock.__proto__ || Object.getPrototypeOf(CodeBlock)).apply(this, arguments));
		  }
	
		  _createClass(CodeBlock, [{
		    key: 'delta',
		    value: function delta() {
		      var _this3 = this;
	
		      var text = this.domNode.textContent;
		      if (text.endsWith('\n')) {
		        // Should always be true
		        text = text.slice(0, -1);
		      }
		      return text.split('\n').reduce(function (delta, frag) {
		        return delta.insert(frag).insert('\n', _this3.formats());
		      }, new _delta2.default());
		    }
		  }, {
		    key: 'format',
		    value: function format(name, value) {
		      if (name === this.statics.blotName && value) return;
	
		      var _descendant = this.descendant(_text2.default, this.length() - 1);
	
		      var _descendant2 = _slicedToArray(_descendant, 1);
	
		      var text = _descendant2[0];
	
		      if (text != null) {
		        text.deleteAt(text.length() - 1, 1);
		      }
		      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'format', this).call(this, name, value);
		    }
		  }, {
		    key: 'formatAt',
		    value: function formatAt(index, length, name, value) {
		      if (length === 0) return;
		      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
		        return;
		      }
		      var nextNewline = this.newlineIndex(index);
		      if (nextNewline < 0 || nextNewline >= index + length) return;
		      var prevNewline = this.newlineIndex(index, true) + 1;
		      var isolateLength = nextNewline - prevNewline + 1;
		      var blot = this.isolate(prevNewline, isolateLength);
		      var next = blot.next;
		      blot.format(name, value);
		      if (next instanceof CodeBlock) {
		        next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
		      }
		    }
		  }, {
		    key: 'insertAt',
		    value: function insertAt(index, value, def) {
		      if (def != null) return;
	
		      var _descendant3 = this.descendant(_text2.default, index);
	
		      var _descendant4 = _slicedToArray(_descendant3, 2);
	
		      var text = _descendant4[0];
		      var offset = _descendant4[1];
	
		      text.insertAt(offset, value);
		    }
		  }, {
		    key: 'length',
		    value: function length() {
		      var length = this.domNode.textContent.length;
		      if (!this.domNode.textContent.endsWith('\n')) {
		        return length + 1;
		      }
		      return length;
		    }
		  }, {
		    key: 'newlineIndex',
		    value: function newlineIndex(searchIndex) {
		      var reverse = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
		      if (!reverse) {
		        var offset = this.domNode.textContent.slice(searchIndex).indexOf('\n');
		        return offset > -1 ? searchIndex + offset : -1;
		      } else {
		        return this.domNode.textContent.slice(0, searchIndex).lastIndexOf('\n');
		      }
		    }
		  }, {
		    key: 'optimize',
		    value: function optimize() {
		      if (!this.domNode.textContent.endsWith('\n')) {
		        this.appendChild(_parchment2.default.create('text', '\n'));
		      }
		      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'optimize', this).call(this);
		      var next = this.next;
		      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
		        next.optimize();
		        next.moveChildren(this);
		        next.remove();
		      }
		    }
		  }, {
		    key: 'replace',
		    value: function replace(target) {
		      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'replace', this).call(this, target);
		      [].slice.call(this.domNode.querySelectorAll('*')).forEach(function (node) {
		        var blot = _parchment2.default.find(node);
		        if (blot == null) {
		          node.parentNode.removeChild(node);
		        } else if (blot instanceof _parchment2.default.Embed) {
		          blot.remove();
		        } else {
		          blot.unwrap();
		        }
		      });
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      var domNode = _get(CodeBlock.__proto__ || Object.getPrototypeOf(CodeBlock), 'create', this).call(this, value);
		      domNode.setAttribute('spellcheck', false);
		      return domNode;
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      return true;
		    }
		  }]);
	
		  return CodeBlock;
		}(_block2.default);
	
		CodeBlock.blotName = 'code-block';
		CodeBlock.tagName = 'PRE';
		CodeBlock.TAB = '  ';
	
		exports.Code = Code;
		exports.default = CodeBlock;
	
	/***/ },
	/* 33 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.BlockEmbed = exports.bubbleFormats = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _break = __webpack_require__(34);
	
		var _break2 = _interopRequireDefault(_break);
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		var _text = __webpack_require__(37);
	
		var _text2 = _interopRequireDefault(_text);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var NEWLINE_LENGTH = 1;
	
		var BlockEmbed = function (_Embed) {
		  _inherits(BlockEmbed, _Embed);
	
		  function BlockEmbed() {
		    _classCallCheck(this, BlockEmbed);
	
		    return _possibleConstructorReturn(this, (BlockEmbed.__proto__ || Object.getPrototypeOf(BlockEmbed)).apply(this, arguments));
		  }
	
		  _createClass(BlockEmbed, [{
		    key: 'attach',
		    value: function attach() {
		      _get(BlockEmbed.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed.prototype), 'attach', this).call(this);
		      this.attributes = new _parchment2.default.Attributor.Store(this.domNode);
		    }
		  }, {
		    key: 'delta',
		    value: function delta() {
		      return new _delta2.default().insert(this.value(), (0, _extend2.default)(this.formats(), this.attributes.values()));
		    }
		  }, {
		    key: 'format',
		    value: function format(name, value) {
		      var attribute = _parchment2.default.query(name, _parchment2.default.Scope.BLOCK_ATTRIBUTE);
		      if (attribute != null) {
		        this.attributes.attribute(attribute, value);
		      }
		    }
		  }, {
		    key: 'formatAt',
		    value: function formatAt(index, length, name, value) {
		      this.format(name, value);
		    }
		  }, {
		    key: 'insertAt',
		    value: function insertAt(index, value, def) {
		      if (typeof value === 'string' && value.endsWith('\n')) {
		        var block = _parchment2.default.create(Block.blotName);
		        this.parent.insertBefore(block, index === 0 ? this : this.next);
		        block.insertAt(0, value.slice(0, -1));
		      } else {
		        _get(BlockEmbed.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed.prototype), 'insertAt', this).call(this, index, value, def);
		      }
		    }
		  }]);
	
		  return BlockEmbed;
		}(_embed2.default);
	
		BlockEmbed.scope = _parchment2.default.Scope.BLOCK_BLOT;
		// It is important for cursor behavior BlockEmbeds use tags that are block level elements
	
	
		var Block = function (_Parchment$Block) {
		  _inherits(Block, _Parchment$Block);
	
		  function Block(domNode) {
		    _classCallCheck(this, Block);
	
		    var _this2 = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, domNode));
	
		    _this2.cache = {};
		    return _this2;
		  }
	
		  _createClass(Block, [{
		    key: 'delta',
		    value: function delta() {
		      if (this.cache.delta == null) {
		        this.cache.delta = this.descendants(_parchment2.default.Leaf).reduce(function (delta, leaf) {
		          if (leaf.length() === 0) {
		            return delta;
		          } else {
		            return delta.insert(leaf.value(), bubbleFormats(leaf));
		          }
		        }, new _delta2.default()).insert('\n', bubbleFormats(this));
		      }
		      return this.cache.delta;
		    }
		  }, {
		    key: 'deleteAt',
		    value: function deleteAt(index, length) {
		      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'deleteAt', this).call(this, index, length);
		      this.cache = {};
		    }
		  }, {
		    key: 'formatAt',
		    value: function formatAt(index, length, name, value) {
		      if (length <= 0) return;
		      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
		        if (index + length === this.length()) {
		          this.format(name, value);
		        }
		      } else {
		        _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'formatAt', this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
		      }
		      this.cache = {};
		    }
		  }, {
		    key: 'insertAt',
		    value: function insertAt(index, value, def) {
		      if (def != null) return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, index, value, def);
		      if (value.length === 0) return;
		      var lines = value.split('\n');
		      var text = lines.shift();
		      if (text.length > 0) {
		        if (index < this.length() - 1 || this.children.tail == null) {
		          _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, Math.min(index, this.length() - 1), text);
		        } else {
		          this.children.tail.insertAt(this.children.tail.length(), text);
		        }
		        this.cache = {};
		      }
		      var block = this;
		      lines.reduce(function (index, line) {
		        block = block.split(index, true);
		        block.insertAt(0, line);
		        return line.length;
		      }, index + text.length);
		    }
		  }, {
		    key: 'insertBefore',
		    value: function insertBefore(blot, ref) {
		      var head = this.children.head;
		      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertBefore', this).call(this, blot, ref);
		      if (head instanceof _break2.default) {
		        head.remove();
		      }
		      this.cache = {};
		    }
		  }, {
		    key: 'length',
		    value: function length() {
		      if (this.cache.length == null) {
		        this.cache.length = _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'length', this).call(this) + NEWLINE_LENGTH;
		      }
		      return this.cache.length;
		    }
		  }, {
		    key: 'moveChildren',
		    value: function moveChildren(target, ref) {
		      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'moveChildren', this).call(this, target, ref);
		      this.cache = {};
		    }
		  }, {
		    key: 'optimize',
		    value: function optimize() {
		      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'optimize', this).call(this);
		      this.cache = {};
		    }
		  }, {
		    key: 'path',
		    value: function path(index) {
		      return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'path', this).call(this, index, true);
		    }
		  }, {
		    key: 'removeChild',
		    value: function removeChild(child) {
		      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'removeChild', this).call(this, child);
		      this.cache = {};
		    }
		  }, {
		    key: 'split',
		    value: function split(index) {
		      var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
		      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
		        var clone = this.clone();
		        if (index === 0) {
		          this.parent.insertBefore(clone, this);
		          return this;
		        } else {
		          this.parent.insertBefore(clone, this.next);
		          return clone;
		        }
		      } else {
		        var next = _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'split', this).call(this, index, force);
		        this.cache = {};
		        return next;
		      }
		    }
		  }]);
	
		  return Block;
		}(_parchment2.default.Block);
	
		Block.blotName = 'block';
		Block.tagName = 'P';
		Block.defaultChild = 'break';
		Block.allowedChildren = [_inline2.default, _embed2.default, _text2.default];
	
		function bubbleFormats(blot) {
		  var formats = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
		  if (blot == null) return formats;
		  if (typeof blot.formats === 'function') {
		    formats = (0, _extend2.default)(formats, blot.formats());
		  }
		  if (blot.parent == null || blot.parent.blotName == 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
		    return formats;
		  }
		  return bubbleFormats(blot.parent, formats);
		}
	
		exports.bubbleFormats = bubbleFormats;
		exports.BlockEmbed = BlockEmbed;
		exports.default = Block;
	
	/***/ },
	/* 34 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Break = function (_Embed) {
		  _inherits(Break, _Embed);
	
		  function Break() {
		    _classCallCheck(this, Break);
	
		    return _possibleConstructorReturn(this, (Break.__proto__ || Object.getPrototypeOf(Break)).apply(this, arguments));
		  }
	
		  _createClass(Break, [{
		    key: 'insertInto',
		    value: function insertInto(parent, ref) {
		      if (parent.children.length === 0) {
		        _get(Break.prototype.__proto__ || Object.getPrototypeOf(Break.prototype), 'insertInto', this).call(this, parent, ref);
		      }
		    }
		  }, {
		    key: 'length',
		    value: function length() {
		      return 0;
		    }
		  }, {
		    key: 'value',
		    value: function value() {
		      return '';
		    }
		  }], [{
		    key: 'value',
		    value: function value(domNode) {
		      return undefined;
		    }
		  }]);
	
		  return Break;
		}(_embed2.default);
	
		Break.blotName = 'break';
		Break.tagName = 'BR';
	
		exports.default = Break;
	
	/***/ },
	/* 35 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Embed = function (_Parchment$Embed) {
		  _inherits(Embed, _Parchment$Embed);
	
		  function Embed() {
		    _classCallCheck(this, Embed);
	
		    return _possibleConstructorReturn(this, (Embed.__proto__ || Object.getPrototypeOf(Embed)).apply(this, arguments));
		  }
	
		  return Embed;
		}(_parchment2.default.Embed);
	
		exports.default = Embed;
	
	/***/ },
	/* 36 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		var _text = __webpack_require__(37);
	
		var _text2 = _interopRequireDefault(_text);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Inline = function (_Parchment$Inline) {
		  _inherits(Inline, _Parchment$Inline);
	
		  function Inline() {
		    _classCallCheck(this, Inline);
	
		    return _possibleConstructorReturn(this, (Inline.__proto__ || Object.getPrototypeOf(Inline)).apply(this, arguments));
		  }
	
		  _createClass(Inline, [{
		    key: 'formatAt',
		    value: function formatAt(index, length, name, value) {
		      if (Inline.compare(this.statics.blotName, name) < 0 && _parchment2.default.query(name, _parchment2.default.Scope.BLOT)) {
		        var blot = this.isolate(index, length);
		        if (value) {
		          blot.wrap(name, value);
		        }
		      } else {
		        _get(Inline.prototype.__proto__ || Object.getPrototypeOf(Inline.prototype), 'formatAt', this).call(this, index, length, name, value);
		      }
		    }
		  }], [{
		    key: 'compare',
		    value: function compare(self, other) {
		      var selfIndex = Inline.order.indexOf(self);
		      var otherIndex = Inline.order.indexOf(other);
		      if (selfIndex >= 0 || otherIndex >= 0) {
		        return selfIndex - otherIndex;
		      } else if (self === other) {
		        return 0;
		      } else if (self < other) {
		        return -1;
		      } else {
		        return 1;
		      }
		    }
		  }]);
	
		  return Inline;
		}(_parchment2.default.Inline);
	
		Inline.allowedChildren = [Inline, _embed2.default, _text2.default];
		// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
		Inline.order = ['cursor', 'inline', // Must be lower
		'code', 'underline', 'strike', 'italic', 'bold', 'script', 'link' // Must be higher
		];
	
		exports.default = Inline;
	
	/***/ },
	/* 37 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var TextBlot = function (_Parchment$Text) {
		  _inherits(TextBlot, _Parchment$Text);
	
		  function TextBlot() {
		    _classCallCheck(this, TextBlot);
	
		    return _possibleConstructorReturn(this, (TextBlot.__proto__ || Object.getPrototypeOf(TextBlot)).apply(this, arguments));
		  }
	
		  return TextBlot;
		}(_parchment2.default.Text);
	
		exports.default = TextBlot;
	
	/***/ },
	/* 38 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Cursor = function (_Embed) {
		  _inherits(Cursor, _Embed);
	
		  _createClass(Cursor, null, [{
		    key: 'value',
		    value: function value(domNode) {
		      return undefined;
		    }
		  }]);
	
		  function Cursor(domNode, selection) {
		    _classCallCheck(this, Cursor);
	
		    var _this = _possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this, domNode));
	
		    _this.selection = selection;
		    _this.textNode = document.createTextNode(Cursor.CONTENTS);
		    _this.domNode.appendChild(_this.textNode);
		    _this._length = 0;
		    return _this;
		  }
	
		  _createClass(Cursor, [{
		    key: 'detach',
		    value: function detach() {
		      // super.detach() will also clear domNode.__blot
		      if (this.parent != null) this.parent.removeChild(this);
		    }
		  }, {
		    key: 'format',
		    value: function format(name, value) {
		      if (this._length !== 0) {
		        return _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'format', this).call(this, name, value);
		      }
		      var target = this,
		          index = 0;
		      while (target != null && target.statics.scope !== _parchment2.default.Scope.BLOCK_BLOT) {
		        index += target.offset(target.parent);
		        target = target.parent;
		      }
		      if (target != null) {
		        this._length = Cursor.CONTENTS.length;
		        target.optimize();
		        target.formatAt(index, Cursor.CONTENTS.length, name, value);
		        this._length = 0;
		      }
		    }
		  }, {
		    key: 'index',
		    value: function index(node, offset) {
		      if (node === this.textNode) return 0;
		      return _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'index', this).call(this, node, offset);
		    }
		  }, {
		    key: 'length',
		    value: function length() {
		      return this._length;
		    }
		  }, {
		    key: 'position',
		    value: function position(index) {
		      return [this.textNode, this.textNode.data.length];
		    }
		  }, {
		    key: 'remove',
		    value: function remove() {
		      _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'remove', this).call(this);
		      this.parent = null;
		    }
		  }, {
		    key: 'restore',
		    value: function restore() {
		      var _this2 = this;
	
		      if (this.selection.composing) return;
		      if (this.parent == null) return;
		      var textNode = this.textNode;
		      var range = this.selection.getNativeRange();
		      // Link format will insert text outside of anchor tag
		      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
		        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
		      }
		      if (this.textNode.data !== Cursor.CONTENTS) {
		        this.textNode.data = this.textNode.data.split(Cursor.CONTENTS).join('');
		        this.parent.insertBefore(_parchment2.default.create(this.textNode), this);
		        this.textNode = document.createTextNode(Cursor.CONTENTS);
		        this.domNode.appendChild(this.textNode);
		      }
		      this.remove();
		      if (range != null && range.start.node === textNode && range.end.node === textNode) {
		        this.selection.emitter.once(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
		          var _map = [range.start.offset, range.end.offset].map(function (offset) {
		            return Math.max(0, Math.min(textNode.data.length, offset - 1));
		          });
	
		          var _map2 = _slicedToArray(_map, 2);
	
		          var start = _map2[0];
		          var end = _map2[1];
	
		          _this2.selection.setNativeRange(textNode, start, textNode, end);
		        });
		      }
		    }
		  }, {
		    key: 'update',
		    value: function update(mutations) {
		      var _this3 = this;
	
		      mutations.forEach(function (mutation) {
		        if (mutation.type === 'characterData' && mutation.target === _this3.textNode) {
		          _this3.restore();
		        }
		      });
		    }
		  }, {
		    key: 'value',
		    value: function value() {
		      return '';
		    }
		  }]);
	
		  return Cursor;
		}(_embed2.default);
	
		Cursor.blotName = 'cursor';
		Cursor.className = 'ql-cursor';
		Cursor.tagName = 'span';
		Cursor.CONTENTS = '﻿'; // Zero width no break space
	
	
		exports.default = Cursor;
	
	/***/ },
	/* 39 */
	/***/ function(module, exports) {
	
		var clone = (function() {
		'use strict';
	
		/**
		 * Clones (copies) an Object using deep copying.
		 *
		 * This function supports circular references by default, but if you are certain
		 * there are no circular references in your object, you can save some CPU time
		 * by calling clone(obj, false).
		 *
		 * Caution: if `circular` is false and `parent` contains circular references,
		 * your program may enter an infinite loop and crash.
		 *
		 * @param `parent` - the object to be cloned
		 * @param `circular` - set to true if the object to be cloned may contain
		 *    circular references. (optional - true by default)
		 * @param `depth` - set to a number if the object is only to be cloned to
		 *    a particular depth. (optional - defaults to Infinity)
		 * @param `prototype` - sets the prototype to be used when cloning an object.
		 *    (optional - defaults to parent prototype).
		*/
		function clone(parent, circular, depth, prototype) {
		  var filter;
		  if (typeof circular === 'object') {
		    depth = circular.depth;
		    prototype = circular.prototype;
		    filter = circular.filter;
		    circular = circular.circular
		  }
		  // maintain two arrays for circular references, where corresponding parents
		  // and children have the same index
		  var allParents = [];
		  var allChildren = [];
	
		  var useBuffer = typeof Buffer != 'undefined';
	
		  if (typeof circular == 'undefined')
		    circular = true;
	
		  if (typeof depth == 'undefined')
		    depth = Infinity;
	
		  // recurse this function so we don't reset allParents and allChildren
		  function _clone(parent, depth) {
		    // cloning null always returns null
		    if (parent === null)
		      return null;
	
		    if (depth == 0)
		      return parent;
	
		    var child;
		    var proto;
		    if (typeof parent != 'object') {
		      return parent;
		    }
	
		    if (clone.__isArray(parent)) {
		      child = [];
		    } else if (clone.__isRegExp(parent)) {
		      child = new RegExp(parent.source, __getRegExpFlags(parent));
		      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
		    } else if (clone.__isDate(parent)) {
		      child = new Date(parent.getTime());
		    } else if (useBuffer && Buffer.isBuffer(parent)) {
		      child = new Buffer(parent.length);
		      parent.copy(child);
		      return child;
		    } else {
		      if (typeof prototype == 'undefined') {
		        proto = Object.getPrototypeOf(parent);
		        child = Object.create(proto);
		      }
		      else {
		        child = Object.create(prototype);
		        proto = prototype;
		      }
		    }
	
		    if (circular) {
		      var index = allParents.indexOf(parent);
	
		      if (index != -1) {
		        return allChildren[index];
		      }
		      allParents.push(parent);
		      allChildren.push(child);
		    }
	
		    for (var i in parent) {
		      var attrs;
		      if (proto) {
		        attrs = Object.getOwnPropertyDescriptor(proto, i);
		      }
	
		      if (attrs && attrs.set == null) {
		        continue;
		      }
		      child[i] = _clone(parent[i], depth - 1);
		    }
	
		    return child;
		  }
	
		  return _clone(parent, depth);
		}
	
		/**
		 * Simple flat clone using prototype, accepts only objects, usefull for property
		 * override on FLAT configuration object (no nested props).
		 *
		 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
		 * works.
		 */
		clone.clonePrototype = function clonePrototype(parent) {
		  if (parent === null)
		    return null;
	
		  var c = function () {};
		  c.prototype = parent;
		  return new c();
		};
	
		// private utility functions
	
		function __objToStr(o) {
		  return Object.prototype.toString.call(o);
		};
		clone.__objToStr = __objToStr;
	
		function __isDate(o) {
		  return typeof o === 'object' && __objToStr(o) === '[object Date]';
		};
		clone.__isDate = __isDate;
	
		function __isArray(o) {
		  return typeof o === 'object' && __objToStr(o) === '[object Array]';
		};
		clone.__isArray = __isArray;
	
		function __isRegExp(o) {
		  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
		};
		clone.__isRegExp = __isRegExp;
	
		function __getRegExpFlags(re) {
		  var flags = '';
		  if (re.global) flags += 'g';
		  if (re.ignoreCase) flags += 'i';
		  if (re.multiline) flags += 'm';
		  return flags;
		};
		clone.__getRegExpFlags = __getRegExpFlags;
	
		return clone;
		})();
	
		if (typeof module === 'object' && module.exports) {
		  module.exports = clone;
		}
	
	
	/***/ },
	/* 40 */
	/***/ function(module, exports) {
	
		"use strict";
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var Module = function Module(quill) {
		  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
		  _classCallCheck(this, Module);
	
		  this.quill = quill;
		  this.options = options;
		};
	
		Module.DEFAULTS = {};
	
		exports.default = Module;
	
	/***/ },
	/* 41 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.Range = undefined;
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _clone = __webpack_require__(39);
	
		var _clone2 = _interopRequireDefault(_clone);
	
		var _deepEqual = __webpack_require__(23);
	
		var _deepEqual2 = _interopRequireDefault(_deepEqual);
	
		var _break = __webpack_require__(34);
	
		var _break2 = _interopRequireDefault(_break);
	
		var _emitter3 = __webpack_require__(29);
	
		var _emitter4 = _interopRequireDefault(_emitter3);
	
		var _logger = __webpack_require__(31);
	
		var _logger2 = _interopRequireDefault(_logger);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var debug = (0, _logger2.default)('quill:selection');
	
		var Range = function Range(index) {
		  var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
		  _classCallCheck(this, Range);
	
		  this.index = index;
		  this.length = length;
		};
	
		var Selection = function () {
		  function Selection(scroll, emitter) {
		    var _this = this;
	
		    _classCallCheck(this, Selection);
	
		    this.emitter = emitter;
		    this.scroll = scroll;
		    this.composing = false;
		    this.root = this.scroll.domNode;
		    this.root.addEventListener('compositionstart', function () {
		      _this.composing = true;
		    });
		    this.root.addEventListener('compositionend', function () {
		      _this.composing = false;
		    });
		    this.cursor = _parchment2.default.create('cursor', this);
		    // savedRange is last non-null range
		    this.lastRange = this.savedRange = new Range(0, 0);
		    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave', 'focus', 'blur'].forEach(function (eventName) {
		      _this.root.addEventListener(eventName, function () {
		        // When range used to be a selection and user click within the selection,
		        // the range now being a cursor has not updated yet without setTimeout
		        setTimeout(_this.update.bind(_this, _emitter4.default.sources.USER), 100);
		      });
		    });
		    this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function (type, delta) {
		      if (type === _emitter4.default.events.TEXT_CHANGE && delta.length() > 0) {
		        _this.update(_emitter4.default.sources.SILENT);
		      }
		    });
		    this.emitter.on(_emitter4.default.events.SCROLL_BEFORE_UPDATE, function () {
		      var native = _this.getNativeRange();
		      if (native == null) return;
		      if (native.start.node === _this.cursor.textNode) return; // cursor.restore() will handle
		      // TODO unclear if this has negative side effects
		      _this.emitter.once(_emitter4.default.events.SCROLL_UPDATE, function () {
		        try {
		          _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
		        } catch (ignored) {}
		      });
		    });
		    this.update(_emitter4.default.sources.SILENT);
		  }
	
		  _createClass(Selection, [{
		    key: 'focus',
		    value: function focus() {
		      if (this.hasFocus()) return;
		      var bodyTop = document.body.scrollTop;
		      this.root.focus();
		      document.body.scrollTop = bodyTop;
		      this.setRange(this.savedRange);
		    }
		  }, {
		    key: 'format',
		    value: function format(_format, value) {
		      this.scroll.update();
		      var nativeRange = this.getNativeRange();
		      if (nativeRange == null || !nativeRange.native.collapsed || _parchment2.default.query(_format, _parchment2.default.Scope.BLOCK)) return;
		      if (nativeRange.start.node !== this.cursor.textNode) {
		        var blot = _parchment2.default.find(nativeRange.start.node, false);
		        if (blot == null) return;
		        // TODO Give blot ability to not split
		        if (blot instanceof _parchment2.default.Leaf) {
		          var after = blot.split(nativeRange.start.offset);
		          blot.parent.insertBefore(this.cursor, after);
		        } else {
		          blot.insertBefore(this.cursor, nativeRange.start.node); // Should never happen
		        }
		        this.cursor.attach();
		      }
		      this.cursor.format(_format, value);
		      this.scroll.optimize();
		      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
		      this.update();
		    }
		  }, {
		    key: 'getBounds',
		    value: function getBounds(index) {
		      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
		      var scrollLength = this.scroll.length();
		      index = Math.min(index, scrollLength - 1);
		      length = Math.min(index + length, scrollLength - 1) - index;
		      var bounds = void 0;var node = void 0;
		      var _scroll$leaf = this.scroll.leaf(index);
	
		      var _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2);
	
		      var leaf = _scroll$leaf2[0];
		      var offset = _scroll$leaf2[1];
	
		      if (leaf == null) return null;
	
		      var _leaf$position = leaf.position(offset, true);
	
		      var _leaf$position2 = _slicedToArray(_leaf$position, 2);
	
		      node = _leaf$position2[0];
		      offset = _leaf$position2[1];
	
		      var range = document.createRange();
		      if (length > 0) {
		        range.setStart(node, offset);
	
		        var _scroll$leaf3 = this.scroll.leaf(index + length);
	
		        var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);
	
		        leaf = _scroll$leaf4[0];
		        offset = _scroll$leaf4[1];
	
		        if (leaf == null) return null;
	
		        var _leaf$position3 = leaf.position(offset, true);
	
		        var _leaf$position4 = _slicedToArray(_leaf$position3, 2);
	
		        node = _leaf$position4[0];
		        offset = _leaf$position4[1];
	
		        range.setEnd(node, offset);
		        bounds = range.getBoundingClientRect();
		      } else {
		        var side = 'left';
		        if (node instanceof Text) {
		          if (offset < node.data.length) {
		            range.setStart(node, offset);
		            range.setEnd(node, offset + 1);
		          } else {
		            range.setStart(node, offset - 1);
		            range.setEnd(node, offset);
		            side = 'right';
		          }
		          var rect = range.getBoundingClientRect();
		        } else {
		          var rect = leaf.domNode.getBoundingClientRect();
		          if (offset > 0) side = 'right';
		        }
		        bounds = {
		          height: rect.height,
		          left: rect[side],
		          width: 0,
		          top: rect.top
		        };
		      }
		      var containerBounds = this.root.parentNode.getBoundingClientRect();
		      return {
		        left: bounds.left - containerBounds.left,
		        right: bounds.left + bounds.width - containerBounds.left,
		        top: bounds.top - containerBounds.top,
		        bottom: bounds.top + bounds.height - containerBounds.top,
		        height: bounds.height,
		        width: bounds.width
		      };
		    }
		  }, {
		    key: 'getNativeRange',
		    value: function getNativeRange() {
		      var selection = document.getSelection();
		      if (selection == null || selection.rangeCount <= 0) return null;
		      var nativeRange = selection.getRangeAt(0);
		      if (nativeRange == null) return null;
		      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
		        return null;
		      }
		      var range = {
		        start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
		        end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
		        native: nativeRange
		      };
		      [range.start, range.end].forEach(function (position) {
		        var node = position.node,
		            offset = position.offset;
		        while (!(node instanceof Text) && node.childNodes.length > 0) {
		          if (node.childNodes.length > offset) {
		            node = node.childNodes[offset];
		            offset = 0;
		          } else if (node.childNodes.length === offset) {
		            node = node.lastChild;
		            offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
		          } else {
		            break;
		          }
		        }
		        position.node = node, position.offset = offset;
		      });
		      debug.info('getNativeRange', range);
		      return range;
		    }
		  }, {
		    key: 'getRange',
		    value: function getRange() {
		      var _this2 = this;
	
		      if (!this.hasFocus()) return [null, null];
		      var range = this.getNativeRange();
		      if (range == null) return [null, null];
		      var positions = [[range.start.node, range.start.offset]];
		      if (!range.native.collapsed) {
		        positions.push([range.end.node, range.end.offset]);
		      }
		      var indexes = positions.map(function (position) {
		        var _position = _slicedToArray(position, 2);
	
		        var node = _position[0];
		        var offset = _position[1];
	
		        var blot = _parchment2.default.find(node, true);
		        var index = blot.offset(_this2.scroll);
		        if (offset === 0) {
		          return index;
		        } else if (blot instanceof _parchment2.default.Container) {
		          return index + blot.length();
		        } else {
		          return index + blot.index(node, offset);
		        }
		      });
		      var start = Math.min.apply(Math, _toConsumableArray(indexes)),
		          end = Math.max.apply(Math, _toConsumableArray(indexes));
		      return [new Range(start, end - start), range];
		    }
		  }, {
		    key: 'hasFocus',
		    value: function hasFocus() {
		      return document.activeElement === this.root;
		    }
		  }, {
		    key: 'scrollIntoView',
		    value: function scrollIntoView() {
		      var range = arguments.length <= 0 || arguments[0] === undefined ? this.lastRange : arguments[0];
	
		      if (range == null) return;
		      var bounds = this.getBounds(range.index, range.length);
		      if (bounds == null) return;
		      if (this.root.offsetHeight < bounds.bottom) {
		        var _scroll$line = this.scroll.line(Math.min(range.index + range.length, this.scroll.length() - 1));
	
		        var _scroll$line2 = _slicedToArray(_scroll$line, 1);
	
		        var line = _scroll$line2[0];
	
		        this.root.scrollTop = line.domNode.offsetTop + line.domNode.offsetHeight - this.root.offsetHeight;
		      } else if (bounds.top < 0) {
		        var _scroll$line3 = this.scroll.line(Math.min(range.index, this.scroll.length() - 1));
	
		        var _scroll$line4 = _slicedToArray(_scroll$line3, 1);
	
		        var _line = _scroll$line4[0];
	
		        this.root.scrollTop = _line.domNode.offsetTop;
		      }
		    }
		  }, {
		    key: 'setNativeRange',
		    value: function setNativeRange(startNode, startOffset) {
		      var endNode = arguments.length <= 2 || arguments[2] === undefined ? startNode : arguments[2];
		      var endOffset = arguments.length <= 3 || arguments[3] === undefined ? startOffset : arguments[3];
		      var force = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
		      debug.info('setNativeRange', startNode, startOffset, endNode, endOffset);
		      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
		        return;
		      }
		      var selection = document.getSelection();
		      if (selection == null) return;
		      if (startNode != null) {
		        if (!this.hasFocus()) this.root.focus();
		        var nativeRange = this.getNativeRange();
		        if (nativeRange == null || force || startNode !== nativeRange.start.node || startOffset !== nativeRange.start.offset || endNode !== nativeRange.end.node || endOffset !== nativeRange.end.offset) {
		          var range = document.createRange();
		          range.setStart(startNode, startOffset);
		          range.setEnd(endNode, endOffset);
		          selection.removeAllRanges();
		          selection.addRange(range);
		        }
		      } else {
		        selection.removeAllRanges();
		        this.root.blur();
		        document.body.focus(); // root.blur() not enough on IE11+Travis+SauceLabs (but not local VMs)
		      }
		    }
		  }, {
		    key: 'setRange',
		    value: function setRange(range) {
		      var _this3 = this;
	
		      var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter4.default.sources.API : arguments[2];
	
		      if (typeof force === 'string') {
		        source = force;
		        force = false;
		      }
		      debug.info('setRange', range);
		      if (range != null) {
		        (function () {
		          var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
		          var args = [];
		          var scrollLength = _this3.scroll.length();
		          indexes.forEach(function (index, i) {
		            index = Math.min(scrollLength - 1, index);
		            var node = void 0;
		            var _scroll$leaf5 = _this3.scroll.leaf(index);
	
		            var _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2);
	
		            var leaf = _scroll$leaf6[0];
		            var offset = _scroll$leaf6[1];
	
		            var _leaf$position5 = leaf.position(offset, i !== 0);
	
		            var _leaf$position6 = _slicedToArray(_leaf$position5, 2);
	
		            node = _leaf$position6[0];
		            offset = _leaf$position6[1];
	
		            args.push(node, offset);
		          });
		          if (args.length < 2) {
		            args = args.concat(args);
		          }
		          _this3.setNativeRange.apply(_this3, _toConsumableArray(args).concat([force]));
		        })();
		      } else {
		        this.setNativeRange(null);
		      }
		      this.update(source);
		    }
		  }, {
		    key: 'update',
		    value: function update() {
		      var source = arguments.length <= 0 || arguments[0] === undefined ? _emitter4.default.sources.USER : arguments[0];
	
		      var nativeRange = void 0,
		          oldRange = this.lastRange;
	
		      var _getRange = this.getRange();
	
		      var _getRange2 = _slicedToArray(_getRange, 2);
	
		      this.lastRange = _getRange2[0];
		      nativeRange = _getRange2[1];
	
		      if (this.lastRange != null) {
		        this.savedRange = this.lastRange;
		      }
		      if (!(0, _deepEqual2.default)(oldRange, this.lastRange)) {
		        var _emitter;
	
		        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
		          this.cursor.restore();
		        }
		        var args = [_emitter4.default.events.SELECTION_CHANGE, (0, _clone2.default)(this.lastRange), (0, _clone2.default)(oldRange), source];
		        (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
		        if (source !== _emitter4.default.sources.SILENT) {
		          var _emitter2;
	
		          (_emitter2 = this.emitter).emit.apply(_emitter2, args);
		        }
		      }
		    }
		  }]);
	
		  return Selection;
		}();
	
		function contains(parent, descendant) {
		  try {
		    // Firefox inserts inaccessible nodes around video elements
		    descendant.parentNode;
		  } catch (e) {
		    return false;
		  }
		  // IE11 has bug with Text nodes
		  // https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
		  if (descendant instanceof Text) {
		    descendant = descendant.parentNode;
		  }
		  return parent.contains(descendant);
		}
	
		exports.Range = Range;
		exports.default = Selection;
	
	/***/ },
	/* 42 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var Theme = function () {
		  function Theme(quill, options) {
		    _classCallCheck(this, Theme);
	
		    this.quill = quill;
		    this.options = options;
		    this.modules = {};
		  }
	
		  _createClass(Theme, [{
		    key: 'init',
		    value: function init() {
		      var _this = this;
	
		      Object.keys(this.options.modules).forEach(function (name) {
		        if (_this.modules[name] == null) {
		          _this.addModule(name);
		        }
		      });
		    }
		  }, {
		    key: 'addModule',
		    value: function addModule(name) {
		      var moduleClass = this.quill.constructor.import('modules/' + name);
		      this.modules[name] = new moduleClass(this.quill, this.options.modules[name] || {});
		      return this.modules[name];
		    }
		  }]);
	
		  return Theme;
		}();
	
		Theme.DEFAULTS = {
		  modules: {}
		};
		Theme.themes = {
		  'default': Theme
		};
	
		exports.default = Theme;
	
	/***/ },
	/* 43 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Container = function (_Parchment$Container) {
		  _inherits(Container, _Parchment$Container);
	
		  function Container() {
		    _classCallCheck(this, Container);
	
		    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
		  }
	
		  return Container;
		}(_parchment2.default.Container);
	
		Container.allowedChildren = [_block2.default, _block.BlockEmbed, Container];
	
		exports.default = Container;
	
	/***/ },
	/* 44 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		var _break = __webpack_require__(34);
	
		var _break2 = _interopRequireDefault(_break);
	
		var _container = __webpack_require__(43);
	
		var _container2 = _interopRequireDefault(_container);
	
		var _code = __webpack_require__(32);
	
		var _code2 = _interopRequireDefault(_code);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		function isLine(blot) {
		  return blot instanceof _block2.default || blot instanceof _block.BlockEmbed;
		}
	
		var Scroll = function (_Parchment$Scroll) {
		  _inherits(Scroll, _Parchment$Scroll);
	
		  function Scroll(domNode, config) {
		    _classCallCheck(this, Scroll);
	
		    var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this, domNode));
	
		    _this.emitter = config.emitter;
		    if (Array.isArray(config.whitelist)) {
		      _this.whitelist = config.whitelist.reduce(function (whitelist, format) {
		        whitelist[format] = true;
		        return whitelist;
		      }, {});
		    }
		    _this.optimize();
		    return _this;
		  }
	
		  _createClass(Scroll, [{
		    key: 'deleteAt',
		    value: function deleteAt(index, length) {
		      var _line = this.line(index);
	
		      var _line2 = _slicedToArray(_line, 2);
	
		      var first = _line2[0];
		      var offset = _line2[1];
	
		      var _line3 = this.line(index + length);
	
		      var _line4 = _slicedToArray(_line3, 1);
	
		      var last = _line4[0];
	
		      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'deleteAt', this).call(this, index, length);
		      if (last != null && first !== last && offset > 0 && !(first instanceof _block.BlockEmbed) && !(last instanceof _block.BlockEmbed)) {
		        if (last instanceof _code2.default) {
		          last.deleteAt(last.length() - 1, 1);
		        }
		        var ref = last.children.head instanceof _break2.default ? null : last.children.head;
		        first.moveChildren(last, ref);
		        first.remove();
		      }
		      this.optimize();
		    }
		  }, {
		    key: 'formatAt',
		    value: function formatAt(index, length, format, value) {
		      if (this.whitelist != null && !this.whitelist[format]) return;
		      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'formatAt', this).call(this, index, length, format, value);
		      this.optimize();
		    }
		  }, {
		    key: 'insertAt',
		    value: function insertAt(index, value, def) {
		      if (def != null && this.whitelist != null && !this.whitelist[value]) return;
		      if (index >= this.length()) {
		        if (def == null || _parchment2.default.query(value, _parchment2.default.Scope.BLOCK) == null) {
		          var blot = _parchment2.default.create(this.statics.defaultChild);
		          this.appendChild(blot);
		          if (def == null && value.endsWith('\n')) {
		            value = value.slice(0, -1);
		          }
		          blot.insertAt(0, value, def);
		        } else {
		          var embed = _parchment2.default.create(value, def);
		          this.appendChild(embed);
		        }
		      } else {
		        _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'insertAt', this).call(this, index, value, def);
		      }
		      this.optimize();
		    }
		  }, {
		    key: 'insertBefore',
		    value: function insertBefore(blot, ref) {
		      if (blot.statics.scope === _parchment2.default.Scope.INLINE_BLOT) {
		        var wrapper = _parchment2.default.create(this.statics.defaultChild);
		        wrapper.appendChild(blot);
		        blot = wrapper;
		      }
		      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'insertBefore', this).call(this, blot, ref);
		    }
		  }, {
		    key: 'leaf',
		    value: function leaf(index) {
		      return this.path(index).pop() || [null, -1];
		    }
		  }, {
		    key: 'line',
		    value: function line(index) {
		      return this.descendant(isLine, index);
		    }
		  }, {
		    key: 'lines',
		    value: function lines() {
		      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		      var length = arguments.length <= 1 || arguments[1] === undefined ? Number.MAX_VALUE : arguments[1];
	
		      var getLines = function getLines(blot, index, length) {
		        var lines = [],
		            lengthLeft = length;
		        blot.children.forEachAt(index, length, function (child, index, length) {
		          if (isLine(child)) {
		            lines.push(child);
		          } else if (child instanceof _parchment2.default.Container) {
		            lines = lines.concat(getLines(child, index, lengthLeft));
		          }
		          lengthLeft -= length;
		        });
		        return lines;
		      };
		      return getLines(this, index, length);
		    }
		  }, {
		    key: 'optimize',
		    value: function optimize() {
		      var mutations = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
		      if (this.batch === true) return;
		      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'optimize', this).call(this, mutations);
		      if (mutations.length > 0) {
		        this.emitter.emit(_emitter2.default.events.SCROLL_OPTIMIZE, mutations);
		      }
		    }
		  }, {
		    key: 'path',
		    value: function path(index) {
		      return _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'path', this).call(this, index).slice(1); // Exclude self
		    }
		  }, {
		    key: 'update',
		    value: function update(mutations) {
		      if (this.batch === true) return;
		      var source = _emitter2.default.sources.USER;
		      if (typeof mutations === 'string') {
		        source = mutations;
		      }
		      if (!Array.isArray(mutations)) {
		        mutations = this.observer.takeRecords();
		      }
		      if (mutations.length > 0) {
		        this.emitter.emit(_emitter2.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
		      }
		      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'update', this).call(this, mutations.concat([])); // pass copy
		      if (mutations.length > 0) {
		        this.emitter.emit(_emitter2.default.events.SCROLL_UPDATE, source, mutations);
		      }
		    }
		  }]);
	
		  return Scroll;
		}(_parchment2.default.Scroll);
	
		Scroll.blotName = 'scroll';
		Scroll.className = 'ql-editor';
		Scroll.tagName = 'DIV';
		Scroll.defaultChild = 'block';
		Scroll.allowedChildren = [_block2.default, _block.BlockEmbed, _container2.default];
	
		exports.default = Scroll;
	
	/***/ },
	/* 45 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.matchText = exports.matchSpacing = exports.matchNewline = exports.matchBlot = exports.matchAttributor = exports.default = undefined;
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		var _logger = __webpack_require__(31);
	
		var _logger2 = _interopRequireDefault(_logger);
	
		var _module = __webpack_require__(40);
	
		var _module2 = _interopRequireDefault(_module);
	
		var _align = __webpack_require__(46);
	
		var _background = __webpack_require__(47);
	
		var _color = __webpack_require__(48);
	
		var _direction = __webpack_require__(49);
	
		var _font = __webpack_require__(50);
	
		var _size = __webpack_require__(51);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
		function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var debug = (0, _logger2.default)('quill:clipboard');
	
		var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], ['br', matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchSpacing], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ['b', matchAlias.bind(matchAlias, 'bold')], ['i', matchAlias.bind(matchAlias, 'italic')], ['style', matchIgnore]];
	
		var STYLE_ATTRIBUTORS = [_align.AlignStyle, _background.BackgroundStyle, _color.ColorStyle, _direction.DirectionStyle, _font.FontStyle, _size.SizeStyle].reduce(function (memo, attr) {
		  memo[attr.keyName] = attr;
		  return memo;
		}, {});
	
		var Clipboard = function (_Module) {
		  _inherits(Clipboard, _Module);
	
		  function Clipboard(quill, options) {
		    _classCallCheck(this, Clipboard);
	
		    var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this, quill, options));
	
		    _this.quill.root.addEventListener('paste', _this.onPaste.bind(_this));
		    _this.container = _this.quill.addContainer('ql-clipboard');
		    _this.container.setAttribute('contenteditable', true);
		    _this.container.setAttribute('tabindex', -1);
		    _this.matchers = [];
		    CLIPBOARD_CONFIG.concat(_this.options.matchers).forEach(function (pair) {
		      _this.addMatcher.apply(_this, _toConsumableArray(pair));
		    });
		    return _this;
		  }
	
		  _createClass(Clipboard, [{
		    key: 'addMatcher',
		    value: function addMatcher(selector, matcher) {
		      this.matchers.push([selector, matcher]);
		    }
		  }, {
		    key: 'convert',
		    value: function convert(html) {
		      var _this2 = this;
	
		      var DOM_KEY = '__ql-matcher';
		      if (typeof html === 'string') {
		        this.container.innerHTML = html;
		      }
		      var textMatchers = [],
		          elementMatchers = [];
		      this.matchers.forEach(function (pair) {
		        var _pair = _slicedToArray(pair, 2);
	
		        var selector = _pair[0];
		        var matcher = _pair[1];
	
		        switch (selector) {
		          case Node.TEXT_NODE:
		            textMatchers.push(matcher);
		            break;
		          case Node.ELEMENT_NODE:
		            elementMatchers.push(matcher);
		            break;
		          default:
		            [].forEach.call(_this2.container.querySelectorAll(selector), function (node) {
		              // TODO use weakmap
		              node[DOM_KEY] = node[DOM_KEY] || [];
		              node[DOM_KEY].push(matcher);
		            });
		            break;
		        }
		      });
		      var traverse = function traverse(node) {
		        // Post-order
		        if (node.nodeType === node.TEXT_NODE) {
		          return textMatchers.reduce(function (delta, matcher) {
		            return matcher(node, delta);
		          }, new _delta2.default());
		        } else if (node.nodeType === node.ELEMENT_NODE) {
		          return [].reduce.call(node.childNodes || [], function (delta, childNode) {
		            var childrenDelta = traverse(childNode);
		            if (childNode.nodeType === node.ELEMENT_NODE) {
		              childrenDelta = elementMatchers.reduce(function (childrenDelta, matcher) {
		                return matcher(childNode, childrenDelta);
		              }, childrenDelta);
		              childrenDelta = (childNode[DOM_KEY] || []).reduce(function (childrenDelta, matcher) {
		                return matcher(childNode, childrenDelta);
		              }, childrenDelta);
		            }
		            return delta.concat(childrenDelta);
		          }, new _delta2.default());
		        } else {
		          return new _delta2.default();
		        }
		      };
		      var delta = traverse(this.container);
		      // Remove trailing newline
		      if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
		        delta = delta.compose(new _delta2.default().retain(delta.length() - 1).delete(1));
		      }
		      debug.log('convert', this.container.innerHTML, delta);
		      this.container.innerHTML = '';
		      return delta;
		    }
		  }, {
		    key: 'onPaste',
		    value: function onPaste(e) {
		      var _this3 = this;
	
		      if (e.defaultPrevented) return;
		      var range = this.quill.getSelection();
		      var delta = new _delta2.default().retain(range.index).delete(range.length);
		      var bodyTop = document.body.scrollTop;
		      this.container.focus();
		      setTimeout(function () {
		        delta = delta.concat(_this3.convert());
		        _this3.quill.updateContents(delta, _quill2.default.sources.USER);
		        // range.length contributes to delta.length()
		        _this3.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
		        document.body.scrollTop = bodyTop;
		        _this3.quill.selection.scrollIntoView();
		      }, 1);
		    }
		  }]);
	
		  return Clipboard;
		}(_module2.default);
	
		Clipboard.DEFAULTS = {
		  matchers: []
		};
	
		function computeStyle(node) {
		  if (node.nodeType !== Node.ELEMENT_NODE) return {};
		  var DOM_KEY = '__ql-computed-style';
		  return node[DOM_KEY] || (node[DOM_KEY] = window.getComputedStyle(node));
		}
	
		function deltaEndsWith(delta, text) {
		  var endText = "";
		  for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
		    var op = delta.ops[i];
		    if (typeof op.insert !== 'string') break;
		    endText = op.insert + endText;
		  }
		  return endText.slice(-1 * text.length) === text;
		}
	
		function isLine(node) {
		  if (node.childNodes.length === 0) return false; // Exclude embed blocks
		  var style = computeStyle(node);
		  return ['block', 'list-item'].indexOf(style.display) > -1;
		}
	
		function matchAlias(format, node, delta) {
		  return delta.compose(new _delta2.default().retain(delta.length(), _defineProperty({}, format, true)));
		}
	
		function matchAttributor(node, delta) {
		  var attributes = _parchment2.default.Attributor.Attribute.keys(node);
		  var classes = _parchment2.default.Attributor.Class.keys(node);
		  var styles = _parchment2.default.Attributor.Style.keys(node);
		  var formats = {};
		  attributes.concat(classes).concat(styles).forEach(function (name) {
		    var attr = _parchment2.default.query(name, _parchment2.default.Scope.ATTRIBUTE);
		    if (attr != null) {
		      formats[attr.attrName] = attr.value(node);
		      if (formats[attr.attrName]) return;
		    }
		    if (STYLE_ATTRIBUTORS[name] != null) {
		      attr = STYLE_ATTRIBUTORS[name];
		      formats[attr.attrName] = attr.value(node);
		    }
		  });
		  if (Object.keys(formats).length > 0) {
		    delta = delta.compose(new _delta2.default().retain(delta.length(), formats));
		  }
		  return delta;
		}
	
		function matchBlot(node, delta) {
		  var match = _parchment2.default.query(node);
		  if (match == null) return delta;
		  if (match.prototype instanceof _parchment2.default.Embed) {
		    var embed = {};
		    var value = match.value(node);
		    if (value != null) {
		      embed[match.blotName] = value;
		      delta = new _delta2.default().insert(embed, match.formats(node));
		    }
		  } else if (typeof match.formats === 'function') {
		    var formats = _defineProperty({}, match.blotName, match.formats(node));
		    delta = delta.compose(new _delta2.default().retain(delta.length(), formats));
		  }
		  return delta;
		}
	
		function matchBreak(node, delta) {
		  if (!deltaEndsWith(delta, '\n')) {
		    delta.insert('\n');
		  }
		  return delta;
		}
	
		function matchIgnore(node, delta) {
		  return new _delta2.default();
		}
	
		function matchNewline(node, delta) {
		  if (isLine(node) && !deltaEndsWith(delta, '\n')) {
		    delta.insert('\n');
		  }
		  return delta;
		}
	
		function matchSpacing(node, delta) {
		  if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, '\n\n')) {
		    var nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
		    if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight * 1.5) {
		      delta.insert('\n');
		    }
		  }
		  return delta;
		}
	
		function matchStyles(node, delta) {
		  var formats = {};
		  var style = node.style || {};
		  if (style.fontWeight && computeStyle(node).fontWeight === 'bold') {
		    formats.bold = true;
		  }
		  if (Object.keys(formats).length > 0) {
		    delta = delta.compose(new _delta2.default().retain(delta.length(), formats));
		  }
		  if (parseFloat(style.textIndent || 0) > 0) {
		    // Could be 0.5in
		    delta = new _delta2.default().insert('\t').concat(delta);
		  }
		  return delta;
		}
	
		function matchText(node, delta) {
		  var text = node.data;
		  // Word represents empty line with <o:p>&nbsp;</o:p>
		  if (node.parentNode.tagName === 'O:P') {
		    return delta.insert(text.trim());
		  }
		  if (!computeStyle(node.parentNode).whiteSpace.startsWith('pre')) {
		    var replacer = function replacer(collapse, match) {
		      match = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;
		      return match.length < 1 && collapse ? ' ' : match;
		    };
	
		    text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
		    text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace
		    if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
		      text = text.replace(/^\s+/, replacer.bind(replacer, false));
		    }
		    if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
		      text = text.replace(/\s+$/, replacer.bind(replacer, false));
		    }
		  }
		  return delta.insert(text);
		}
	
		exports.default = Clipboard;
		exports.matchAttributor = matchAttributor;
		exports.matchBlot = matchBlot;
		exports.matchNewline = matchNewline;
		exports.matchSpacing = matchSpacing;
		exports.matchText = matchText;
	
	/***/ },
	/* 46 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.AlignStyle = exports.AlignClass = undefined;
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		var config = {
		  scope: _parchment2.default.Scope.BLOCK,
		  whitelist: ['right', 'center', 'justify']
		};
	
		var AlignClass = new _parchment2.default.Attributor.Class('align', 'ql-align', config);
		var AlignStyle = new _parchment2.default.Attributor.Style('align', 'text-align', config);
	
		exports.AlignClass = AlignClass;
		exports.AlignStyle = AlignStyle;
	
	/***/ },
	/* 47 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.BackgroundStyle = exports.BackgroundClass = undefined;
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _color = __webpack_require__(48);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		var BackgroundClass = new _parchment2.default.Attributor.Class('background', 'ql-bg', {
		  scope: _parchment2.default.Scope.INLINE
		});
		var BackgroundStyle = new _color.ColorAttributor('background', 'background-color', {
		  scope: _parchment2.default.Scope.INLINE
		});
	
		exports.BackgroundClass = BackgroundClass;
		exports.BackgroundStyle = BackgroundStyle;
	
	/***/ },
	/* 48 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.ColorStyle = exports.ColorClass = exports.ColorAttributor = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var ColorAttributor = function (_Parchment$Attributor) {
		  _inherits(ColorAttributor, _Parchment$Attributor);
	
		  function ColorAttributor() {
		    _classCallCheck(this, ColorAttributor);
	
		    return _possibleConstructorReturn(this, (ColorAttributor.__proto__ || Object.getPrototypeOf(ColorAttributor)).apply(this, arguments));
		  }
	
		  _createClass(ColorAttributor, [{
		    key: 'value',
		    value: function value(domNode) {
		      var value = _get(ColorAttributor.prototype.__proto__ || Object.getPrototypeOf(ColorAttributor.prototype), 'value', this).call(this, domNode);
		      if (!value.startsWith('rgb(')) return value;
		      value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
		      return '#' + value.split(',').map(function (component) {
		        return ('00' + parseInt(component).toString(16)).slice(-2);
		      }).join('');
		    }
		  }]);
	
		  return ColorAttributor;
		}(_parchment2.default.Attributor.Style);
	
		var ColorClass = new _parchment2.default.Attributor.Class('color', 'ql-color', {
		  scope: _parchment2.default.Scope.INLINE
		});
		var ColorStyle = new ColorAttributor('color', 'color', {
		  scope: _parchment2.default.Scope.INLINE
		});
	
		exports.ColorAttributor = ColorAttributor;
		exports.ColorClass = ColorClass;
		exports.ColorStyle = ColorStyle;
	
	/***/ },
	/* 49 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.DirectionStyle = exports.DirectionClass = undefined;
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		var config = {
		  scope: _parchment2.default.Scope.BLOCK,
		  whitelist: ['rtl']
		};
	
		var DirectionClass = new _parchment2.default.Attributor.Class('direction', 'ql-direction', config);
		var DirectionStyle = new _parchment2.default.Attributor.Style('direction', 'direction', config);
	
		exports.DirectionClass = DirectionClass;
		exports.DirectionStyle = DirectionStyle;
	
	/***/ },
	/* 50 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.FontClass = exports.FontStyle = undefined;
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		var config = {
		  scope: _parchment2.default.Scope.INLINE,
		  whitelist: ['serif', 'monospace']
		};
	
		var FontClass = new _parchment2.default.Attributor.Class('font', 'ql-font', config);
		var FontStyle = new _parchment2.default.Attributor.Style('font', 'font-family', config);
	
		exports.FontStyle = FontStyle;
		exports.FontClass = FontClass;
	
	/***/ },
	/* 51 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.SizeStyle = exports.SizeClass = undefined;
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		var SizeClass = new _parchment2.default.Attributor.Class('size', 'ql-size', {
		  scope: _parchment2.default.Scope.INLINE,
		  whitelist: ['small', 'large', 'huge']
		});
		var SizeStyle = new _parchment2.default.Attributor.Style('size', 'font-size', {
		  scope: _parchment2.default.Scope.INLINE,
		  whitelist: ['10px', '18px', '32px']
		});
	
		exports.SizeClass = SizeClass;
		exports.SizeStyle = SizeStyle;
	
	/***/ },
	/* 52 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.getLastChangeIndex = exports.default = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		var _module = __webpack_require__(40);
	
		var _module2 = _interopRequireDefault(_module);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var History = function (_Module) {
		  _inherits(History, _Module);
	
		  function History(quill, options) {
		    _classCallCheck(this, History);
	
		    var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, quill, options));
	
		    _this.lastRecorded = 0;
		    _this.ignoreChange = false;
		    _this.clear();
		    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (eventName, delta, oldDelta, source) {
		      if (eventName !== _quill2.default.events.TEXT_CHANGE || _this.ignoreChange) return;
		      if (!_this.options.userOnly || source === _quill2.default.sources.USER) {
		        _this.record(delta, oldDelta);
		      } else {
		        _this.transform(delta);
		      }
		    });
		    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true }, _this.undo.bind(_this));
		    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true, shiftKey: true }, _this.redo.bind(_this));
		    if (/Win/i.test(navigator.platform)) {
		      _this.quill.keyboard.addBinding({ key: 'Y', shortKey: true }, _this.redo.bind(_this));
		    }
		    return _this;
		  }
	
		  _createClass(History, [{
		    key: 'change',
		    value: function change(source, dest) {
		      if (this.stack[source].length === 0) return;
		      var delta = this.stack[source].pop();
		      this.lastRecorded = 0;
		      this.ignoreChange = true;
		      this.quill.updateContents(delta[source], _quill2.default.sources.USER);
		      this.ignoreChange = false;
		      var index = getLastChangeIndex(delta[source]);
		      this.quill.setSelection(index);
		      this.quill.selection.scrollIntoView();
		      this.stack[dest].push(delta);
		    }
		  }, {
		    key: 'clear',
		    value: function clear() {
		      this.stack = { undo: [], redo: [] };
		    }
		  }, {
		    key: 'record',
		    value: function record(changeDelta, oldDelta) {
		      if (changeDelta.ops.length === 0) return;
		      this.stack.redo = [];
		      var undoDelta = this.quill.getContents().diff(oldDelta);
		      var timestamp = Date.now();
		      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
		        var delta = this.stack.undo.pop();
		        undoDelta = undoDelta.compose(delta.undo);
		        changeDelta = delta.redo.compose(changeDelta);
		      } else {
		        this.lastRecorded = timestamp;
		      }
		      this.stack.undo.push({
		        redo: changeDelta,
		        undo: undoDelta
		      });
		      if (this.stack.undo.length > this.options.maxStack) {
		        this.stack.undo.unshift();
		      }
		    }
		  }, {
		    key: 'redo',
		    value: function redo() {
		      this.change('redo', 'undo');
		    }
		  }, {
		    key: 'transform',
		    value: function transform(delta) {
		      this.stack.undo.forEach(function (change) {
		        change.undo = delta.transform(change.undo, true);
		        change.redo = delta.transform(change.redo, true);
		      });
		      this.stack.redo.forEach(function (change) {
		        change.undo = delta.transform(change.undo, true);
		        change.redo = delta.transform(change.redo, true);
		      });
		    }
		  }, {
		    key: 'undo',
		    value: function undo() {
		      this.change('undo', 'redo');
		    }
		  }]);
	
		  return History;
		}(_module2.default);
	
		History.DEFAULTS = {
		  delay: 1000,
		  maxStack: 100,
		  userOnly: false
		};
	
		function endsWithNewlineChange(delta) {
		  var lastOp = delta.ops[delta.ops.length - 1];
		  if (lastOp == null) return false;
		  if (lastOp.insert != null) {
		    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
		  }
		  if (lastOp.attributes != null) {
		    return Object.keys(lastOp.attributes).some(function (attr) {
		      return _parchment2.default.query(attr, _parchment2.default.Scope.BLOCK) != null;
		    });
		  }
		  return false;
		}
	
		function getLastChangeIndex(delta) {
		  var deleteLength = delta.ops.reduce(function (length, op) {
		    length += op.delete || 0;
		    return length;
		  }, 0);
		  var changeIndex = delta.length() - deleteLength;
		  if (endsWithNewlineChange(delta)) {
		    changeIndex -= 1;
		  }
		  return changeIndex;
		}
	
		exports.default = History;
		exports.getLastChangeIndex = getLastChangeIndex;
	
	/***/ },
	/* 53 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _clone = __webpack_require__(39);
	
		var _clone2 = _interopRequireDefault(_clone);
	
		var _deepEqual = __webpack_require__(23);
	
		var _deepEqual2 = _interopRequireDefault(_deepEqual);
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		var _logger = __webpack_require__(31);
	
		var _logger2 = _interopRequireDefault(_logger);
	
		var _module = __webpack_require__(40);
	
		var _module2 = _interopRequireDefault(_module);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var debug = (0, _logger2.default)('quill:keyboard');
	
		var SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';
	
		var Keyboard = function (_Module) {
		  _inherits(Keyboard, _Module);
	
		  _createClass(Keyboard, null, [{
		    key: 'match',
		    value: function match(evt, binding) {
		      binding = normalize(binding);
		      if (!!binding.shortKey !== evt[SHORTKEY] && binding.shortKey !== null) return false;
		      if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (key) {
		        return key != SHORTKEY && !!binding[key] !== evt[key] && binding[key] !== null;
		      })) {
		        return false;
		      }
		      return binding.key === (evt.which || evt.keyCode);
		    }
		  }]);
	
		  function Keyboard(quill, options) {
		    _classCallCheck(this, Keyboard);
	
		    var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, quill, options));
	
		    _this.bindings = {};
		    Object.keys(_this.options.bindings).forEach(function (name) {
		      if (_this.options.bindings[name]) {
		        _this.addBinding(_this.options.bindings[name]);
		      }
		    });
		    _this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
		    _this.addBinding({ key: Keyboard.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function () {});
		    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true, prefix: /^.?$/ }, function (range) {
		      if (range.index === 0) return;
		      this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
		      this.quill.selection.scrollIntoView();
		    });
		    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true, suffix: /^$/ }, function (range) {
		      if (range.index >= this.quill.getLength() - 1) return;
		      this.quill.deleteText(range.index, 1, _quill2.default.sources.USER);
		    });
		    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: false }, handleDelete);
		    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: false }, handleDelete);
		    _this.listen();
		    return _this;
		  }
	
		  _createClass(Keyboard, [{
		    key: 'addBinding',
		    value: function addBinding(key) {
		      var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		      var handler = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
		      var binding = normalize(key);
		      if (binding == null || binding.key == null) {
		        return debug.warn('Attempted to add invalid keyboard binding', binding);
		      }
		      if (typeof context === 'function') {
		        context = { handler: context };
		      }
		      if (typeof handler === 'function') {
		        handler = { handler: handler };
		      }
		      binding = (0, _extend2.default)(binding, context, handler);
		      this.bindings[binding.key] = this.bindings[binding.key] || [];
		      this.bindings[binding.key].push(binding);
		    }
		  }, {
		    key: 'listen',
		    value: function listen() {
		      var _this2 = this;
	
		      this.quill.root.addEventListener('keydown', function (evt) {
		        if (evt.defaultPrevented) return;
		        var which = evt.which || evt.keyCode;
		        var bindings = (_this2.bindings[which] || []).filter(function (binding) {
		          return Keyboard.match(evt, binding);
		        });
		        if (bindings.length === 0) return;
		        var range = _this2.quill.getSelection();
		        if (range == null) return; // implies we do not have focus
	
		        var _quill$scroll$line = _this2.quill.scroll.line(range.index);
	
		        var _quill$scroll$line2 = _slicedToArray(_quill$scroll$line, 2);
	
		        var line = _quill$scroll$line2[0];
		        var offset = _quill$scroll$line2[1];
	
		        var _quill$scroll$leaf = _this2.quill.scroll.leaf(range.index);
	
		        var _quill$scroll$leaf2 = _slicedToArray(_quill$scroll$leaf, 2);
	
		        var leafStart = _quill$scroll$leaf2[0];
		        var offsetStart = _quill$scroll$leaf2[1];
	
		        var _ref = range.length === 0 ? [leafStart, offsetStart] : _this2.quill.scroll.leaf(range.index + range.length);
	
		        var _ref2 = _slicedToArray(_ref, 2);
	
		        var leafEnd = _ref2[0];
		        var offsetEnd = _ref2[1];
	
		        var prefixText = leafStart instanceof _parchment2.default.Text ? leafStart.value().slice(0, offsetStart) : '';
		        var suffixText = leafEnd instanceof _parchment2.default.Text ? leafEnd.value().slice(offsetEnd) : '';
		        var curContext = {
		          collapsed: range.length === 0,
		          empty: range.length === 0 && line.length() <= 1,
		          format: _this2.quill.getFormat(range),
		          offset: offset,
		          prefix: prefixText,
		          suffix: suffixText
		        };
		        var prevented = bindings.some(function (binding) {
		          if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) return false;
		          if (binding.empty != null && binding.empty !== curContext.empty) return false;
		          if (binding.offset != null && binding.offset !== curContext.offset) return false;
		          if (Array.isArray(binding.format)) {
		            // any format is present
		            if (binding.format.every(function (name) {
		              return curContext.format[name] == null;
		            })) {
		              return false;
		            }
		          } else if (_typeof(binding.format) === 'object') {
		            // all formats must match
		            if (!Object.keys(binding.format).every(function (name) {
		              if (binding.format[name] === true) return curContext.format[name] != null;
		              if (binding.format[name] === false) return curContext.format[name] == null;
		              return (0, _deepEqual2.default)(binding.format[name], curContext.format[name]);
		            })) {
		              return false;
		            }
		          }
		          if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) return false;
		          if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) return false;
		          return binding.handler.call(_this2, range, curContext) !== true;
		        });
		        if (prevented) {
		          evt.preventDefault();
		        }
		      });
		    }
		  }]);
	
		  return Keyboard;
		}(_module2.default);
	
		Keyboard.keys = {
		  BACKSPACE: 8,
		  TAB: 9,
		  ENTER: 13,
		  ESCAPE: 27,
		  LEFT: 37,
		  UP: 38,
		  RIGHT: 39,
		  DOWN: 40,
		  DELETE: 46
		};
	
		Keyboard.DEFAULTS = {
		  bindings: {
		    'bold': makeFormatHandler('bold'),
		    'italic': makeFormatHandler('italic'),
		    'underline': makeFormatHandler('underline'),
		    'indent': {
		      // highlight tab or tab at beginning of list, indent or blockquote
		      key: Keyboard.keys.TAB,
		      format: ['blockquote', 'indent', 'list'],
		      handler: function handler(range, context) {
		        if (context.collapsed && context.offset !== 0) return true;
		        this.quill.format('indent', '+1', _quill2.default.sources.USER);
		      }
		    },
		    'outdent': {
		      key: Keyboard.keys.TAB,
		      shiftKey: true,
		      format: ['blockquote', 'indent', 'list'],
		      // highlight tab or tab at beginning of list, indent or blockquote
		      handler: function handler(range, context) {
		        if (context.collapsed && context.offset !== 0) return true;
		        this.quill.format('indent', '-1', _quill2.default.sources.USER);
		      }
		    },
		    'outdent backspace': {
		      key: Keyboard.keys.BACKSPACE,
		      collapsed: true,
		      format: ['blockquote', 'indent', 'list'],
		      offset: 0,
		      handler: function handler(range, context) {
		        if (context.format.indent != null) {
		          this.quill.format('indent', '-1', _quill2.default.sources.USER);
		        } else if (context.format.blockquote != null) {
		          this.quill.format('blockquote', false, _quill2.default.sources.USER);
		        } else if (context.format.list != null) {
		          this.quill.format('list', false, _quill2.default.sources.USER);
		        }
		      }
		    },
		    'indent code-block': makeCodeBlockHandler(true),
		    'outdent code-block': makeCodeBlockHandler(false),
		    'remove tab': {
		      key: Keyboard.keys.TAB,
		      shiftKey: true,
		      collapsed: true,
		      prefix: /\t$/,
		      handler: function handler(range, context) {
		        this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
		      }
		    },
		    'tab': {
		      key: Keyboard.keys.TAB,
		      handler: function handler(range, context) {
		        if (!context.collapsed) {
		          this.quill.scroll.deleteAt(range.index, range.length);
		        }
		        this.quill.insertText(range.index, '\t', _quill2.default.sources.USER);
		        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
		      }
		    },
		    'list empty enter': {
		      key: Keyboard.keys.ENTER,
		      collapsed: true,
		      format: ['list'],
		      empty: true,
		      handler: function handler(range, context) {
		        this.quill.format('list', false, _quill2.default.sources.USER);
		        if (context.format.indent) {
		          this.quill.format('indent', false, _quill2.default.sources.USER);
		        }
		      }
		    },
		    'header enter': {
		      key: Keyboard.keys.ENTER,
		      collapsed: true,
		      format: ['header'],
		      suffix: /^$/,
		      handler: function handler(range) {
		        this.quill.scroll.insertAt(range.index, '\n');
		        this.quill.formatText(range.index + 1, 1, 'header', false, _quill2.default.sources.USER);
		        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
		        this.quill.selection.scrollIntoView();
		      }
		    },
		    'list autofill': {
		      key: ' ',
		      collapsed: true,
		      format: { list: false },
		      prefix: /^(1\.|-)$/,
		      handler: function handler(range, context) {
		        var length = context.prefix.length;
		        this.quill.scroll.deleteAt(range.index - length, length);
		        this.quill.formatLine(range.index - length, 1, 'list', length === 1 ? 'bullet' : 'ordered', _quill2.default.sources.USER);
		        this.quill.setSelection(range.index - length, _quill2.default.sources.SILENT);
		      }
		    }
		  }
		};
	
		function handleDelete(range) {
		  this.quill.deleteText(range, _quill2.default.sources.USER);
		  this.quill.setSelection(range.index, _quill2.default.sources.SILENT);
		  this.quill.selection.scrollIntoView();
		}
	
		function handleEnter(range, context) {
		  var _this3 = this;
	
		  if (range.length > 0) {
		    this.quill.scroll.deleteAt(range.index, range.length); // So we do not trigger text-change
		  }
		  var lineFormats = Object.keys(context.format).reduce(function (lineFormats, format) {
		    if (_parchment2.default.query(format, _parchment2.default.Scope.BLOCK) && !Array.isArray(context.format[format])) {
		      lineFormats[format] = context.format[format];
		    }
		    return lineFormats;
		  }, {});
		  this.quill.insertText(range.index, '\n', lineFormats, _quill2.default.sources.USER);
		  this.quill.selection.scrollIntoView();
		  Object.keys(context.format).forEach(function (name) {
		    if (lineFormats[name] != null) return;
		    if (Array.isArray(context.format[name])) return;
		    if (name === 'link') return;
		    _this3.quill.format(name, context.format[name], _quill2.default.sources.USER);
		  });
		}
	
		function makeCodeBlockHandler(indent) {
		  return {
		    key: Keyboard.keys.TAB,
		    shiftKey: !indent,
		    format: { 'code-block': true },
		    handler: function handler(range) {
		      var CodeBlock = _parchment2.default.query('code-block');
		      var index = range.index,
		          length = range.length;
	
		      var _quill$scroll$descend = this.quill.scroll.descendant(CodeBlock, index);
	
		      var _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2);
	
		      var block = _quill$scroll$descend2[0];
		      var offset = _quill$scroll$descend2[1];
	
		      if (block == null) return;
		      var scrollOffset = this.quill.scroll.offset(block);
		      var start = block.newlineIndex(offset, true) + 1;
		      var end = block.newlineIndex(scrollOffset + offset + length);
		      var lines = block.domNode.textContent.slice(start, end).split('\n');
		      offset = 0;
		      lines.forEach(function (line, i) {
		        if (indent) {
		          block.insertAt(start + offset, CodeBlock.TAB);
		          offset += CodeBlock.TAB.length;
		          if (i === 0) {
		            index += CodeBlock.TAB.length;
		          } else {
		            length += CodeBlock.TAB.length;
		          }
		        } else if (line.startsWith(CodeBlock.TAB)) {
		          block.deleteAt(start + offset, CodeBlock.TAB.length);
		          offset -= CodeBlock.TAB.length;
		          if (i === 0) {
		            index -= CodeBlock.TAB.length;
		          } else {
		            length -= CodeBlock.TAB.length;
		          }
		        }
		        offset += line.length + 1;
		      });
		      this.quill.update(_quill2.default.sources.USER);
		      this.quill.setSelection(index, length, _quill2.default.sources.SILENT);
		    }
		  };
		}
	
		function makeFormatHandler(format) {
		  return {
		    key: format[0].toUpperCase(),
		    shortKey: true,
		    handler: function handler(range, context) {
		      this.quill.format(format, !context.format[format], _quill2.default.sources.USER);
		    }
		  };
		}
	
		function normalize(binding) {
		  if (typeof binding === 'string' || typeof binding === 'number') {
		    return normalize({ key: binding });
		  }
		  if ((typeof binding === 'undefined' ? 'undefined' : _typeof(binding)) === 'object') {
		    binding = (0, _clone2.default)(binding, false);
		  }
		  if (typeof binding.key === 'string') {
		    if (Keyboard.keys[binding.key.toUpperCase()] != null) {
		      binding.key = Keyboard.keys[binding.key.toUpperCase()];
		    } else if (binding.key.length === 1) {
		      binding.key = binding.key.toUpperCase().charCodeAt(0);
		    } else {
		      return null;
		    }
		  }
		  return binding;
		}
	
		exports.default = Keyboard;
	
	/***/ },
	/* 54 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.IndentClass = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var IdentAttributor = function (_Parchment$Attributor) {
		  _inherits(IdentAttributor, _Parchment$Attributor);
	
		  function IdentAttributor() {
		    _classCallCheck(this, IdentAttributor);
	
		    return _possibleConstructorReturn(this, (IdentAttributor.__proto__ || Object.getPrototypeOf(IdentAttributor)).apply(this, arguments));
		  }
	
		  _createClass(IdentAttributor, [{
		    key: 'add',
		    value: function add(node, value) {
		      if (value === '+1' || value === '-1') {
		        var indent = this.value(node) || 0;
		        value = value === '+1' ? indent + 1 : indent - 1;
		      }
		      if (value === 0) {
		        this.remove(node);
		        return true;
		      } else {
		        return _get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'add', this).call(this, node, value);
		      }
		    }
		  }, {
		    key: 'value',
		    value: function value(node) {
		      return parseInt(_get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'value', this).call(this, node)) || undefined; // Don't return NaN
		    }
		  }]);
	
		  return IdentAttributor;
		}(_parchment2.default.Attributor.Class);
	
		var IndentClass = new IdentAttributor('indent', 'ql-indent', {
		  scope: _parchment2.default.Scope.BLOCK,
		  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
		});
	
		exports.IndentClass = IndentClass;
	
	/***/ },
	/* 55 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Blockquote = function (_Block) {
		  _inherits(Blockquote, _Block);
	
		  function Blockquote() {
		    _classCallCheck(this, Blockquote);
	
		    return _possibleConstructorReturn(this, (Blockquote.__proto__ || Object.getPrototypeOf(Blockquote)).apply(this, arguments));
		  }
	
		  return Blockquote;
		}(_block2.default);
	
		Blockquote.blotName = 'blockquote';
		Blockquote.tagName = 'blockquote';
	
		exports.default = Blockquote;
	
	/***/ },
	/* 56 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Header = function (_Block) {
		  _inherits(Header, _Block);
	
		  function Header() {
		    _classCallCheck(this, Header);
	
		    return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
		  }
	
		  _createClass(Header, null, [{
		    key: 'formats',
		    value: function formats(domNode) {
		      return this.tagName.indexOf(domNode.tagName) + 1;
		    }
		  }]);
	
		  return Header;
		}(_block2.default);
	
		Header.blotName = 'header';
		Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
	
		exports.default = Header;
	
	/***/ },
	/* 57 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.ListItem = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _block = __webpack_require__(33);
	
		var _block2 = _interopRequireDefault(_block);
	
		var _container = __webpack_require__(43);
	
		var _container2 = _interopRequireDefault(_container);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var ListItem = function (_Block) {
		  _inherits(ListItem, _Block);
	
		  function ListItem() {
		    _classCallCheck(this, ListItem);
	
		    return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).apply(this, arguments));
		  }
	
		  _createClass(ListItem, [{
		    key: 'format',
		    value: function format(name, value) {
		      if (name === List.blotName && !value) {
		        this.replaceWith(_parchment2.default.create(this.statics.scope));
		      } else {
		        _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'format', this).call(this, name, value);
		      }
		    }
		  }, {
		    key: 'remove',
		    value: function remove() {
		      if (this.prev == null && this.next == null) {
		        this.parent.remove();
		      } else {
		        _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'remove', this).call(this);
		      }
		    }
		  }, {
		    key: 'replaceWith',
		    value: function replaceWith(name, value) {
		      this.parent.isolate(this.offset(this.parent), this.length());
		      if (name === this.parent.statics.blotName) {
		        this.parent.replaceWith(name, value);
		        return this;
		      } else {
		        this.parent.unwrap();
		        return _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'replaceWith', this).call(this, name, value);
		      }
		    }
		  }], [{
		    key: 'formats',
		    value: function formats(domNode) {
		      return domNode.tagName === this.tagName ? undefined : _get(ListItem.__proto__ || Object.getPrototypeOf(ListItem), 'formats', this).call(this, domNode);
		    }
		  }]);
	
		  return ListItem;
		}(_block2.default);
	
		ListItem.blotName = 'list-item';
		ListItem.tagName = 'LI';
	
		var List = function (_Container) {
		  _inherits(List, _Container);
	
		  function List() {
		    _classCallCheck(this, List);
	
		    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
		  }
	
		  _createClass(List, [{
		    key: 'format',
		    value: function format(name, value) {
		      if (this.children.length > 0) {
		        this.children.tail.format(name, value);
		      }
		    }
		  }, {
		    key: 'formats',
		    value: function formats() {
		      // We don't inherit from FormatBlot
		      return _defineProperty({}, this.statics.blotName, this.statics.formats(this.domNode));
		    }
		  }, {
		    key: 'insertBefore',
		    value: function insertBefore(blot, ref) {
		      if (blot instanceof ListItem) {
		        _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'insertBefore', this).call(this, blot, ref);
		      } else {
		        var index = ref == null ? this.length() : ref.offset(this);
		        var after = this.split(index);
		        after.parent.insertBefore(blot, after);
		      }
		    }
		  }, {
		    key: 'optimize',
		    value: function optimize() {
		      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'optimize', this).call(this);
		      var next = this.next;
		      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName) {
		        next.moveChildren(this);
		        next.remove();
		      }
		    }
		  }, {
		    key: 'replace',
		    value: function replace(target) {
		      if (target.statics.blotName !== this.statics.blotName) {
		        var item = _parchment2.default.create(this.statics.defaultChild);
		        target.moveChildren(item);
		        this.appendChild(item);
		      }
		      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'replace', this).call(this, target);
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      if (value === 'ordered') {
		        value = 'OL';
		      } else if (value === 'bullet') {
		        value = 'UL';
		      }
		      return _get(List.__proto__ || Object.getPrototypeOf(List), 'create', this).call(this, value);
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      if (domNode.tagName === 'OL') return 'ordered';
		      if (domNode.tagName === 'UL') return 'bullet';
		      return undefined;
		    }
		  }]);
	
		  return List;
		}(_container2.default);
	
		List.blotName = 'list';
		List.scope = _parchment2.default.Scope.BLOCK_BLOT;
		List.tagName = ['OL', 'UL'];
		List.defaultChild = 'list-item';
		List.allowedChildren = [ListItem];
	
		exports.ListItem = ListItem;
		exports.default = List;
	
	/***/ },
	/* 58 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Bold = function (_Inline) {
		  _inherits(Bold, _Inline);
	
		  function Bold() {
		    _classCallCheck(this, Bold);
	
		    return _possibleConstructorReturn(this, (Bold.__proto__ || Object.getPrototypeOf(Bold)).apply(this, arguments));
		  }
	
		  _createClass(Bold, [{
		    key: 'optimize',
		    value: function optimize() {
		      _get(Bold.prototype.__proto__ || Object.getPrototypeOf(Bold.prototype), 'optimize', this).call(this);
		      if (this.domNode.tagName !== this.statics.tagName[0]) {
		        this.replaceWith(this.statics.blotName);
		      }
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      return _get(Bold.__proto__ || Object.getPrototypeOf(Bold), 'create', this).call(this);
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      return true;
		    }
		  }]);
	
		  return Bold;
		}(_inline2.default);
	
		Bold.blotName = 'bold';
		Bold.tagName = ['STRONG', 'B'];
	
		exports.default = Bold;
	
	/***/ },
	/* 59 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _bold = __webpack_require__(58);
	
		var _bold2 = _interopRequireDefault(_bold);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Italic = function (_Bold) {
		  _inherits(Italic, _Bold);
	
		  function Italic() {
		    _classCallCheck(this, Italic);
	
		    return _possibleConstructorReturn(this, (Italic.__proto__ || Object.getPrototypeOf(Italic)).apply(this, arguments));
		  }
	
		  return Italic;
		}(_bold2.default);
	
		Italic.blotName = 'italic';
		Italic.tagName = ['EM', 'I'];
	
		exports.default = Italic;
	
	/***/ },
	/* 60 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.sanitize = exports.default = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Link = function (_Inline) {
		  _inherits(Link, _Inline);
	
		  function Link() {
		    _classCallCheck(this, Link);
	
		    return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
		  }
	
		  _createClass(Link, [{
		    key: 'format',
		    value: function format(name, value) {
		      if (name !== this.statics.blotName || !value) return _get(Link.prototype.__proto__ || Object.getPrototypeOf(Link.prototype), 'format', this).call(this, name, value);
		      value = this.constructor.sanitize(value);
		      this.domNode.setAttribute('href', value);
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      var node = _get(Link.__proto__ || Object.getPrototypeOf(Link), 'create', this).call(this, value);
		      value = this.sanitize(value);
		      node.setAttribute('href', value);
		      node.setAttribute('target', '_blank');
		      return node;
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      return domNode.getAttribute('href');
		    }
		  }, {
		    key: 'sanitize',
		    value: function sanitize(url) {
		      return _sanitize(url, ['http', 'https', 'mailto']) ? url : this.SANITIZED_URL;
		    }
		  }]);
	
		  return Link;
		}(_inline2.default);
	
		Link.blotName = 'link';
		Link.tagName = 'A';
		Link.SANITIZED_URL = 'about:blank';
	
		function _sanitize(url, protocols) {
		  var anchor = document.createElement('a');
		  anchor.href = url;
		  var protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
		  return protocols.indexOf(protocol) > -1;
		}
	
		exports.default = Link;
		exports.sanitize = _sanitize;
	
	/***/ },
	/* 61 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Script = function (_Inline) {
		  _inherits(Script, _Inline);
	
		  function Script() {
		    _classCallCheck(this, Script);
	
		    return _possibleConstructorReturn(this, (Script.__proto__ || Object.getPrototypeOf(Script)).apply(this, arguments));
		  }
	
		  _createClass(Script, null, [{
		    key: 'create',
		    value: function create(value) {
		      if (value === 'super') {
		        return document.createElement('sup');
		      } else if (value === 'sub') {
		        return document.createElement('sub');
		      } else {
		        return _get(Script.__proto__ || Object.getPrototypeOf(Script), 'create', this).call(this, value);
		      }
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      if (domNode.tagName === 'SUB') return 'sub';
		      if (domNode.tagName === 'SUP') return 'super';
		      return undefined;
		    }
		  }]);
	
		  return Script;
		}(_inline2.default);
	
		Script.blotName = 'script';
		Script.tagName = ['SUB', 'SUP'];
	
		exports.default = Script;
	
	/***/ },
	/* 62 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Strike = function (_Inline) {
		  _inherits(Strike, _Inline);
	
		  function Strike() {
		    _classCallCheck(this, Strike);
	
		    return _possibleConstructorReturn(this, (Strike.__proto__ || Object.getPrototypeOf(Strike)).apply(this, arguments));
		  }
	
		  return Strike;
		}(_inline2.default);
	
		Strike.blotName = 'strike';
		Strike.tagName = 'S';
	
		exports.default = Strike;
	
	/***/ },
	/* 63 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _inline = __webpack_require__(36);
	
		var _inline2 = _interopRequireDefault(_inline);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Underline = function (_Inline) {
		  _inherits(Underline, _Inline);
	
		  function Underline() {
		    _classCallCheck(this, Underline);
	
		    return _possibleConstructorReturn(this, (Underline.__proto__ || Object.getPrototypeOf(Underline)).apply(this, arguments));
		  }
	
		  return Underline;
		}(_inline2.default);
	
		Underline.blotName = 'underline';
		Underline.tagName = 'U';
	
		exports.default = Underline;
	
	/***/ },
	/* 64 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		var _link = __webpack_require__(60);
	
		var _link2 = _interopRequireDefault(_link);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Image = function (_Embed) {
		  _inherits(Image, _Embed);
	
		  function Image() {
		    _classCallCheck(this, Image);
	
		    return _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).apply(this, arguments));
		  }
	
		  _createClass(Image, [{
		    key: 'format',
		    value: function format(name, value) {
		      if (name === 'height' || name === 'width') {
		        if (value) {
		          this.domNode.setAttribute(name, value);
		        } else {
		          this.domNode.removeAttribute(name);
		        }
		      } else {
		        _get(Image.prototype.__proto__ || Object.getPrototypeOf(Image.prototype), 'format', this).call(this, name, value);
		      }
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      var node = _get(Image.__proto__ || Object.getPrototypeOf(Image), 'create', this).call(this, value);
		      if (typeof value === 'string') {
		        node.setAttribute('src', this.sanitize(value));
		      }
		      return node;
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      var formats = {};
		      if (domNode.hasAttribute('height')) formats['height'] = domNode.getAttribute('height');
		      if (domNode.hasAttribute('width')) formats['width'] = domNode.getAttribute('width');
		      return formats;
		    }
		  }, {
		    key: 'match',
		    value: function match(url) {
		      return (/\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url)
		      );
		    }
		  }, {
		    key: 'sanitize',
		    value: function sanitize(url) {
		      return (0, _link.sanitize)(url, ['http', 'https', 'data']) ? url : '//:0';
		    }
		  }, {
		    key: 'value',
		    value: function value(domNode) {
		      return domNode.getAttribute('src');
		    }
		  }]);
	
		  return Image;
		}(_embed2.default);
	
		Image.blotName = 'image';
		Image.tagName = 'IMG';
	
		exports.default = Image;
	
	/***/ },
	/* 65 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _block = __webpack_require__(33);
	
		var _link = __webpack_require__(60);
	
		var _link2 = _interopRequireDefault(_link);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var Video = function (_BlockEmbed) {
		  _inherits(Video, _BlockEmbed);
	
		  function Video() {
		    _classCallCheck(this, Video);
	
		    return _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).apply(this, arguments));
		  }
	
		  _createClass(Video, [{
		    key: 'format',
		    value: function format(name, value) {
		      if (name === 'height' || name === 'width') {
		        if (value) {
		          this.domNode.setAttribute(name, value);
		        } else {
		          this.domNode.removeAttribute(name);
		        }
		      } else {
		        _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'format', this).call(this, name, value);
		      }
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      var node = _get(Video.__proto__ || Object.getPrototypeOf(Video), 'create', this).call(this, value);
		      node.setAttribute('frameborder', '0');
		      node.setAttribute('allowfullscreen', true);
		      node.setAttribute('src', this.sanitize(value));
		      return node;
		    }
		  }, {
		    key: 'formats',
		    value: function formats(domNode) {
		      var formats = {};
		      if (domNode.hasAttribute('height')) formats['height'] = domNode.getAttribute('height');
		      if (domNode.hasAttribute('width')) formats['width'] = domNode.getAttribute('width');
		      return formats;
		    }
		  }, {
		    key: 'sanitize',
		    value: function sanitize(url) {
		      return _link2.default.sanitize(url);
		    }
		  }, {
		    key: 'value',
		    value: function value(domNode) {
		      return domNode.getAttribute('src');
		    }
		  }]);
	
		  return Video;
		}(_block.BlockEmbed);
	
		Video.blotName = 'video';
		Video.className = 'ql-video';
		Video.tagName = 'IFRAME';
	
		exports.default = Video;
	
	/***/ },
	/* 66 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.FormulaBlot = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _embed = __webpack_require__(35);
	
		var _embed2 = _interopRequireDefault(_embed);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var FormulaBlot = function (_Embed) {
		  _inherits(FormulaBlot, _Embed);
	
		  function FormulaBlot() {
		    _classCallCheck(this, FormulaBlot);
	
		    return _possibleConstructorReturn(this, (FormulaBlot.__proto__ || Object.getPrototypeOf(FormulaBlot)).apply(this, arguments));
		  }
	
		  _createClass(FormulaBlot, [{
		    key: 'index',
		    value: function index(node, offset) {
		      return 1;
		    }
		  }], [{
		    key: 'create',
		    value: function create(value) {
		      var node = _get(FormulaBlot.__proto__ || Object.getPrototypeOf(FormulaBlot), 'create', this).call(this, value);
		      if (typeof value === 'string') {
		        katex.render(value, node);
		        node.setAttribute('data-value', value);
		      }
		      node.setAttribute('contenteditable', false);
		      return node;
		    }
		  }, {
		    key: 'value',
		    value: function value(domNode) {
		      return domNode.getAttribute('data-value');
		    }
		  }]);
	
		  return FormulaBlot;
		}(_embed2.default);
	
		FormulaBlot.blotName = 'formula';
		FormulaBlot.className = 'ql-formula';
		FormulaBlot.tagName = 'SPAN';
	
		function Formula() {
		  if (window.katex == null) {
		    throw new Error('Formula module requires KaTeX.');
		  }
		  _quill2.default.register(FormulaBlot, true);
		}
	
		exports.FormulaBlot = FormulaBlot;
		exports.default = Formula;
	
	/***/ },
	/* 67 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.CodeToken = exports.CodeBlock = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		var _module = __webpack_require__(40);
	
		var _module2 = _interopRequireDefault(_module);
	
		var _code = __webpack_require__(32);
	
		var _code2 = _interopRequireDefault(_code);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var SyntaxCodeBlock = function (_CodeBlock) {
		  _inherits(SyntaxCodeBlock, _CodeBlock);
	
		  function SyntaxCodeBlock() {
		    _classCallCheck(this, SyntaxCodeBlock);
	
		    return _possibleConstructorReturn(this, (SyntaxCodeBlock.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock)).apply(this, arguments));
		  }
	
		  _createClass(SyntaxCodeBlock, [{
		    key: 'replaceWith',
		    value: function replaceWith(block) {
		      this.domNode.textContent = this.domNode.textContent;
		      this.attach();
		      _get(SyntaxCodeBlock.prototype.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock.prototype), 'replaceWith', this).call(this, block);
		    }
		  }, {
		    key: 'highlight',
		    value: function highlight(_highlight) {
		      if (this.cachedHTML !== this.domNode.innerHTML) {
		        var text = this.domNode.textContent;
		        if (text.trim().length > 0 || this.cachedHTML == null) {
		          this.domNode.innerHTML = _highlight(text);
		          this.attach();
		        }
		        this.cachedHTML = this.domNode.innerHTML;
		      }
		    }
		  }]);
	
		  return SyntaxCodeBlock;
		}(_code2.default);
	
		SyntaxCodeBlock.className = 'ql-syntax';
	
		var CodeToken = new _parchment2.default.Attributor.Class('token', 'hljs', {
		  scope: _parchment2.default.Scope.INLINE
		});
	
		var Syntax = function (_Module) {
		  _inherits(Syntax, _Module);
	
		  function Syntax(quill, options) {
		    _classCallCheck(this, Syntax);
	
		    var _this2 = _possibleConstructorReturn(this, (Syntax.__proto__ || Object.getPrototypeOf(Syntax)).call(this, quill, options));
	
		    if (typeof _this2.options.highlight !== 'function') {
		      throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
		    }
		    _quill2.default.register(CodeToken, true);
		    _quill2.default.register(SyntaxCodeBlock, true);
		    var timer = null;
		    _this2.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
		      if (timer != null) return;
		      timer = setTimeout(function () {
		        _this2.highlight();
		        timer = null;
		      }, 100);
		    });
		    _this2.highlight();
		    return _this2;
		  }
	
		  _createClass(Syntax, [{
		    key: 'highlight',
		    value: function highlight() {
		      var _this3 = this;
	
		      if (this.quill.selection.composing) return;
		      var range = this.quill.getSelection();
		      this.quill.scroll.descendants(SyntaxCodeBlock).forEach(function (code) {
		        code.highlight(_this3.options.highlight);
		      });
		      this.quill.update(_quill2.default.sources.SILENT);
		      if (range != null) {
		        this.quill.setSelection(range, _quill2.default.sources.SILENT);
		      }
		    }
		  }]);
	
		  return Syntax;
		}(_module2.default);
	
		Syntax.DEFAULTS = {
		  highlight: function () {
		    if (window.hljs == null) return null;
		    return function (text) {
		      var result = window.hljs.highlightAuto(text);
		      return result.value;
		    };
		  }()
		};
	
		exports.CodeBlock = SyntaxCodeBlock;
		exports.CodeToken = CodeToken;
		exports.default = Syntax;
	
	/***/ },
	/* 68 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.addControls = exports.default = undefined;
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _parchment = __webpack_require__(3);
	
		var _parchment2 = _interopRequireDefault(_parchment);
	
		var _quill = __webpack_require__(19);
	
		var _quill2 = _interopRequireDefault(_quill);
	
		var _logger = __webpack_require__(31);
	
		var _logger2 = _interopRequireDefault(_logger);
	
		var _module = __webpack_require__(40);
	
		var _module2 = _interopRequireDefault(_module);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var debug = (0, _logger2.default)('quill:toolbar');
	
		var Toolbar = function (_Module) {
		  _inherits(Toolbar, _Module);
	
		  function Toolbar(quill, options) {
		    _classCallCheck(this, Toolbar);
	
		    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, quill, options));
	
		    if (Array.isArray(_this.options.container)) {
		      var container = document.createElement('div');
		      addControls(container, _this.options.container);
		      quill.container.parentNode.insertBefore(container, quill.container);
		      _this.container = container;
		    } else if (typeof _this.options.container === 'string') {
		      _this.container = document.querySelector(_this.options.container);
		    } else {
		      _this.container = _this.options.container;
		    }
		    if (!(_this.container instanceof HTMLElement)) {
		      var _ret;
	
		      return _ret = debug.error('Container required for toolbar', _this.options), _possibleConstructorReturn(_this, _ret);
		    }
		    _this.container.classList.add('ql-toolbar');
		    _this.controls = [];
		    _this.handlers = {};
		    Object.keys(_this.options.handlers).forEach(function (format) {
		      _this.addHandler(format, _this.options.handlers[format]);
		    });
		    _this.container.addEventListener('mousedown', function (e) {
		      e.preventDefault(); // Prevent blur
		    });
		    [].forEach.call(_this.container.querySelectorAll('button, select'), function (input) {
		      _this.attach(input);
		    });
		    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (type, range) {
		      if (type === _quill2.default.events.SELECTION_CHANGE) {
		        _this.update(range);
		      }
		    });
		    _this.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
		      var _this$quill$selection = _this.quill.selection.getRange();
	
		      var _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1);
	
		      var range = _this$quill$selection2[0]; // quill.getSelection triggers update
	
		      _this.update(range);
		    });
		    return _this;
		  }
	
		  _createClass(Toolbar, [{
		    key: 'addHandler',
		    value: function addHandler(format, handler) {
		      this.handlers[format] = handler;
		    }
		  }, {
		    key: 'attach',
		    value: function attach(input) {
		      var _this2 = this;
	
		      var format = [].find.call(input.classList, function (className) {
		        return className.indexOf('ql-') === 0;
		      });
		      if (!format) return;
		      format = format.slice('ql-'.length);
		      if (input.tagName === 'BUTTON') {
		        input.setAttribute('type', 'button');
		      }
		      if (this.handlers[format] == null) {
		        if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
		          debug.warn('ignoring attaching to disabled format', format, input);
		          return;
		        }
		        if (_parchment2.default.query(format) == null) {
		          debug.warn('ignoring attaching to nonexistent format', format, input);
		          return;
		        }
		      }
		      var eventName = input.tagName === 'SELECT' ? 'change' : 'click';
		      input.addEventListener(eventName, function (e) {
		        var value = void 0;
		        if (input.tagName === 'SELECT') {
		          if (input.selectedIndex < 0) return;
		          var selected = input.options[input.selectedIndex];
		          if (selected.hasAttribute('selected')) {
		            value = false;
		          } else {
		            value = selected.value || false;
		          }
		        } else {
		          if (input.classList.contains('ql-active')) {
		            value = false;
		          } else {
		            value = input.value || !input.hasAttribute('value');
		          }
		          e.preventDefault();
		        }
		        _this2.quill.focus();
	
		        var _quill$selection$getR = _this2.quill.selection.getRange();
	
		        var _quill$selection$getR2 = _slicedToArray(_quill$selection$getR, 1);
	
		        var range = _quill$selection$getR2[0];
	
		        if (_this2.handlers[format] != null) {
		          _this2.handlers[format].call(_this2, value);
		        } else if (_parchment2.default.query(format).prototype instanceof _parchment2.default.Embed) {
		          value = prompt('Enter ' + format);
		          if (!value) return;
		          _this2.quill.updateContents(new _delta2.default().retain(range.index).delete(range.length).insert(_defineProperty({}, format, value)), _quill2.default.sources.USER);
		        } else {
		          _this2.quill.format(format, value, _quill2.default.sources.USER);
		        }
		        _this2.update(range);
		      });
		      // TODO use weakmap
		      this.controls.push([format, input]);
		    }
		  }, {
		    key: 'update',
		    value: function update(range) {
		      var formats = range == null ? {} : this.quill.getFormat(range);
		      this.controls.forEach(function (pair) {
		        var _pair = _slicedToArray(pair, 2);
	
		        var format = _pair[0];
		        var input = _pair[1];
	
		        if (input.tagName === 'SELECT') {
		          var option = void 0;
		          if (range == null) {
		            option = null;
		          } else if (formats[format] == null) {
		            option = input.querySelector('option[selected]');
		          } else if (!Array.isArray(formats[format])) {
		            var value = formats[format];
		            if (typeof value === 'string') {
		              value = value.replace(/\"/g, '\\"');
		            }
		            option = input.querySelector('option[value="' + value + '"]');
		          }
		          if (option == null) {
		            input.value = ''; // TODO make configurable?
		            input.selectedIndex = -1;
		          } else {
		            option.selected = true;
		          }
		        } else {
		          if (range == null) {
		            input.classList.remove('ql-active');
		          } else if (input.hasAttribute('value')) {
		            // both being null should match (default values)
		            // '1' should match with 1 (headers)
		            var isActive = formats[format] === input.getAttribute('value') || formats[format] != null && formats[format].toString() === input.getAttribute('value') || formats[format] == null && !input.getAttribute('value');
		            input.classList.toggle('ql-active', isActive);
		          } else {
		            input.classList.toggle('ql-active', formats[format] != null);
		          }
		        }
		      });
		    }
		  }]);
	
		  return Toolbar;
		}(_module2.default);
	
		Toolbar.DEFAULTS = {};
	
		function addButton(container, format, value) {
		  var input = document.createElement('button');
		  input.setAttribute('type', 'button');
		  input.classList.add('ql-' + format);
		  if (value != null) {
		    input.value = value;
		  }
		  container.appendChild(input);
		}
	
		function addControls(container, groups) {
		  if (!Array.isArray(groups[0])) {
		    groups = [groups];
		  }
		  groups.forEach(function (controls) {
		    var group = document.createElement('span');
		    group.classList.add('ql-formats');
		    controls.forEach(function (control) {
		      if (typeof control === 'string') {
		        addButton(group, control);
		      } else {
		        var format = Object.keys(control)[0];
		        var value = control[format];
		        if (Array.isArray(value)) {
		          addSelect(group, format, value);
		        } else {
		          addButton(group, format, value);
		        }
		      }
		    });
		    container.appendChild(group);
		  });
		}
	
		function addSelect(container, format, values) {
		  var input = document.createElement('select');
		  input.classList.add('ql-' + format);
		  values.forEach(function (value) {
		    var option = document.createElement('option');
		    if (value !== false) {
		      option.setAttribute('value', value);
		    } else {
		      option.setAttribute('selected', 'selected');
		    }
		    input.appendChild(option);
		  });
		  container.appendChild(input);
		}
	
		Toolbar.DEFAULTS = {
		  container: null,
		  handlers: {
		    clean: function clean(value) {
		      var _this3 = this;
	
		      var range = this.quill.getSelection();
		      if (range == null) return;
		      if (range.length == 0) {
		        var formats = this.quill.getFormat();
		        Object.keys(formats).forEach(function (name) {
		          // Clean functionality in existing apps only clean inline formats
		          if (_parchment2.default.query(name, _parchment2.default.Scope.INLINE) != null) {
		            _this3.quill.format(name, false);
		          }
		        });
		      } else {
		        this.quill.removeFormat(range, _quill2.default.sources.USER);
		      }
		    },
		    direction: function direction(value) {
		      var align = this.quill.getFormat()['align'];
		      if (value === 'rtl' && align == null) {
		        this.quill.format('align', 'right', _quill2.default.sources.USER);
		      } else if (!value && align === 'right') {
		        this.quill.format('align', false, _quill2.default.sources.USER);
		      }
		      this.quill.format('direction', value, _quill2.default.sources.USER);
		    },
		    link: function link(value) {
		      if (value === true) {
		        value = prompt('Enter link URL:');
		      }
		      this.quill.format('link', value, _quill2.default.sources.USER);
		    },
		    indent: function indent(value) {
		      var range = this.quill.getSelection();
		      var formats = this.quill.getFormat(range);
		      var indent = parseInt(formats.indent || 0);
		      if (value === '+1' || value === '-1') {
		        var modifier = value === '+1' ? 1 : -1;
		        if (formats.direction === 'rtl') modifier *= -1;
		        this.quill.format('indent', indent + modifier, _quill2.default.sources.USER);
		      }
		    }
		  }
		};
	
		exports.default = Toolbar;
		exports.addControls = addControls;
	
	/***/ },
	/* 69 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		module.exports = {
		  'align': {
		    '': __webpack_require__(70),
		    'center': __webpack_require__(71),
		    'right': __webpack_require__(72),
		    'justify': __webpack_require__(73)
		  },
		  'background': __webpack_require__(74),
		  'blockquote': __webpack_require__(75),
		  'bold': __webpack_require__(76),
		  'clean': __webpack_require__(77),
		  'code-block': __webpack_require__(78),
		  'color': __webpack_require__(79),
		  'direction': {
		    '': __webpack_require__(80),
		    'rtl': __webpack_require__(81)
		  },
		  'float': {
		    'center': __webpack_require__(82),
		    'full': __webpack_require__(83),
		    'left': __webpack_require__(84),
		    'right': __webpack_require__(85)
		  },
		  'formula': __webpack_require__(86),
		  'header': {
		    '1': __webpack_require__(87),
		    '2': __webpack_require__(88)
		  },
		  'italic': __webpack_require__(89),
		  'image': __webpack_require__(90),
		  'indent': {
		    '+1': __webpack_require__(91),
		    '-1': __webpack_require__(92)
		  },
		  'link': __webpack_require__(93),
		  'list': {
		    'ordered': __webpack_require__(94),
		    'bullet': __webpack_require__(95)
		  },
		  'script': {
		    'sub': __webpack_require__(96),
		    'super': __webpack_require__(97)
		  },
		  'strike': __webpack_require__(98),
		  'underline': __webpack_require__(99),
		  'video': __webpack_require__(100)
		};
	
	/***/ },
	/* 70 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>";
	
	/***/ },
	/* 71 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>";
	
	/***/ },
	/* 72 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>";
	
	/***/ },
	/* 73 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>";
	
	/***/ },
	/* 74 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <g class=\"ql-fill ql-color-label\"> <polygon points=\"6 6.868 6 6 5 6 5 7 5.942 7 6 6.868\"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points=\"6.817 5 6 5 6 6 6.38 6 6.817 5\"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points=\"4 11.439 4 11 3 11 3 12 3.755 12 4 11.439\"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points=\"4.63 10 4 10 4 11 4.192 11 4.63 10\"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points=\"13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174\"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points=\"12 6.868 12 6 11.62 6 12 6.868\"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points=\"12.933 9 13 9 13 8 12.495 8 12.933 9\"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points=\"5.5 13 9 5 12.5 13\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>";
	
	/***/ },
	/* 75 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=4 y=5></rect> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=11 y=5></rect> <path class=\"ql-even ql-fill ql-stroke\" d=M7,8c0,4.031-3,5-3,5></path> <path class=\"ql-even ql-fill ql-stroke\" d=M14,8c0,4.031-3,5-3,5></path> </svg>";
	
	/***/ },
	/* 76 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>";
	
	/***/ },
	/* 77 */
	/***/ function(module, exports) {
	
		module.exports = "<svg class=\"\" viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>";
	
	/***/ },
	/* 78 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <polyline class=\"ql-even ql-stroke\" points=\"5 7 3 9 5 11\"></polyline> <polyline class=\"ql-even ql-stroke\" points=\"13 7 15 9 13 11\"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>";
	
	/***/ },
	/* 79 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-color-label ql-stroke ql-transparent\" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points=\"5.5 11 9 3 12.5 11\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>";
	
	/***/ },
	/* 80 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"></polygon> <line class=\"ql-stroke ql-fill\" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>";
	
	/***/ },
	/* 81 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"></polygon> <line class=\"ql-stroke ql-fill\" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>";
	
	/***/ },
	/* 82 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>";
	
	/***/ },
	/* 83 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>";
	
	/***/ },
	/* 84 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>";
	
	/***/ },
	/* 85 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform=\"translate(24 18) rotate(-180)\"/> </svg>";
	
	/***/ },
	/* 86 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>";
	
	/***/ },
	/* 87 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <line class=\"ql-stroke ql-thin\" x1=13.5 x2=15.5 y1=14.5 y2=14.5></line> <path class=ql-fill d=M14.5,15a0.5,0.5,0,0,1-.5-0.5V12.085l-0.276.138A0.5,0.5,0,0,1,13.053,12c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,15,11.5v3A0.5,0.5,0,0,1,14.5,15Z></path> </svg>";
	
	/***/ },
	/* 88 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <path class=\"ql-stroke ql-thin\" d=M15.5,14.5h-2c0-.234,1.85-1.076,1.85-2.234a0.959,0.959,0,0,0-1.85-.109></path> </svg>";
	
	/***/ },
	/* 89 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>";
	
	/***/ },
	/* 90 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"></polyline> </svg>";
	
	/***/ },
	/* 91 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"></polyline> </svg>";
	
	/***/ },
	/* 92 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points=\"5 7 5 11 3 9 5 7\"></polyline> </svg>";
	
	/***/ },
	/* 93 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class=\"ql-even ql-stroke\" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class=\"ql-even ql-stroke\" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>";
	
	/***/ },
	/* 94 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class=\"ql-stroke ql-thin\" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class=\"ql-stroke ql-thin\" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class=\"ql-stroke ql-thin\" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>";
	
	/***/ },
	/* 95 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>";
	
	/***/ },
	/* 96 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>";
	
	/***/ },
	/* 97 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>";
	
	/***/ },
	/* 98 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-stroke ql-thin\" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>";
	
	/***/ },
	/* 99 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>";
	
	/***/ },
	/* 100 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>";
	
	/***/ },
	/* 101 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _dropdown = __webpack_require__(102);
	
		var _dropdown2 = _interopRequireDefault(_dropdown);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var Picker = function () {
		  function Picker(select) {
		    var _this = this;
	
		    _classCallCheck(this, Picker);
	
		    this.select = select;
		    this.container = document.createElement('span');
		    this.buildPicker();
		    this.select.style.display = 'none';
		    this.select.parentNode.insertBefore(this.container, this.select);
		    this.label.addEventListener('click', function (event) {
		      _this.container.classList.toggle('ql-expanded');
		    });
		    this.select.addEventListener('change', this.update.bind(this));
		  }
	
		  _createClass(Picker, [{
		    key: 'buildItem',
		    value: function buildItem(option) {
		      var _this2 = this;
	
		      var item = document.createElement('span');
		      item.classList.add('ql-picker-item');
		      if (option.hasAttribute('value')) {
		        item.setAttribute('data-value', option.getAttribute('value'));
		      }
		      if (option.textContent) {
		        item.setAttribute('data-label', option.textContent);
		      }
		      item.addEventListener('click', function (event) {
		        _this2.selectItem(item, true);
		      });
		      return item;
		    }
		  }, {
		    key: 'buildLabel',
		    value: function buildLabel() {
		      var label = document.createElement('span');
		      label.classList.add('ql-picker-label');
		      label.innerHTML = _dropdown2.default;
		      this.container.appendChild(label);
		      return label;
		    }
		  }, {
		    key: 'buildOptions',
		    value: function buildOptions() {
		      var _this3 = this;
	
		      var options = document.createElement('span');
		      options.classList.add('ql-picker-options');
		      [].slice.call(this.select.options).forEach(function (option) {
		        var item = _this3.buildItem(option);
		        options.appendChild(item);
		        if (option.hasAttribute('selected')) {
		          _this3.selectItem(item);
		        }
		      });
		      this.container.appendChild(options);
		    }
		  }, {
		    key: 'buildPicker',
		    value: function buildPicker() {
		      var _this4 = this;
	
		      [].slice.call(this.select.attributes).forEach(function (item) {
		        _this4.container.setAttribute(item.name, item.value);
		      });
		      this.container.classList.add('ql-picker');
		      this.label = this.buildLabel();
		      this.buildOptions();
		    }
		  }, {
		    key: 'close',
		    value: function close() {
		      this.container.classList.remove('ql-expanded');
		    }
		  }, {
		    key: 'selectItem',
		    value: function selectItem(item) {
		      var trigger = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
		      var selected = this.container.querySelector('.ql-selected');
		      if (item === selected) return;
		      if (selected != null) {
		        selected.classList.remove('ql-selected');
		      }
		      if (item != null) {
		        item.classList.add('ql-selected');
		        this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
		        if (item.hasAttribute('data-value')) {
		          this.label.setAttribute('data-value', item.getAttribute('data-value'));
		        } else {
		          this.label.removeAttribute('data-value');
		        }
		        if (item.hasAttribute('data-label')) {
		          this.label.setAttribute('data-label', item.getAttribute('data-label'));
		        } else {
		          this.label.removeAttribute('data-label');
		        }
		        if (trigger) {
		          if (typeof Event === 'function') {
		            this.select.dispatchEvent(new Event('change'));
		          } else if ((typeof Event === 'undefined' ? 'undefined' : _typeof(Event)) === 'object') {
		            // IE11
		            var event = document.createEvent('Event');
		            event.initEvent('change', true, true);
		            this.select.dispatchEvent(event);
		          }
		          this.close();
		        }
		      } else {
		        this.label.removeAttribute('data-value');
		        this.label.removeAttribute('data-label');
		      }
		    }
		  }, {
		    key: 'update',
		    value: function update() {
		      var option = void 0;
		      if (this.select.selectedIndex > -1) {
		        var item = this.container.querySelector('.ql-picker-options').children[this.select.selectedIndex];
		        option = this.select.options[this.select.selectedIndex];
		        this.selectItem(item);
		      } else {
		        this.selectItem(null);
		      }
		      var isActive = option != null && option !== this.select.querySelector('option[selected]');
		      this.label.classList.toggle('ql-active', isActive);
		    }
		  }]);
	
		  return Picker;
		}();
	
		exports.default = Picker;
	
	/***/ },
	/* 102 */
	/***/ function(module, exports) {
	
		module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=ql-stroke points=\"7 11 9 13 11 11 7 11\"></polygon> <polygon class=ql-stroke points=\"7 7 9 5 11 7 7 7\"></polygon> </svg>";
	
	/***/ },
	/* 103 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _picker = __webpack_require__(101);
	
		var _picker2 = _interopRequireDefault(_picker);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var ColorPicker = function (_Picker) {
		  _inherits(ColorPicker, _Picker);
	
		  function ColorPicker(select, label) {
		    _classCallCheck(this, ColorPicker);
	
		    var _this = _possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this, select));
	
		    _this.label.innerHTML = label;
		    _this.container.classList.add('ql-color-picker');
		    [].slice.call(_this.container.querySelectorAll('.ql-picker-item'), 0, 7).forEach(function (item) {
		      item.classList.add('ql-primary');
		    });
		    return _this;
		  }
	
		  _createClass(ColorPicker, [{
		    key: 'buildItem',
		    value: function buildItem(option) {
		      var item = _get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'buildItem', this).call(this, option);
		      item.style.backgroundColor = option.getAttribute('value') || '';
		      return item;
		    }
		  }, {
		    key: 'selectItem',
		    value: function selectItem(item, trigger) {
		      _get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'selectItem', this).call(this, item, trigger);
		      var colorLabel = this.label.querySelector('.ql-color-label');
		      var value = item ? item.getAttribute('data-value') || '' : '';
		      if (colorLabel) {
		        if (colorLabel.tagName === 'line') {
		          colorLabel.style.stroke = value;
		        } else {
		          colorLabel.style.fill = value;
		        }
		      }
		    }
		  }]);
	
		  return ColorPicker;
		}(_picker2.default);
	
		exports.default = ColorPicker;
	
	/***/ },
	/* 104 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _picker = __webpack_require__(101);
	
		var _picker2 = _interopRequireDefault(_picker);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var IconPicker = function (_Picker) {
		  _inherits(IconPicker, _Picker);
	
		  function IconPicker(select, icons) {
		    _classCallCheck(this, IconPicker);
	
		    var _this = _possibleConstructorReturn(this, (IconPicker.__proto__ || Object.getPrototypeOf(IconPicker)).call(this, select));
	
		    _this.container.classList.add('ql-icon-picker');
		    [].forEach.call(_this.container.querySelectorAll('.ql-picker-item'), function (item) {
		      item.innerHTML = icons[item.getAttribute('data-value') || ''];
		    });
		    _this.defaultItem = _this.container.querySelector('.ql-selected');
		    _this.selectItem(_this.defaultItem);
		    return _this;
		  }
	
		  _createClass(IconPicker, [{
		    key: 'selectItem',
		    value: function selectItem(item, trigger) {
		      _get(IconPicker.prototype.__proto__ || Object.getPrototypeOf(IconPicker.prototype), 'selectItem', this).call(this, item, trigger);
		      item = item || this.defaultItem;
		      this.label.innerHTML = item.innerHTML;
		    }
		  }]);
	
		  return IconPicker;
		}(_picker2.default);
	
		exports.default = IconPicker;
	
	/***/ },
	/* 105 */
	/***/ function(module, exports) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		var Tooltip = function () {
		  function Tooltip(quill, boundsContainer) {
		    var _this = this;
	
		    _classCallCheck(this, Tooltip);
	
		    this.quill = quill;
		    this.boundsContainer = boundsContainer;
		    this.root = quill.addContainer('ql-tooltip');
		    this.root.innerHTML = this.constructor.TEMPLATE;
		    var offset = parseInt(window.getComputedStyle(this.root).marginTop);
		    this.quill.root.addEventListener('scroll', function () {
		      _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + offset + 'px';
		      _this.checkBounds();
		    });
		    this.hide();
		  }
	
		  _createClass(Tooltip, [{
		    key: 'checkBounds',
		    value: function checkBounds() {
		      this.root.classList.toggle('ql-out-top', this.root.offsetTop <= 0);
		      this.root.classList.remove('ql-out-bottom');
		      this.root.classList.toggle('ql-out-bottom', this.root.offsetTop + this.root.offsetHeight >= this.quill.root.offsetHeight);
		    }
		  }, {
		    key: 'hide',
		    value: function hide() {
		      this.root.classList.add('ql-hidden');
		    }
		  }, {
		    key: 'position',
		    value: function position(reference) {
		      var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
		      var top = reference.bottom + this.quill.root.scrollTop;
		      this.root.style.left = left + 'px';
		      this.root.style.top = top + 'px';
		      var containerBounds = this.boundsContainer.getBoundingClientRect();
		      var rootBounds = this.root.getBoundingClientRect();
		      var shift = 0;
		      if (rootBounds.right > containerBounds.right) {
		        shift = containerBounds.right - rootBounds.right;
		        this.root.style.left = left + shift + 'px';
		      }
		      if (rootBounds.left < containerBounds.left) {
		        shift = containerBounds.left - rootBounds.left;
		        this.root.style.left = left + shift + 'px';
		      }
		      this.checkBounds();
		      return shift;
		    }
		  }, {
		    key: 'show',
		    value: function show() {
		      this.root.classList.remove('ql-editing');
		      this.root.classList.remove('ql-hidden');
		    }
		  }]);
	
		  return Tooltip;
		}();
	
		exports.default = Tooltip;
	
	/***/ },
	/* 106 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		var _keyboard = __webpack_require__(53);
	
		var _keyboard2 = _interopRequireDefault(_keyboard);
	
		var _base = __webpack_require__(107);
	
		var _base2 = _interopRequireDefault(_base);
	
		var _icons = __webpack_require__(69);
	
		var _icons2 = _interopRequireDefault(_icons);
	
		var _selection = __webpack_require__(41);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var TOOLBAR_CONFIG = [['bold', 'italic', 'link'], [{ header: 1 }, { header: 2 }, 'blockquote']];
	
		var BubbleTheme = function (_BaseTheme) {
		  _inherits(BubbleTheme, _BaseTheme);
	
		  function BubbleTheme(quill, options) {
		    _classCallCheck(this, BubbleTheme);
	
		    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
		      options.modules.toolbar.container = TOOLBAR_CONFIG;
		    }
	
		    var _this = _possibleConstructorReturn(this, (BubbleTheme.__proto__ || Object.getPrototypeOf(BubbleTheme)).call(this, quill, options));
	
		    _this.quill.container.classList.add('ql-bubble');
		    return _this;
		  }
	
		  _createClass(BubbleTheme, [{
		    key: 'extendToolbar',
		    value: function extendToolbar(toolbar) {
		      this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
		      this.tooltip.root.appendChild(toolbar.container);
		      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
		      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
		    }
		  }]);
	
		  return BubbleTheme;
		}(_base2.default);
	
		BubbleTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base.BaseTooltip.DEFAULTS, {
		  modules: {
		    toolbar: {
		      handlers: {
		        link: function link(value) {
		          if (!value) {
		            this.quill.format('link', false);
		          } else {
		            this.quill.theme.tooltip.edit();
		          }
		        }
		      }
		    }
		  }
		});
	
		var BubbleTooltip = function (_BaseTooltip) {
		  _inherits(BubbleTooltip, _BaseTooltip);
	
		  function BubbleTooltip(quill, bounds) {
		    _classCallCheck(this, BubbleTooltip);
	
		    var _this2 = _possibleConstructorReturn(this, (BubbleTooltip.__proto__ || Object.getPrototypeOf(BubbleTooltip)).call(this, quill, bounds));
	
		    _this2.quill.on(_emitter2.default.events.EDITOR_CHANGE, function (type, range) {
		      if (type !== _emitter2.default.events.SELECTION_CHANGE) return;
		      if (range != null && range.length > 0) {
		        _this2.show();
		        // Lock our width so we will expand beyond our offsetParent boundaries
		        _this2.root.style.left = '0px';
		        _this2.root.style.width = '';
		        _this2.root.style.width = _this2.root.offsetWidth + 'px';
		        var lines = _this2.quill.scroll.lines(range.index, range.length);
		        if (lines.length === 1) {
		          _this2.position(_this2.quill.getBounds(range));
		        } else {
		          var lastLine = lines[lines.length - 1];
		          var index = lastLine.offset(_this2.quill.scroll);
		          var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
		          var _bounds = _this2.quill.getBounds(new _selection.Range(index, length));
		          _this2.position(_bounds);
		        }
		      } else if (document.activeElement !== _this2.textbox && _this2.quill.hasFocus()) {
		        _this2.hide();
		      }
		    });
		    return _this2;
		  }
	
		  _createClass(BubbleTooltip, [{
		    key: 'listen',
		    value: function listen() {
		      var _this3 = this;
	
		      _get(BubbleTooltip.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip.prototype), 'listen', this).call(this);
		      this.root.querySelector('.ql-close').addEventListener('click', function (event) {
		        _this3.root.classList.remove('ql-editing');
		      });
		      this.quill.on(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
		        // Let selection be restored by toolbar handlers before repositioning
		        setTimeout(function () {
		          if (_this3.root.classList.contains('ql-hidden')) return;
		          var range = _this3.quill.getSelection();
		          if (range != null) {
		            _this3.position(_this3.quill.getBounds(range));
		          }
		        }, 1);
		      });
		    }
		  }, {
		    key: 'cancel',
		    value: function cancel() {
		      this.show();
		    }
		  }, {
		    key: 'position',
		    value: function position(reference) {
		      var shift = _get(BubbleTooltip.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip.prototype), 'position', this).call(this, reference);
		      if (shift === 0) return shift;
		      var arrow = this.root.querySelector('.ql-tooltip-arrow');
		      arrow.style.marginLeft = '';
		      arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + 'px';
		    }
		  }]);
	
		  return BubbleTooltip;
		}(_base.BaseTooltip);
	
		BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', '</div>'].join('');
	
		exports.default = BubbleTheme;
	
	/***/ },
	/* 107 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = exports.BaseTooltip = undefined;
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _delta = __webpack_require__(21);
	
		var _delta2 = _interopRequireDefault(_delta);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		var _keyboard = __webpack_require__(53);
	
		var _keyboard2 = _interopRequireDefault(_keyboard);
	
		var _theme = __webpack_require__(42);
	
		var _theme2 = _interopRequireDefault(_theme);
	
		var _colorPicker = __webpack_require__(103);
	
		var _colorPicker2 = _interopRequireDefault(_colorPicker);
	
		var _iconPicker = __webpack_require__(104);
	
		var _iconPicker2 = _interopRequireDefault(_iconPicker);
	
		var _picker = __webpack_require__(101);
	
		var _picker2 = _interopRequireDefault(_picker);
	
		var _tooltip = __webpack_require__(105);
	
		var _tooltip2 = _interopRequireDefault(_tooltip);
	
		var _icons = __webpack_require__(69);
	
		var _icons2 = _interopRequireDefault(_icons);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var ALIGNS = [false, 'center', 'right', 'justify'];
	
		var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];
	
		var FONTS = [false, 'serif', 'monospace'];
	
		var HEADERS = ['1', '2', '3', false];
	
		var SIZES = ['small', false, 'large', 'huge'];
	
		var BaseTheme = function (_Theme) {
		  _inherits(BaseTheme, _Theme);
	
		  function BaseTheme(quill, options) {
		    _classCallCheck(this, BaseTheme);
	
		    var _this = _possibleConstructorReturn(this, (BaseTheme.__proto__ || Object.getPrototypeOf(BaseTheme)).call(this, quill, options));
	
		    var listener = function listener(e) {
		      if (!document.body.contains(quill.root)) {
		        return document.body.removeEventListener('click', listener);
		      }
		      if (_this.tooltip != null && !_this.tooltip.root.contains(e.target) && document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
		        _this.tooltip.hide();
		      }
		      if (_this.pickers != null) {
		        _this.pickers.forEach(function (picker) {
		          if (!picker.container.contains(e.target)) {
		            picker.close();
		          }
		        });
		      }
		    };
		    document.body.addEventListener('click', listener);
		    return _this;
		  }
	
		  _createClass(BaseTheme, [{
		    key: 'addModule',
		    value: function addModule(name) {
		      var module = _get(BaseTheme.prototype.__proto__ || Object.getPrototypeOf(BaseTheme.prototype), 'addModule', this).call(this, name);
		      if (name === 'toolbar') {
		        this.extendToolbar(module);
		      }
		      return module;
		    }
		  }, {
		    key: 'buildButtons',
		    value: function buildButtons(buttons) {
		      buttons.forEach(function (button) {
		        var className = button.getAttribute('class') || '';
		        className.split(/\s+/).forEach(function (name) {
		          if (!name.startsWith('ql-')) return;
		          name = name.slice('ql-'.length);
		          if (_icons2.default[name] == null) return;
		          if (name === 'direction') {
		            button.innerHTML = _icons2.default[name][''] + _icons2.default[name]['rtl'];
		          } else if (typeof _icons2.default[name] === 'string') {
		            button.innerHTML = _icons2.default[name];
		          } else {
		            var value = button.value || '';
		            if (value != null && _icons2.default[name][value]) {
		              button.innerHTML = _icons2.default[name][value];
		            }
		          }
		        });
		      });
		    }
		  }, {
		    key: 'buildPickers',
		    value: function buildPickers(selects) {
		      var _this2 = this;
	
		      this.pickers = selects.map(function (select) {
		        if (select.classList.contains('ql-align')) {
		          if (select.querySelector('option') == null) {
		            fillSelect(select, ALIGNS);
		          }
		          return new _iconPicker2.default(select, _icons2.default.align);
		        } else if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
		          var format = select.classList.contains('ql-background') ? 'background' : 'color';
		          if (select.querySelector('option') == null) {
		            fillSelect(select, COLORS, format === 'background' ? '#ffffff' : '#000000');
		          }
		          return new _colorPicker2.default(select, _icons2.default[format]);
		        } else {
		          if (select.querySelector('option') == null) {
		            if (select.classList.contains('ql-font')) {
		              fillSelect(select, FONTS);
		            } else if (select.classList.contains('ql-header')) {
		              fillSelect(select, HEADERS);
		            } else if (select.classList.contains('ql-size')) {
		              fillSelect(select, SIZES);
		            }
		          }
		          return new _picker2.default(select);
		        }
		      });
		      var update = function update() {
		        _this2.pickers.forEach(function (picker) {
		          picker.update();
		        });
		      };
		      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, update).on(_emitter2.default.events.SCROLL_OPTIMIZE, update);
		    }
		  }]);
	
		  return BaseTheme;
		}(_theme2.default);
	
		BaseTheme.DEFAULTS = (0, _extend2.default)(true, {}, _theme2.default.DEFAULTS, {
		  modules: {
		    toolbar: {
		      handlers: {
		        formula: function formula(value) {
		          this.quill.theme.tooltip.edit('formula');
		        },
		        image: function image(value) {
		          var _this3 = this;
	
		          var fileInput = this.container.querySelector('input.ql-image[type=file]');
		          if (fileInput == null) {
		            fileInput = document.createElement('input');
		            fileInput.setAttribute('type', 'file');
		            fileInput.setAttribute('accept', 'image/*');
		            fileInput.classList.add('ql-image');
		            fileInput.addEventListener('change', function () {
		              if (fileInput.files != null && fileInput.files[0] != null) {
		                var reader = new FileReader();
		                reader.onload = function (e) {
		                  var range = _this3.quill.getSelection(true);
		                  _this3.quill.updateContents(new _delta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
		                  fileInput.value = "";
		                };
		                reader.readAsDataURL(fileInput.files[0]);
		              }
		            });
		            this.container.appendChild(fileInput);
		          }
		          fileInput.click();
		        },
		        video: function video(value) {
		          this.quill.theme.tooltip.edit('video');
		        }
		      }
		    }
		  }
		});
	
		var BaseTooltip = function (_Tooltip) {
		  _inherits(BaseTooltip, _Tooltip);
	
		  function BaseTooltip(quill, boundsContainer) {
		    _classCallCheck(this, BaseTooltip);
	
		    var _this4 = _possibleConstructorReturn(this, (BaseTooltip.__proto__ || Object.getPrototypeOf(BaseTooltip)).call(this, quill, boundsContainer));
	
		    _this4.textbox = _this4.root.querySelector('input[type="text"]');
		    _this4.listen();
		    return _this4;
		  }
	
		  _createClass(BaseTooltip, [{
		    key: 'listen',
		    value: function listen() {
		      var _this5 = this;
	
		      this.textbox.addEventListener('keydown', function (event) {
		        if (_keyboard2.default.match(event, 'enter')) {
		          _this5.save();
		          event.preventDefault();
		        } else if (_keyboard2.default.match(event, 'escape')) {
		          _this5.cancel();
		          event.preventDefault();
		        }
		      });
		    }
		  }, {
		    key: 'cancel',
		    value: function cancel() {
		      this.hide();
		    }
		  }, {
		    key: 'edit',
		    value: function edit() {
		      var mode = arguments.length <= 0 || arguments[0] === undefined ? 'link' : arguments[0];
		      var preview = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
		      this.root.classList.remove('ql-hidden');
		      this.root.classList.add('ql-editing');
		      if (preview != null) {
		        this.textbox.value = preview;
		      } else if (mode !== this.root.getAttribute('data-mode')) {
		        this.textbox.value = '';
		      }
		      this.position(this.quill.getBounds(this.quill.selection.savedRange));
		      this.textbox.select();
		      this.textbox.setAttribute('placeholder', this.textbox.getAttribute('data-' + mode) || '');
		      this.root.setAttribute('data-mode', mode);
		    }
		  }, {
		    key: 'restoreFocus',
		    value: function restoreFocus() {
		      var scrollTop = this.quill.root.scrollTop;
		      this.quill.focus();
		      this.quill.root.scrollTop = scrollTop;
		    }
		  }, {
		    key: 'save',
		    value: function save() {
		      var value = this.textbox.value;
		      switch (this.root.getAttribute('data-mode')) {
		        case 'link':
		          var scrollTop = this.quill.root.scrollTop;
		          if (this.linkRange) {
		            this.quill.formatText(this.linkRange, 'link', value, _emitter2.default.sources.USER);
		            delete this.linkRange;
		          } else {
		            this.restoreFocus();
		            this.quill.format('link', value, _emitter2.default.sources.USER);
		          }
		          this.quill.root.scrollTop = scrollTop;
		          break;
		        case 'video':
		          var match = value.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || value.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
		          if (match) {
		            value = match[1] + '://www.youtube.com/embed/' + match[3] + '?showinfo=0';
		          } else if (match = value.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/)) {
		            value = match[1] + '://player.vimeo.com/video/' + match[3] + '/';
		          }
		        // fallthrough
		        case 'formula':
		          var range = this.quill.getSelection(true);
		          var index = range.index + range.length;
		          if (range != null) {
		            this.quill.insertEmbed(index, this.root.getAttribute('data-mode'), value, _emitter2.default.sources.USER);
		            if (this.root.getAttribute('data-mode') === 'formula') {
		              this.quill.insertText(index + 1, ' ', _emitter2.default.sources.USER);
		            }
		            this.quill.setSelection(index + 2, _emitter2.default.sources.USER);
		          }
		          break;
		        default:
		      }
		      this.textbox.value = '';
		      this.hide();
		    }
		  }]);
	
		  return BaseTooltip;
		}(_tooltip2.default);
	
		function fillSelect(select, values) {
		  var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
		  values.forEach(function (value) {
		    var option = document.createElement('option');
		    if (value === defaultValue) {
		      option.setAttribute('selected', 'selected');
		    } else {
		      option.setAttribute('value', value);
		    }
		    select.appendChild(option);
		  });
		}
	
		exports.BaseTooltip = BaseTooltip;
		exports.default = BaseTheme;
	
	/***/ },
	/* 108 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
	
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
	
		var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
		var _extend = __webpack_require__(26);
	
		var _extend2 = _interopRequireDefault(_extend);
	
		var _emitter = __webpack_require__(29);
	
		var _emitter2 = _interopRequireDefault(_emitter);
	
		var _base = __webpack_require__(107);
	
		var _base2 = _interopRequireDefault(_base);
	
		var _link = __webpack_require__(60);
	
		var _link2 = _interopRequireDefault(_link);
	
		var _picker = __webpack_require__(101);
	
		var _picker2 = _interopRequireDefault(_picker);
	
		var _selection = __webpack_require__(41);
	
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
		var TOOLBAR_CONFIG = [[{ header: ['1', '2', '3', false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']];
	
		var SnowTheme = function (_BaseTheme) {
		  _inherits(SnowTheme, _BaseTheme);
	
		  function SnowTheme(quill, options) {
		    _classCallCheck(this, SnowTheme);
	
		    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
		      options.modules.toolbar.container = TOOLBAR_CONFIG;
		    }
	
		    var _this = _possibleConstructorReturn(this, (SnowTheme.__proto__ || Object.getPrototypeOf(SnowTheme)).call(this, quill, options));
	
		    _this.quill.container.classList.add('ql-snow');
		    return _this;
		  }
	
		  _createClass(SnowTheme, [{
		    key: 'extendToolbar',
		    value: function extendToolbar(toolbar) {
		      toolbar.container.classList.add('ql-snow');
		      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
		      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
		      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
		      if (toolbar.container.querySelector('.ql-link')) {
		        this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function (range, context) {
		          toolbar.handlers['link'].call(toolbar, !context.format.link);
		        });
		      }
		    }
		  }]);
	
		  return SnowTheme;
		}(_base2.default);
	
		SnowTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
		  modules: {
		    toolbar: {
		      handlers: {
		        link: function link(value) {
		          if (value) {
		            var range = this.quill.getSelection();
		            if (range == null || range.length == 0) return;
		            var preview = this.quill.getText(range);
		            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
		              preview = 'mailto:' + preview;
		            }
		            var tooltip = this.quill.theme.tooltip;
		            tooltip.edit('link', preview);
		          } else {
		            this.quill.format('link', false);
		          }
		        }
		      }
		    }
		  }
		});
	
		var SnowTooltip = function (_BaseTooltip) {
		  _inherits(SnowTooltip, _BaseTooltip);
	
		  function SnowTooltip(quill, bounds) {
		    _classCallCheck(this, SnowTooltip);
	
		    var _this2 = _possibleConstructorReturn(this, (SnowTooltip.__proto__ || Object.getPrototypeOf(SnowTooltip)).call(this, quill, bounds));
	
		    _this2.preview = _this2.root.querySelector('a.ql-preview');
		    return _this2;
		  }
	
		  _createClass(SnowTooltip, [{
		    key: 'listen',
		    value: function listen() {
		      var _this3 = this;
	
		      _get(SnowTooltip.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip.prototype), 'listen', this).call(this);
		      this.root.querySelector('a.ql-action').addEventListener('click', function (event) {
		        if (_this3.root.classList.contains('ql-editing')) {
		          _this3.save();
		        } else {
		          _this3.edit('link', _this3.preview.textContent);
		        }
		        event.preventDefault();
		      });
		      this.root.querySelector('a.ql-remove').addEventListener('click', function (event) {
		        if (_this3.linkRange != null) {
		          _this3.restoreFocus();
		          _this3.quill.formatText(_this3.linkRange, 'link', false, _emitter2.default.sources.USER);
		          delete _this3.linkRange;
		        }
		        event.preventDefault();
		        _this3.hide();
		      });
		      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, function (range) {
		        if (range == null) return;
		        if (range.length === 0) {
		          var _quill$scroll$descend = _this3.quill.scroll.descendant(_link2.default, range.index);
	
		          var _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2);
	
		          var link = _quill$scroll$descend2[0];
		          var offset = _quill$scroll$descend2[1];
	
		          if (link != null) {
		            _this3.linkRange = new _selection.Range(range.index - offset, link.length());
		            var preview = _link2.default.formats(link.domNode);
		            _this3.preview.textContent = preview;
		            _this3.preview.setAttribute('href', preview);
		            _this3.show();
		            _this3.position(_this3.quill.getBounds(_this3.linkRange));
		            return;
		          }
		        }
		        _this3.hide();
		      });
		    }
		  }, {
		    key: 'show',
		    value: function show() {
		      _get(SnowTooltip.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip.prototype), 'show', this).call(this);
		      this.root.removeAttribute('data-mode');
		    }
		  }]);
	
		  return SnowTooltip;
		}(_base.BaseTooltip);
	
		SnowTooltip.TEMPLATE = ['<a class="ql-preview" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join('');
	
		exports.default = SnowTheme;
	
	/***/ }
	/******/ ])
	});
	;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(5)
	var ieee754 = __webpack_require__(6)
	var isArray = __webpack_require__(7)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} [once=false] Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Hold the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var events = this._events
	    , names = []
	    , name;
	
	  if (!events) return names;
	
	  for (name in events) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }
	
	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }
	
	  return names;
	};
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];
	
	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];
	
	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return false;
	
	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return this;
	
	  var listeners = this._events[evt]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;
	
	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(10),
	    copyObject = __webpack_require__(24),
	    createAssigner = __webpack_require__(25),
	    isArrayLike = __webpack_require__(35),
	    isPrototype = __webpack_require__(38),
	    keys = __webpack_require__(39);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns own enumerable string keyed properties of source objects to the
	 * destination object. Source objects are applied from left to right.
	 * Subsequent sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object` and is loosely based on
	 * [`Object.assign`](https://mdn.io/Object/assign).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.10.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.assignIn
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * function Bar() {
	 *   this.c = 3;
	 * }
	 *
	 * Foo.prototype.b = 2;
	 * Bar.prototype.d = 4;
	 *
	 * _.assign({ 'a': 0 }, new Foo, new Bar);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var assign = createAssigner(function(object, source) {
	  if (isPrototype(source) || isArrayLike(source)) {
	    copyObject(source, keys(source), object);
	    return;
	  }
	  for (var key in source) {
	    if (hasOwnProperty.call(source, key)) {
	      assignValue(object, key, source[key]);
	    }
	  }
	});
	
	module.exports = assign;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(11),
	    eq = __webpack_require__(23);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignValue;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var defineProperty = __webpack_require__(12);
	
	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}
	
	module.exports = baseAssignValue;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(13);
	
	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());
	
	module.exports = defineProperty;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(14),
	    getValue = __webpack_require__(22);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(15),
	    isMasked = __webpack_require__(17),
	    isObject = __webpack_require__(16),
	    toSource = __webpack_require__(21);
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	module.exports = baseIsNative;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag || tag == proxyTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(18);
	
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());
	
	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}
	
	module.exports = isMasked;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(19);
	
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];
	
	module.exports = coreJsData;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(20);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	module.exports = toSource;


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}
	
	module.exports = getValue;


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(10),
	    baseAssignValue = __webpack_require__(11);
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	
	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;
	
	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}
	
	module.exports = copyObject;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(26),
	    isIterateeCall = __webpack_require__(34);
	
	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;
	
	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;
	
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(27),
	    overRest = __webpack_require__(28),
	    setToString = __webpack_require__(30);
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}
	
	module.exports = baseRest;


/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(29);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}
	
	module.exports = overRest;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	module.exports = apply;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var baseSetToString = __webpack_require__(31),
	    shortOut = __webpack_require__(33);
	
	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);
	
	module.exports = setToString;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(32),
	    defineProperty = __webpack_require__(12),
	    identity = __webpack_require__(27);
	
	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};
	
	module.exports = baseSetToString;


/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}
	
	module.exports = constant;


/***/ },
/* 33 */
/***/ function(module, exports) {

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 500,
	    HOT_SPAN = 16;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;
	
	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;
	
	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);
	
	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}
	
	module.exports = shortOut;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(23),
	    isArrayLike = __webpack_require__(35),
	    isIndex = __webpack_require__(37),
	    isObject = __webpack_require__(16);
	
	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(15),
	    isLength = __webpack_require__(36);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	module.exports = isArrayLike;


/***/ },
/* 36 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 37 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}
	
	module.exports = isIndex;


/***/ },
/* 38 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	module.exports = isPrototype;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(40),
	    baseKeys = __webpack_require__(46),
	    isArrayLike = __webpack_require__(35);
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	
	module.exports = keys;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(41),
	    isArguments = __webpack_require__(42),
	    isArray = __webpack_require__(45),
	    isIndex = __webpack_require__(37);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  // Safari 9 makes `arguments.length` enumerable in strict mode.
	  var result = (isArray(value) || isArguments(value))
	    ? baseTimes(value.length, String)
	    : [];
	
	  var length = result.length,
	      skipIndexes = !!length;
	
	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = arrayLikeKeys;


/***/ },
/* 41 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	module.exports = baseTimes;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLikeObject = __webpack_require__(43);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}
	
	module.exports = isArguments;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(35),
	    isObjectLike = __webpack_require__(44);
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	module.exports = isArrayLikeObject;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(38),
	    nativeKeys = __webpack_require__(47);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = baseKeys;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(48);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);
	
	module.exports = nativeKeys;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var englishDictionary = __webpack_require__(50);
	
	var dictionary = englishDictionary;
	
	var i18n = {
	    setLocale: function setLocale(locale) {
	        try {
	            dictionary = __webpack_require__(51)("./" + locale + ".json");
	        } catch (e) {
	            dictionary = englishDictionary;
	        }
	    },
	    localize: function localize(key) {
	        if (key in dictionary) {
	            return dictionary[key];
	        }
	        if (key in englishDictionary) {
	            return englishDictionary[key];
	        }
	        throw new Error("No localization found for " + key);
	    }
	};
	
	module.exports = i18n;

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Bold",
		"italic": "Italic",
		"underline": "Underline",
		"strikethrough": "Strikethrough",
		"fontColor": "Font Color",
		"highlightColor": "Highlight Color",
		"quote": "Quote",
		"codeblock": "Code Block",
		"link": "Link",
		"image": "Image",
		"numberedList": "Numbered List",
		"bulletedList": "Bulleted List",
		"alignment": "Alignment",
		"clearFormatting": "Clear Formatting"
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./de.json": 52,
		"./en-us.json": 50,
		"./es.json": 53,
		"./fr.json": 54,
		"./it.json": 55,
		"./ja.json": 56,
		"./ko.json": 57,
		"./nl.json": 58,
		"./no.json": 59,
		"./pl.json": 60,
		"./pt-BR.json": 61,
		"./sv.json": 62,
		"./th.json": 63,
		"./tr.json": 64,
		"./zh-CN.json": 65
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 51;


/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Fett",
		"italic": "Kursiv",
		"underline": "Unterstrichen",
		"strikethrough": "Durchgestrichen",
		"fontColor": "Schriftfarbe",
		"highlightColor": "Hervorhebungsfarbe",
		"quote": "Anführungszeichen",
		"codeblock": "Codeblock",
		"link": "Link",
		"numberedList": "Nummerierte Liste",
		"bulletedList": "Aufzählung",
		"alignment": "Ausrichtung",
		"clearFormatting": "Formatierung löschen"
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Negrita",
		"italic": "Cursiva",
		"underline": "Subrayado",
		"strikethrough": "Tachado",
		"fontColor": "Color de fuente",
		"highlightColor": "Color de resaltado",
		"quote": "Comillas",
		"codeblock": "Bloqueo de código",
		"link": "Vínculo",
		"numberedList": "Lista numerada",
		"bulletedList": "Lista con viñetas",
		"alignment": "Alineación",
		"clearFormatting": "Eliminar formato"
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Gras",
		"italic": "Italique",
		"underline": "Souligné",
		"strikethrough": "Barré",
		"fontColor": "Couleur de police",
		"highlightColor": "Couleur de surlignage",
		"quote": "Guillemet",
		"codeblock": "Bloc de code",
		"link": "Lien",
		"numberedList": "Liste numérotée",
		"bulletedList": "Liste à puces",
		"alignment": "Alignement",
		"clearFormatting": "Effacer la mise en forme"
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Grassetto",
		"italic": "Corsivo",
		"underline": "Sottolineato",
		"strikethrough": "Barrato",
		"fontColor": "Colore carattere",
		"highlightColor": "Colore evidenziatore",
		"quote": "Offerta",
		"codeblock": "Blocco codice",
		"link": "Collegamento",
		"numberedList": "Elenco numerato",
		"bulletedList": "Elenco puntato",
		"alignment": "Allineamento",
		"clearFormatting": "Cancella formattazione"
	};

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "太字",
		"italic": "斜体",
		"underline": "下線",
		"strikethrough": "取り消し線",
		"fontColor": "フォントの色",
		"highlightColor": "ハイライト カラー",
		"quote": "見積もり",
		"codeblock": "コード ブロック",
		"link": "リンク",
		"numberedList": "番号付きリスト",
		"bulletedList": "箇条書き",
		"alignment": "配置",
		"clearFormatting": "書式のクリア"
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "굵게",
		"italic": "기울임꼴",
		"underline": "밑줄",
		"strikethrough": "취소선",
		"fontColor": "글꼴 색",
		"highlightColor": "강조 색",
		"quote": "견적",
		"codeblock": "코드 블록",
		"link": "링크",
		"numberedList": "숫자 목록",
		"bulletedList": "기호 목록",
		"alignment": "맞춤",
		"clearFormatting": "형식 초기화"
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Vet",
		"italic": "Cursief",
		"underline": "Onderstrepen",
		"strikethrough": "Doorhalen",
		"fontColor": "Tekstkleur",
		"highlightColor": "Markeringskleur",
		"quote": "Citaat",
		"codeblock": "Codeblok",
		"link": "Koppeling",
		"numberedList": "Genummerde lijst",
		"bulletedList": "Lijst met opsommingstekens",
		"alignment": "Uitlijning",
		"clearFormatting": "Opmaak wissen"
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Fet",
		"italic": "Kursiv",
		"underline": "Understreking",
		"strikethrough": "Gjennomstreking",
		"fontColor": "Tekstfarge",
		"highlightColor": "Uthevingsfarge",
		"quote": "Sitat",
		"codeblock": "Kodeblokk",
		"link": "Kobling",
		"numberedList": "Nummerliste",
		"bulletedList": "Punktliste",
		"alignment": "Justering",
		"clearFormatting": "Fjern formatering"
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Pogrubienie",
		"italic": "Kursywa",
		"underline": "Podkreślenie",
		"strikethrough": "Przekreślenie",
		"fontColor": "Kolor czcionki",
		"highlightColor": "Kolor wyróżnienia",
		"quote": "Cytat",
		"codeblock": "Blok kodu",
		"link": "Łącze",
		"numberedList": "Lista numerowana",
		"bulletedList": "Lista punktowana",
		"alignment": "Wyrównanie",
		"clearFormatting": "Wyczyść formatowanie"
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Negrito",
		"italic": "Itálico",
		"underline": "Sublinhado",
		"strikethrough": "Tachado",
		"fontColor": "Cor da fonte",
		"highlightColor": "Cor de realce",
		"quote": "Citação",
		"codeblock": "Bloco de código",
		"link": "Link",
		"numberedList": "Lista numerada",
		"bulletedList": "Lista com marcadores",
		"alignment": "Alinhamento",
		"clearFormatting": "Limpar formatação"
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Fetstil",
		"italic": "Kursiv",
		"underline": "Understruken",
		"strikethrough": "Genomstruken",
		"fontColor": "Teckenfärg",
		"highlightColor": "Markeringsfärg",
		"quote": "Kvot",
		"codeblock": "Kodblock",
		"link": "Länk",
		"numberedList": "Numrerad lista",
		"bulletedList": "Punktlista",
		"alignment": "Justering",
		"clearFormatting": "Rensa formatering"
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "หนา",
		"italic": "เอียง",
		"underline": "ขีดเส้นใต้",
		"strikethrough": "ขีดทับ",
		"fontColor": "สีตัวอักษร",
		"highlightColor": "สีเน้น",
		"quote": "การอ้างอิง",
		"codeblock": "โค้ดบล็อก",
		"link": "ลิงค์",
		"numberedList": "รายการลำดับเลข",
		"bulletedList": "รายการสัญลักษณ์แสดงหัวข้อย่อย",
		"alignment": "การจัดแนว",
		"clearFormatting": "ล้างรูปแบบ"
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "Kalın",
		"italic": "İtalik",
		"underline": "Altı Çizili",
		"strikethrough": "Üstü Çizili",
		"fontColor": "Yazı Tipi Rengi",
		"highlightColor": "Vurgu Rengi",
		"quote": "Teklif",
		"codeblock": "Kod Bloğu",
		"link": "Bağlantı",
		"numberedList": "Numaralı Liste",
		"bulletedList": "Madde İmli Liste",
		"alignment": "Hizalama",
		"clearFormatting": "Biçimlendirmeyi Temizle"
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = {
		"bold": "粗体",
		"italic": "斜体",
		"underline": "下划线",
		"strikethrough": "删除线",
		"fontColor": "字体颜色",
		"highlightColor": "高亮颜色",
		"quote": "引用",
		"codeblock": "代码块",
		"link": "链接",
		"numberedList": "已编号列表",
		"bulletedList": "符号列表",
		"alignment": "对齐方式​​",
		"clearFormatting": "清除格式"
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(67);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	    var alias1=this.escapeExpression;
	
	  return "<span class=\"ql-formats\">\n  <button class=\"ql-bold\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"bold",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-italic\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"italic",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-underline\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"underline",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-strike\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"strikethrough",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n</span>\n<span class=\"ql-formats\">\n  <select class=\"ql-color\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"fontColor",{"name":"tooltip","hash":{},"data":data}))
	    + "></select>\n  <select class=\"ql-background\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"highlightColor",{"name":"tooltip","hash":{},"data":data}))
	    + "></select>\n</span>\n<span class=\"ql-formats\">\n  <button class=\"ql-blockquote\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"quote",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-code-block\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"codeblock",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-link\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"link",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-image\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"image",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n</span>\n<span class=\"ql-formats\">\n  <button class=\"ql-list\" value=\"ordered\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"numberedList",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n  <button class=\"ql-list\" value=\"bullet\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"bulletedList",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n</span>\n<span class=\"ql-formats\">\n  <select class=\"ql-align\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"alignment",{"name":"tooltip","hash":{},"data":data}))
	    + "></select>\n</span>\n<span class=\"ql-formats\">\n  <button class=\"ql-clean\" "
	    + alias1(__default(__webpack_require__(75)).call(depth0,"clearFormatting",{"name":"tooltip","hash":{},"data":data}))
	    + "></button>\n</span>\n\n";
	},"useData":true});

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(68)['default'];


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	
	var _import = __webpack_require__(69);
	
	var base = _interopRequireWildcard(_import);
	
	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)
	
	var _SafeString = __webpack_require__(72);
	
	var _SafeString2 = _interopRequireWildcard(_SafeString);
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	var _import2 = __webpack_require__(70);
	
	var Utils = _interopRequireWildcard(_import2);
	
	var _import3 = __webpack_require__(73);
	
	var runtime = _interopRequireWildcard(_import3);
	
	var _noConflict = __webpack_require__(74);
	
	var _noConflict2 = _interopRequireWildcard(_noConflict);
	
	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();
	
	  Utils.extend(hb, base);
	  hb.SafeString = _SafeString2['default'];
	  hb.Exception = _Exception2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;
	
	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };
	
	  return hb;
	}
	
	var inst = create();
	inst.create = create;
	
	_noConflict2['default'](inst);
	
	inst['default'] = inst;
	
	exports['default'] = inst;
	module.exports = exports['default'];

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;
	exports.createFrame = createFrame;
	
	var _import = __webpack_require__(70);
	
	var Utils = _interopRequireWildcard(_import);
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	var VERSION = '3.0.1';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 6;
	
	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1'
	};
	
	exports.REVISION_CHANGES = REVISION_CHANGES;
	var isArray = Utils.isArray,
	    isFunction = Utils.isFunction,
	    toString = Utils.toString,
	    objectType = '[object Object]';
	
	function HandlebarsEnvironment(helpers, partials) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	
	  registerDefaultHelpers(this);
	}
	
	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,
	
	  logger: logger,
	  log: log,
	
	  registerHelper: function registerHelper(name, fn) {
	    if (toString.call(name) === objectType) {
	      if (fn) {
	        throw new _Exception2['default']('Arg not supported with multiple helpers');
	      }
	      Utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },
	
	  registerPartial: function registerPartial(name, partial) {
	    if (toString.call(name) === objectType) {
	      Utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _Exception2['default']('Attempting to register a partial as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  }
	};
	
	function registerDefaultHelpers(instance) {
	  instance.registerHelper('helperMissing', function () {
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} constuct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _Exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });
	
	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;
	
	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }
	
	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = createFrame(options.data);
	        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }
	
	      return fn(context, options);
	    }
	  });
	
	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _Exception2['default']('Must pass iterator to #each');
	    }
	
	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;
	
	    if (options.data && options.ids) {
	      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }
	
	    if (isFunction(context)) {
	      context = context.call(this);
	    }
	
	    if (options.data) {
	      data = createFrame(options.data);
	    }
	
	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;
	
	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }
	
	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: Utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }
	
	    if (context && typeof context === 'object') {
	      if (isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          execIteration(i, i, i === context.length - 1);
	        }
	      } else {
	        var priorKey = undefined;
	
	        for (var key in context) {
	          if (context.hasOwnProperty(key)) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          }
	        }
	        if (priorKey) {
	          execIteration(priorKey, i - 1, true);
	        }
	      }
	    }
	
	    if (i === 0) {
	      ret = inverse(this);
	    }
	
	    return ret;
	  });
	
	  instance.registerHelper('if', function (conditional, options) {
	    if (isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }
	
	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || Utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });
	
	  instance.registerHelper('unless', function (conditional, options) {
	    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
	  });
	
	  instance.registerHelper('with', function (context, options) {
	    if (isFunction(context)) {
	      context = context.call(this);
	    }
	
	    var fn = options.fn;
	
	    if (!Utils.isEmpty(context)) {
	      if (options.data && options.ids) {
	        var data = createFrame(options.data);
	        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
	        options = { data: data };
	      }
	
	      return fn(context, options);
	    } else {
	      return options.inverse(this);
	    }
	  });
	
	  instance.registerHelper('log', function (message, options) {
	    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
	    instance.log(level, message);
	  });
	
	  instance.registerHelper('lookup', function (obj, field) {
	    return obj && obj[field];
	  });
	}
	
	var logger = {
	  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },
	
	  // State enum
	  DEBUG: 0,
	  INFO: 1,
	  WARN: 2,
	  ERROR: 3,
	  level: 1,
	
	  // Can be overridden in the host environment
	  log: function log(level, message) {
	    if (typeof console !== 'undefined' && logger.level <= level) {
	      var method = logger.methodMap[level];
	      (console[method] || console.log).call(console, message); // eslint-disable-line no-console
	    }
	  }
	};
	
	exports.logger = logger;
	var log = logger.log;
	
	exports.log = log;
	
	function createFrame(object) {
	  var frame = Utils.extend({}, object);
	  frame._parent = object;
	  return frame;
	}
	
	/* [args, ]options */

/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.extend = extend;
	
	// Older IE versions do not directly support indexOf so we must implement our own, sadly.
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  '\'': '&#x27;',
	  '`': '&#x60;'
	};
	
	var badChars = /[&<>"'`]/g,
	    possible = /[&<>"'`]/;
	
	function escapeChar(chr) {
	  return escape[chr];
	}
	
	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }
	
	  return obj;
	}
	
	var toString = Object.prototype.toString;
	
	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/*eslint-disable func-style, no-var */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	var isFunction;
	exports.isFunction = isFunction;
	/*eslint-enable func-style, no-var */
	
	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};exports.isArray = isArray;
	
	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}
	
	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }
	
	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }
	
	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}
	
	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}
	
	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}
	
	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}

/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];
	
	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      column = undefined;
	  if (loc) {
	    line = loc.start.line;
	    column = loc.start.column;
	
	    message += ' - ' + line + ':' + column;
	  }
	
	  var tmp = Error.prototype.constructor.call(this, message);
	
	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }
	
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }
	
	  if (loc) {
	    this.lineNumber = line;
	    this.column = column;
	  }
	}
	
	Exception.prototype = new Error();
	
	exports['default'] = Exception;
	module.exports = exports['default'];

/***/ },
/* 72 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	// Build out our basic SafeString type
	function SafeString(string) {
	  this.string = string;
	}
	
	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};
	
	exports['default'] = SafeString;
	module.exports = exports['default'];

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	exports.checkRevision = checkRevision;
	
	// TODO: Remove this line and break up compilePartial
	
	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;
	
	var _import = __webpack_require__(70);
	
	var Utils = _interopRequireWildcard(_import);
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	var _COMPILER_REVISION$REVISION_CHANGES$createFrame = __webpack_require__(69);
	
	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _COMPILER_REVISION$REVISION_CHANGES$createFrame.COMPILER_REVISION;
	
	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[currentRevision],
	          compilerVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[compilerRevision];
	      throw new _Exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new _Exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	    }
	  }
	}
	
	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _Exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _Exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }
	
	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);
	
	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	    }
	
	    partial = env.VM.resolvePartial.call(this, partial, context, options);
	    var result = env.VM.invokePartial.call(this, partial, context, options);
	
	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, options);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }
	
	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _Exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }
	
	  // Just add water
	  var container = {
	    strict: function strict(obj, name) {
	      if (!(name in obj)) {
	        throw new _Exception2['default']('"' + name + '" not defined in ' + obj);
	      }
	      return obj[name];
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },
	
	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,
	
	    fn: function fn(i) {
	      return templateSpec[i];
	    },
	
	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },
	
	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    merge: function merge(param, common) {
	      var obj = param || common;
	
	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }
	
	      return obj;
	    },
	
	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };
	
	  function ret(context) {
	    var options = arguments[1] === undefined ? {} : arguments[1];
	
	    var data = options.data;
	
	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      depths = options.depths ? [context].concat(options.depths) : [context];
	    }
	
	    return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
	  }
	  ret.isTop = true;
	
	  ret._setup = function (options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);
	
	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	    }
	  };
	
	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _Exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _Exception2['default']('must pass parent depths');
	    }
	
	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}
	
	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments[1] === undefined ? {} : arguments[1];
	
	    return fn.call(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), depths && [context].concat(depths));
	  }
	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}
	
	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    partial = options.partials[options.name];
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}
	
	function invokePartial(partial, context, options) {
	  options.partial = true;
	
	  if (partial === undefined) {
	    throw new _Exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}
	
	function noop() {
	  return '';
	}
	
	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _COMPILER_REVISION$REVISION_CHANGES$createFrame.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

/***/ },
/* 74 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	exports.__esModule = true;
	/*global window */
	
	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  var root = typeof global !== 'undefined' ? global : window,
	      $Handlebars = root.Handlebars;
	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (root.Handlebars === Handlebars) {
	      root.Handlebars = $Handlebars;
	    }
	  };
	};
	
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Handlebars = __webpack_require__(76);
	var i18n = __webpack_require__(49);
	module.exports = function (tooltipKey) {
	    var safeText = Handlebars.Utils.escapeExpression(i18n.localize(tooltipKey));
	    return new Handlebars.SafeString('data-toggle="tooltip" data-placement="top" data-tooltip-class="tt" title="' + safeText + '"');
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// USAGE:
	// var handlebars = require('handlebars');
	/* eslint-disable no-var */
	
	// var local = handlebars.create();
	
	var handlebars = __webpack_require__(77)['default'];
	
	var printer = __webpack_require__(87);
	handlebars.PrintVisitor = printer.PrintVisitor;
	handlebars.print = printer.print;
	
	module.exports = handlebars;
	
	// Publish a Node.js require() handler for .handlebars and .hbs files
	function extension(module, filename) {
	  var fs = __webpack_require__(88);
	  var templateString = fs.readFileSync(filename, 'utf8');
	  module.exports = handlebars.compile(templateString);
	}
	/* istanbul ignore else */
	if ("function" !== 'undefined' && (void 0)) {
	  (void 0)['.handlebars'] = extension;
	  (void 0)['.hbs'] = extension;
	}


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	
	var _runtime = __webpack_require__(68);
	
	var _runtime2 = _interopRequireWildcard(_runtime);
	
	// Compiler imports
	
	var _AST = __webpack_require__(78);
	
	var _AST2 = _interopRequireWildcard(_AST);
	
	var _Parser$parse = __webpack_require__(79);
	
	var _Compiler$compile$precompile = __webpack_require__(84);
	
	var _JavaScriptCompiler = __webpack_require__(85);
	
	var _JavaScriptCompiler2 = _interopRequireWildcard(_JavaScriptCompiler);
	
	var _Visitor = __webpack_require__(82);
	
	var _Visitor2 = _interopRequireWildcard(_Visitor);
	
	var _noConflict = __webpack_require__(74);
	
	var _noConflict2 = _interopRequireWildcard(_noConflict);
	
	var _create = _runtime2['default'].create;
	function create() {
	  var hb = _create();
	
	  hb.compile = function (input, options) {
	    return _Compiler$compile$precompile.compile(input, options, hb);
	  };
	  hb.precompile = function (input, options) {
	    return _Compiler$compile$precompile.precompile(input, options, hb);
	  };
	
	  hb.AST = _AST2['default'];
	  hb.Compiler = _Compiler$compile$precompile.Compiler;
	  hb.JavaScriptCompiler = _JavaScriptCompiler2['default'];
	  hb.Parser = _Parser$parse.parser;
	  hb.parse = _Parser$parse.parse;
	
	  return hb;
	}
	
	var inst = create();
	inst.create = create;
	
	_noConflict2['default'](inst);
	
	inst.Visitor = _Visitor2['default'];
	
	inst['default'] = inst;
	
	exports['default'] = inst;
	module.exports = exports['default'];

/***/ },
/* 78 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var AST = {
	  Program: function Program(statements, blockParams, strip, locInfo) {
	    this.loc = locInfo;
	    this.type = 'Program';
	    this.body = statements;
	
	    this.blockParams = blockParams;
	    this.strip = strip;
	  },
	
	  MustacheStatement: function MustacheStatement(path, params, hash, escaped, strip, locInfo) {
	    this.loc = locInfo;
	    this.type = 'MustacheStatement';
	
	    this.path = path;
	    this.params = params || [];
	    this.hash = hash;
	    this.escaped = escaped;
	
	    this.strip = strip;
	  },
	
	  BlockStatement: function BlockStatement(path, params, hash, program, inverse, openStrip, inverseStrip, closeStrip, locInfo) {
	    this.loc = locInfo;
	    this.type = 'BlockStatement';
	
	    this.path = path;
	    this.params = params || [];
	    this.hash = hash;
	    this.program = program;
	    this.inverse = inverse;
	
	    this.openStrip = openStrip;
	    this.inverseStrip = inverseStrip;
	    this.closeStrip = closeStrip;
	  },
	
	  PartialStatement: function PartialStatement(name, params, hash, strip, locInfo) {
	    this.loc = locInfo;
	    this.type = 'PartialStatement';
	
	    this.name = name;
	    this.params = params || [];
	    this.hash = hash;
	
	    this.indent = '';
	    this.strip = strip;
	  },
	
	  ContentStatement: function ContentStatement(string, locInfo) {
	    this.loc = locInfo;
	    this.type = 'ContentStatement';
	    this.original = this.value = string;
	  },
	
	  CommentStatement: function CommentStatement(comment, strip, locInfo) {
	    this.loc = locInfo;
	    this.type = 'CommentStatement';
	    this.value = comment;
	
	    this.strip = strip;
	  },
	
	  SubExpression: function SubExpression(path, params, hash, locInfo) {
	    this.loc = locInfo;
	
	    this.type = 'SubExpression';
	    this.path = path;
	    this.params = params || [];
	    this.hash = hash;
	  },
	
	  PathExpression: function PathExpression(data, depth, parts, original, locInfo) {
	    this.loc = locInfo;
	    this.type = 'PathExpression';
	
	    this.data = data;
	    this.original = original;
	    this.parts = parts;
	    this.depth = depth;
	  },
	
	  StringLiteral: function StringLiteral(string, locInfo) {
	    this.loc = locInfo;
	    this.type = 'StringLiteral';
	    this.original = this.value = string;
	  },
	
	  NumberLiteral: function NumberLiteral(number, locInfo) {
	    this.loc = locInfo;
	    this.type = 'NumberLiteral';
	    this.original = this.value = Number(number);
	  },
	
	  BooleanLiteral: function BooleanLiteral(bool, locInfo) {
	    this.loc = locInfo;
	    this.type = 'BooleanLiteral';
	    this.original = this.value = bool === 'true';
	  },
	
	  UndefinedLiteral: function UndefinedLiteral(locInfo) {
	    this.loc = locInfo;
	    this.type = 'UndefinedLiteral';
	    this.original = this.value = undefined;
	  },
	
	  NullLiteral: function NullLiteral(locInfo) {
	    this.loc = locInfo;
	    this.type = 'NullLiteral';
	    this.original = this.value = null;
	  },
	
	  Hash: function Hash(pairs, locInfo) {
	    this.loc = locInfo;
	    this.type = 'Hash';
	    this.pairs = pairs;
	  },
	  HashPair: function HashPair(key, value, locInfo) {
	    this.loc = locInfo;
	    this.type = 'HashPair';
	    this.key = key;
	    this.value = value;
	  },
	
	  // Public API used to evaluate derived attributes regarding AST nodes
	  helpers: {
	    // a mustache is definitely a helper if:
	    // * it is an eligible helper, and
	    // * it has at least one parameter or hash segment
	    helperExpression: function helperExpression(node) {
	      return !!(node.type === 'SubExpression' || node.params.length || node.hash);
	    },
	
	    scopedId: function scopedId(path) {
	      return /^\.|this\b/.test(path.original);
	    },
	
	    // an ID is simple if it only has one part, and that part is not
	    // `..` or `this`.
	    simpleId: function simpleId(path) {
	      return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
	    }
	  }
	};
	
	// Must be exported as an object rather than the root of the module as the jison lexer
	// must modify the object to operate properly.
	exports['default'] = AST;
	module.exports = exports['default'];

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	exports.parse = parse;
	
	var _parser = __webpack_require__(80);
	
	var _parser2 = _interopRequireWildcard(_parser);
	
	var _AST = __webpack_require__(78);
	
	var _AST2 = _interopRequireWildcard(_AST);
	
	var _WhitespaceControl = __webpack_require__(81);
	
	var _WhitespaceControl2 = _interopRequireWildcard(_WhitespaceControl);
	
	var _import = __webpack_require__(83);
	
	var Helpers = _interopRequireWildcard(_import);
	
	var _extend = __webpack_require__(70);
	
	exports.parser = _parser2['default'];
	
	var yy = {};
	_extend.extend(yy, Helpers, _AST2['default']);
	
	function parse(input, options) {
	  // Just return if an already-compiled AST was passed in.
	  if (input.type === 'Program') {
	    return input;
	  }
	
	  _parser2['default'].yy = yy;
	
	  // Altering the shared object here, but this is ok as parser is a sync operation
	  yy.locInfo = function (locInfo) {
	    return new yy.SourceLocation(options && options.srcName, locInfo);
	  };
	
	  var strip = new _WhitespaceControl2['default']();
	  return strip.accept(_parser2['default'].parse(input));
	}

/***/ },
/* 80 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	/* istanbul ignore next */
	/* Jison generated parser */
	var handlebars = (function () {
	    var parser = { trace: function trace() {},
	        yy: {},
	        symbols_: { error: 2, root: 3, program: 4, EOF: 5, program_repetition0: 6, statement: 7, mustache: 8, block: 9, rawBlock: 10, partial: 11, content: 12, COMMENT: 13, CONTENT: 14, openRawBlock: 15, END_RAW_BLOCK: 16, OPEN_RAW_BLOCK: 17, helperName: 18, openRawBlock_repetition0: 19, openRawBlock_option0: 20, CLOSE_RAW_BLOCK: 21, openBlock: 22, block_option0: 23, closeBlock: 24, openInverse: 25, block_option1: 26, OPEN_BLOCK: 27, openBlock_repetition0: 28, openBlock_option0: 29, openBlock_option1: 30, CLOSE: 31, OPEN_INVERSE: 32, openInverse_repetition0: 33, openInverse_option0: 34, openInverse_option1: 35, openInverseChain: 36, OPEN_INVERSE_CHAIN: 37, openInverseChain_repetition0: 38, openInverseChain_option0: 39, openInverseChain_option1: 40, inverseAndProgram: 41, INVERSE: 42, inverseChain: 43, inverseChain_option0: 44, OPEN_ENDBLOCK: 45, OPEN: 46, mustache_repetition0: 47, mustache_option0: 48, OPEN_UNESCAPED: 49, mustache_repetition1: 50, mustache_option1: 51, CLOSE_UNESCAPED: 52, OPEN_PARTIAL: 53, partialName: 54, partial_repetition0: 55, partial_option0: 56, param: 57, sexpr: 58, OPEN_SEXPR: 59, sexpr_repetition0: 60, sexpr_option0: 61, CLOSE_SEXPR: 62, hash: 63, hash_repetition_plus0: 64, hashSegment: 65, ID: 66, EQUALS: 67, blockParams: 68, OPEN_BLOCK_PARAMS: 69, blockParams_repetition_plus0: 70, CLOSE_BLOCK_PARAMS: 71, path: 72, dataName: 73, STRING: 74, NUMBER: 75, BOOLEAN: 76, UNDEFINED: 77, NULL: 78, DATA: 79, pathSegments: 80, SEP: 81, $accept: 0, $end: 1 },
	        terminals_: { 2: "error", 5: "EOF", 13: "COMMENT", 14: "CONTENT", 16: "END_RAW_BLOCK", 17: "OPEN_RAW_BLOCK", 21: "CLOSE_RAW_BLOCK", 27: "OPEN_BLOCK", 31: "CLOSE", 32: "OPEN_INVERSE", 37: "OPEN_INVERSE_CHAIN", 42: "INVERSE", 45: "OPEN_ENDBLOCK", 46: "OPEN", 49: "OPEN_UNESCAPED", 52: "CLOSE_UNESCAPED", 53: "OPEN_PARTIAL", 59: "OPEN_SEXPR", 62: "CLOSE_SEXPR", 66: "ID", 67: "EQUALS", 69: "OPEN_BLOCK_PARAMS", 71: "CLOSE_BLOCK_PARAMS", 74: "STRING", 75: "NUMBER", 76: "BOOLEAN", 77: "UNDEFINED", 78: "NULL", 79: "DATA", 81: "SEP" },
	        productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [12, 1], [10, 3], [15, 5], [9, 4], [9, 4], [22, 6], [25, 6], [36, 6], [41, 2], [43, 3], [43, 1], [24, 3], [8, 5], [8, 5], [11, 5], [57, 1], [57, 1], [58, 5], [63, 1], [65, 3], [68, 3], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [54, 1], [54, 1], [73, 2], [72, 1], [80, 3], [80, 1], [6, 0], [6, 2], [19, 0], [19, 2], [20, 0], [20, 1], [23, 0], [23, 1], [26, 0], [26, 1], [28, 0], [28, 2], [29, 0], [29, 1], [30, 0], [30, 1], [33, 0], [33, 2], [34, 0], [34, 1], [35, 0], [35, 1], [38, 0], [38, 2], [39, 0], [39, 1], [40, 0], [40, 1], [44, 0], [44, 1], [47, 0], [47, 2], [48, 0], [48, 1], [50, 0], [50, 2], [51, 0], [51, 1], [55, 0], [55, 2], [56, 0], [56, 1], [60, 0], [60, 2], [61, 0], [61, 1], [64, 1], [64, 2], [70, 1], [70, 2]],
	        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
	
	            var $0 = $$.length - 1;
	            switch (yystate) {
	                case 1:
	                    return $$[$0 - 1];
	                    break;
	                case 2:
	                    this.$ = new yy.Program($$[$0], null, {}, yy.locInfo(this._$));
	                    break;
	                case 3:
	                    this.$ = $$[$0];
	                    break;
	                case 4:
	                    this.$ = $$[$0];
	                    break;
	                case 5:
	                    this.$ = $$[$0];
	                    break;
	                case 6:
	                    this.$ = $$[$0];
	                    break;
	                case 7:
	                    this.$ = $$[$0];
	                    break;
	                case 8:
	                    this.$ = new yy.CommentStatement(yy.stripComment($$[$0]), yy.stripFlags($$[$0], $$[$0]), yy.locInfo(this._$));
	                    break;
	                case 9:
	                    this.$ = new yy.ContentStatement($$[$0], yy.locInfo(this._$));
	                    break;
	                case 10:
	                    this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 11:
	                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
	                    break;
	                case 12:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
	                    break;
	                case 13:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
	                    break;
	                case 14:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 15:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 16:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 17:
	                    this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
	                    break;
	                case 18:
	                    var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
	                        program = new yy.Program([inverse], null, {}, yy.locInfo(this._$));
	                    program.chained = true;
	
	                    this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };
	
	                    break;
	                case 19:
	                    this.$ = $$[$0];
	                    break;
	                case 20:
	                    this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
	                    break;
	                case 21:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 22:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 23:
	                    this.$ = new yy.PartialStatement($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], yy.stripFlags($$[$0 - 4], $$[$0]), yy.locInfo(this._$));
	                    break;
	                case 24:
	                    this.$ = $$[$0];
	                    break;
	                case 25:
	                    this.$ = $$[$0];
	                    break;
	                case 26:
	                    this.$ = new yy.SubExpression($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], yy.locInfo(this._$));
	                    break;
	                case 27:
	                    this.$ = new yy.Hash($$[$0], yy.locInfo(this._$));
	                    break;
	                case 28:
	                    this.$ = new yy.HashPair(yy.id($$[$0 - 2]), $$[$0], yy.locInfo(this._$));
	                    break;
	                case 29:
	                    this.$ = yy.id($$[$0 - 1]);
	                    break;
	                case 30:
	                    this.$ = $$[$0];
	                    break;
	                case 31:
	                    this.$ = $$[$0];
	                    break;
	                case 32:
	                    this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$));
	                    break;
	                case 33:
	                    this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
	                    break;
	                case 34:
	                    this.$ = new yy.BooleanLiteral($$[$0], yy.locInfo(this._$));
	                    break;
	                case 35:
	                    this.$ = new yy.UndefinedLiteral(yy.locInfo(this._$));
	                    break;
	                case 36:
	                    this.$ = new yy.NullLiteral(yy.locInfo(this._$));
	                    break;
	                case 37:
	                    this.$ = $$[$0];
	                    break;
	                case 38:
	                    this.$ = $$[$0];
	                    break;
	                case 39:
	                    this.$ = yy.preparePath(true, $$[$0], this._$);
	                    break;
	                case 40:
	                    this.$ = yy.preparePath(false, $$[$0], this._$);
	                    break;
	                case 41:
	                    $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
	                    break;
	                case 42:
	                    this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
	                    break;
	                case 43:
	                    this.$ = [];
	                    break;
	                case 44:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 45:
	                    this.$ = [];
	                    break;
	                case 46:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 53:
	                    this.$ = [];
	                    break;
	                case 54:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 59:
	                    this.$ = [];
	                    break;
	                case 60:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 65:
	                    this.$ = [];
	                    break;
	                case 66:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 73:
	                    this.$ = [];
	                    break;
	                case 74:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 77:
	                    this.$ = [];
	                    break;
	                case 78:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 81:
	                    this.$ = [];
	                    break;
	                case 82:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 85:
	                    this.$ = [];
	                    break;
	                case 86:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 89:
	                    this.$ = [$$[$0]];
	                    break;
	                case 90:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 91:
	                    this.$ = [$$[$0]];
	                    break;
	                case 92:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	            }
	        },
	        table: [{ 3: 1, 4: 2, 5: [2, 43], 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: [1, 11], 14: [1, 18], 15: 16, 17: [1, 21], 22: 14, 25: 15, 27: [1, 19], 32: [1, 20], 37: [2, 2], 42: [2, 2], 45: [2, 2], 46: [1, 12], 49: [1, 13], 53: [1, 17] }, { 1: [2, 1] }, { 5: [2, 44], 13: [2, 44], 14: [2, 44], 17: [2, 44], 27: [2, 44], 32: [2, 44], 37: [2, 44], 42: [2, 44], 45: [2, 44], 46: [2, 44], 49: [2, 44], 53: [2, 44] }, { 5: [2, 3], 13: [2, 3], 14: [2, 3], 17: [2, 3], 27: [2, 3], 32: [2, 3], 37: [2, 3], 42: [2, 3], 45: [2, 3], 46: [2, 3], 49: [2, 3], 53: [2, 3] }, { 5: [2, 4], 13: [2, 4], 14: [2, 4], 17: [2, 4], 27: [2, 4], 32: [2, 4], 37: [2, 4], 42: [2, 4], 45: [2, 4], 46: [2, 4], 49: [2, 4], 53: [2, 4] }, { 5: [2, 5], 13: [2, 5], 14: [2, 5], 17: [2, 5], 27: [2, 5], 32: [2, 5], 37: [2, 5], 42: [2, 5], 45: [2, 5], 46: [2, 5], 49: [2, 5], 53: [2, 5] }, { 5: [2, 6], 13: [2, 6], 14: [2, 6], 17: [2, 6], 27: [2, 6], 32: [2, 6], 37: [2, 6], 42: [2, 6], 45: [2, 6], 46: [2, 6], 49: [2, 6], 53: [2, 6] }, { 5: [2, 7], 13: [2, 7], 14: [2, 7], 17: [2, 7], 27: [2, 7], 32: [2, 7], 37: [2, 7], 42: [2, 7], 45: [2, 7], 46: [2, 7], 49: [2, 7], 53: [2, 7] }, { 5: [2, 8], 13: [2, 8], 14: [2, 8], 17: [2, 8], 27: [2, 8], 32: [2, 8], 37: [2, 8], 42: [2, 8], 45: [2, 8], 46: [2, 8], 49: [2, 8], 53: [2, 8] }, { 18: 22, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 33, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 4: 34, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 37: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 4: 35, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 12: 36, 14: [1, 18] }, { 18: 38, 54: 37, 58: 39, 59: [1, 40], 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 9], 13: [2, 9], 14: [2, 9], 16: [2, 9], 17: [2, 9], 27: [2, 9], 32: [2, 9], 37: [2, 9], 42: [2, 9], 45: [2, 9], 46: [2, 9], 49: [2, 9], 53: [2, 9] }, { 18: 41, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 42, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 43, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 31: [2, 73], 47: 44, 59: [2, 73], 66: [2, 73], 74: [2, 73], 75: [2, 73], 76: [2, 73], 77: [2, 73], 78: [2, 73], 79: [2, 73] }, { 21: [2, 30], 31: [2, 30], 52: [2, 30], 59: [2, 30], 62: [2, 30], 66: [2, 30], 69: [2, 30], 74: [2, 30], 75: [2, 30], 76: [2, 30], 77: [2, 30], 78: [2, 30], 79: [2, 30] }, { 21: [2, 31], 31: [2, 31], 52: [2, 31], 59: [2, 31], 62: [2, 31], 66: [2, 31], 69: [2, 31], 74: [2, 31], 75: [2, 31], 76: [2, 31], 77: [2, 31], 78: [2, 31], 79: [2, 31] }, { 21: [2, 32], 31: [2, 32], 52: [2, 32], 59: [2, 32], 62: [2, 32], 66: [2, 32], 69: [2, 32], 74: [2, 32], 75: [2, 32], 76: [2, 32], 77: [2, 32], 78: [2, 32], 79: [2, 32] }, { 21: [2, 33], 31: [2, 33], 52: [2, 33], 59: [2, 33], 62: [2, 33], 66: [2, 33], 69: [2, 33], 74: [2, 33], 75: [2, 33], 76: [2, 33], 77: [2, 33], 78: [2, 33], 79: [2, 33] }, { 21: [2, 34], 31: [2, 34], 52: [2, 34], 59: [2, 34], 62: [2, 34], 66: [2, 34], 69: [2, 34], 74: [2, 34], 75: [2, 34], 76: [2, 34], 77: [2, 34], 78: [2, 34], 79: [2, 34] }, { 21: [2, 35], 31: [2, 35], 52: [2, 35], 59: [2, 35], 62: [2, 35], 66: [2, 35], 69: [2, 35], 74: [2, 35], 75: [2, 35], 76: [2, 35], 77: [2, 35], 78: [2, 35], 79: [2, 35] }, { 21: [2, 36], 31: [2, 36], 52: [2, 36], 59: [2, 36], 62: [2, 36], 66: [2, 36], 69: [2, 36], 74: [2, 36], 75: [2, 36], 76: [2, 36], 77: [2, 36], 78: [2, 36], 79: [2, 36] }, { 21: [2, 40], 31: [2, 40], 52: [2, 40], 59: [2, 40], 62: [2, 40], 66: [2, 40], 69: [2, 40], 74: [2, 40], 75: [2, 40], 76: [2, 40], 77: [2, 40], 78: [2, 40], 79: [2, 40], 81: [1, 45] }, { 66: [1, 32], 80: 46 }, { 21: [2, 42], 31: [2, 42], 52: [2, 42], 59: [2, 42], 62: [2, 42], 66: [2, 42], 69: [2, 42], 74: [2, 42], 75: [2, 42], 76: [2, 42], 77: [2, 42], 78: [2, 42], 79: [2, 42], 81: [2, 42] }, { 50: 47, 52: [2, 77], 59: [2, 77], 66: [2, 77], 74: [2, 77], 75: [2, 77], 76: [2, 77], 77: [2, 77], 78: [2, 77], 79: [2, 77] }, { 23: 48, 36: 50, 37: [1, 52], 41: 51, 42: [1, 53], 43: 49, 45: [2, 49] }, { 26: 54, 41: 55, 42: [1, 53], 45: [2, 51] }, { 16: [1, 56] }, { 31: [2, 81], 55: 57, 59: [2, 81], 66: [2, 81], 74: [2, 81], 75: [2, 81], 76: [2, 81], 77: [2, 81], 78: [2, 81], 79: [2, 81] }, { 31: [2, 37], 59: [2, 37], 66: [2, 37], 74: [2, 37], 75: [2, 37], 76: [2, 37], 77: [2, 37], 78: [2, 37], 79: [2, 37] }, { 31: [2, 38], 59: [2, 38], 66: [2, 38], 74: [2, 38], 75: [2, 38], 76: [2, 38], 77: [2, 38], 78: [2, 38], 79: [2, 38] }, { 18: 58, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 28: 59, 31: [2, 53], 59: [2, 53], 66: [2, 53], 69: [2, 53], 74: [2, 53], 75: [2, 53], 76: [2, 53], 77: [2, 53], 78: [2, 53], 79: [2, 53] }, { 31: [2, 59], 33: 60, 59: [2, 59], 66: [2, 59], 69: [2, 59], 74: [2, 59], 75: [2, 59], 76: [2, 59], 77: [2, 59], 78: [2, 59], 79: [2, 59] }, { 19: 61, 21: [2, 45], 59: [2, 45], 66: [2, 45], 74: [2, 45], 75: [2, 45], 76: [2, 45], 77: [2, 45], 78: [2, 45], 79: [2, 45] }, { 18: 65, 31: [2, 75], 48: 62, 57: 63, 58: 66, 59: [1, 40], 63: 64, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 66: [1, 70] }, { 21: [2, 39], 31: [2, 39], 52: [2, 39], 59: [2, 39], 62: [2, 39], 66: [2, 39], 69: [2, 39], 74: [2, 39], 75: [2, 39], 76: [2, 39], 77: [2, 39], 78: [2, 39], 79: [2, 39], 81: [1, 45] }, { 18: 65, 51: 71, 52: [2, 79], 57: 72, 58: 66, 59: [1, 40], 63: 73, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 24: 74, 45: [1, 75] }, { 45: [2, 50] }, { 4: 76, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 37: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 45: [2, 19] }, { 18: 77, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 4: 78, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 24: 79, 45: [1, 75] }, { 45: [2, 52] }, { 5: [2, 10], 13: [2, 10], 14: [2, 10], 17: [2, 10], 27: [2, 10], 32: [2, 10], 37: [2, 10], 42: [2, 10], 45: [2, 10], 46: [2, 10], 49: [2, 10], 53: [2, 10] }, { 18: 65, 31: [2, 83], 56: 80, 57: 81, 58: 66, 59: [1, 40], 63: 82, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 59: [2, 85], 60: 83, 62: [2, 85], 66: [2, 85], 74: [2, 85], 75: [2, 85], 76: [2, 85], 77: [2, 85], 78: [2, 85], 79: [2, 85] }, { 18: 65, 29: 84, 31: [2, 55], 57: 85, 58: 66, 59: [1, 40], 63: 86, 64: 67, 65: 68, 66: [1, 69], 69: [2, 55], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 65, 31: [2, 61], 34: 87, 57: 88, 58: 66, 59: [1, 40], 63: 89, 64: 67, 65: 68, 66: [1, 69], 69: [2, 61], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 65, 20: 90, 21: [2, 47], 57: 91, 58: 66, 59: [1, 40], 63: 92, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 31: [1, 93] }, { 31: [2, 74], 59: [2, 74], 66: [2, 74], 74: [2, 74], 75: [2, 74], 76: [2, 74], 77: [2, 74], 78: [2, 74], 79: [2, 74] }, { 31: [2, 76] }, { 21: [2, 24], 31: [2, 24], 52: [2, 24], 59: [2, 24], 62: [2, 24], 66: [2, 24], 69: [2, 24], 74: [2, 24], 75: [2, 24], 76: [2, 24], 77: [2, 24], 78: [2, 24], 79: [2, 24] }, { 21: [2, 25], 31: [2, 25], 52: [2, 25], 59: [2, 25], 62: [2, 25], 66: [2, 25], 69: [2, 25], 74: [2, 25], 75: [2, 25], 76: [2, 25], 77: [2, 25], 78: [2, 25], 79: [2, 25] }, { 21: [2, 27], 31: [2, 27], 52: [2, 27], 62: [2, 27], 65: 94, 66: [1, 95], 69: [2, 27] }, { 21: [2, 89], 31: [2, 89], 52: [2, 89], 62: [2, 89], 66: [2, 89], 69: [2, 89] }, { 21: [2, 42], 31: [2, 42], 52: [2, 42], 59: [2, 42], 62: [2, 42], 66: [2, 42], 67: [1, 96], 69: [2, 42], 74: [2, 42], 75: [2, 42], 76: [2, 42], 77: [2, 42], 78: [2, 42], 79: [2, 42], 81: [2, 42] }, { 21: [2, 41], 31: [2, 41], 52: [2, 41], 59: [2, 41], 62: [2, 41], 66: [2, 41], 69: [2, 41], 74: [2, 41], 75: [2, 41], 76: [2, 41], 77: [2, 41], 78: [2, 41], 79: [2, 41], 81: [2, 41] }, { 52: [1, 97] }, { 52: [2, 78], 59: [2, 78], 66: [2, 78], 74: [2, 78], 75: [2, 78], 76: [2, 78], 77: [2, 78], 78: [2, 78], 79: [2, 78] }, { 52: [2, 80] }, { 5: [2, 12], 13: [2, 12], 14: [2, 12], 17: [2, 12], 27: [2, 12], 32: [2, 12], 37: [2, 12], 42: [2, 12], 45: [2, 12], 46: [2, 12], 49: [2, 12], 53: [2, 12] }, { 18: 98, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 36: 50, 37: [1, 52], 41: 51, 42: [1, 53], 43: 100, 44: 99, 45: [2, 71] }, { 31: [2, 65], 38: 101, 59: [2, 65], 66: [2, 65], 69: [2, 65], 74: [2, 65], 75: [2, 65], 76: [2, 65], 77: [2, 65], 78: [2, 65], 79: [2, 65] }, { 45: [2, 17] }, { 5: [2, 13], 13: [2, 13], 14: [2, 13], 17: [2, 13], 27: [2, 13], 32: [2, 13], 37: [2, 13], 42: [2, 13], 45: [2, 13], 46: [2, 13], 49: [2, 13], 53: [2, 13] }, { 31: [1, 102] }, { 31: [2, 82], 59: [2, 82], 66: [2, 82], 74: [2, 82], 75: [2, 82], 76: [2, 82], 77: [2, 82], 78: [2, 82], 79: [2, 82] }, { 31: [2, 84] }, { 18: 65, 57: 104, 58: 66, 59: [1, 40], 61: 103, 62: [2, 87], 63: 105, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 30: 106, 31: [2, 57], 68: 107, 69: [1, 108] }, { 31: [2, 54], 59: [2, 54], 66: [2, 54], 69: [2, 54], 74: [2, 54], 75: [2, 54], 76: [2, 54], 77: [2, 54], 78: [2, 54], 79: [2, 54] }, { 31: [2, 56], 69: [2, 56] }, { 31: [2, 63], 35: 109, 68: 110, 69: [1, 108] }, { 31: [2, 60], 59: [2, 60], 66: [2, 60], 69: [2, 60], 74: [2, 60], 75: [2, 60], 76: [2, 60], 77: [2, 60], 78: [2, 60], 79: [2, 60] }, { 31: [2, 62], 69: [2, 62] }, { 21: [1, 111] }, { 21: [2, 46], 59: [2, 46], 66: [2, 46], 74: [2, 46], 75: [2, 46], 76: [2, 46], 77: [2, 46], 78: [2, 46], 79: [2, 46] }, { 21: [2, 48] }, { 5: [2, 21], 13: [2, 21], 14: [2, 21], 17: [2, 21], 27: [2, 21], 32: [2, 21], 37: [2, 21], 42: [2, 21], 45: [2, 21], 46: [2, 21], 49: [2, 21], 53: [2, 21] }, { 21: [2, 90], 31: [2, 90], 52: [2, 90], 62: [2, 90], 66: [2, 90], 69: [2, 90] }, { 67: [1, 96] }, { 18: 65, 57: 112, 58: 66, 59: [1, 40], 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 22], 13: [2, 22], 14: [2, 22], 17: [2, 22], 27: [2, 22], 32: [2, 22], 37: [2, 22], 42: [2, 22], 45: [2, 22], 46: [2, 22], 49: [2, 22], 53: [2, 22] }, { 31: [1, 113] }, { 45: [2, 18] }, { 45: [2, 72] }, { 18: 65, 31: [2, 67], 39: 114, 57: 115, 58: 66, 59: [1, 40], 63: 116, 64: 67, 65: 68, 66: [1, 69], 69: [2, 67], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 23], 13: [2, 23], 14: [2, 23], 17: [2, 23], 27: [2, 23], 32: [2, 23], 37: [2, 23], 42: [2, 23], 45: [2, 23], 46: [2, 23], 49: [2, 23], 53: [2, 23] }, { 62: [1, 117] }, { 59: [2, 86], 62: [2, 86], 66: [2, 86], 74: [2, 86], 75: [2, 86], 76: [2, 86], 77: [2, 86], 78: [2, 86], 79: [2, 86] }, { 62: [2, 88] }, { 31: [1, 118] }, { 31: [2, 58] }, { 66: [1, 120], 70: 119 }, { 31: [1, 121] }, { 31: [2, 64] }, { 14: [2, 11] }, { 21: [2, 28], 31: [2, 28], 52: [2, 28], 62: [2, 28], 66: [2, 28], 69: [2, 28] }, { 5: [2, 20], 13: [2, 20], 14: [2, 20], 17: [2, 20], 27: [2, 20], 32: [2, 20], 37: [2, 20], 42: [2, 20], 45: [2, 20], 46: [2, 20], 49: [2, 20], 53: [2, 20] }, { 31: [2, 69], 40: 122, 68: 123, 69: [1, 108] }, { 31: [2, 66], 59: [2, 66], 66: [2, 66], 69: [2, 66], 74: [2, 66], 75: [2, 66], 76: [2, 66], 77: [2, 66], 78: [2, 66], 79: [2, 66] }, { 31: [2, 68], 69: [2, 68] }, { 21: [2, 26], 31: [2, 26], 52: [2, 26], 59: [2, 26], 62: [2, 26], 66: [2, 26], 69: [2, 26], 74: [2, 26], 75: [2, 26], 76: [2, 26], 77: [2, 26], 78: [2, 26], 79: [2, 26] }, { 13: [2, 14], 14: [2, 14], 17: [2, 14], 27: [2, 14], 32: [2, 14], 37: [2, 14], 42: [2, 14], 45: [2, 14], 46: [2, 14], 49: [2, 14], 53: [2, 14] }, { 66: [1, 125], 71: [1, 124] }, { 66: [2, 91], 71: [2, 91] }, { 13: [2, 15], 14: [2, 15], 17: [2, 15], 27: [2, 15], 32: [2, 15], 42: [2, 15], 45: [2, 15], 46: [2, 15], 49: [2, 15], 53: [2, 15] }, { 31: [1, 126] }, { 31: [2, 70] }, { 31: [2, 29] }, { 66: [2, 92], 71: [2, 92] }, { 13: [2, 16], 14: [2, 16], 17: [2, 16], 27: [2, 16], 32: [2, 16], 37: [2, 16], 42: [2, 16], 45: [2, 16], 46: [2, 16], 49: [2, 16], 53: [2, 16] }],
	        defaultActions: { 4: [2, 1], 49: [2, 50], 51: [2, 19], 55: [2, 52], 64: [2, 76], 73: [2, 80], 78: [2, 17], 82: [2, 84], 92: [2, 48], 99: [2, 18], 100: [2, 72], 105: [2, 88], 107: [2, 58], 110: [2, 64], 111: [2, 11], 123: [2, 70], 124: [2, 29] },
	        parseError: function parseError(str, hash) {
	            throw new Error(str);
	        },
	        parse: function parse(input) {
	            var self = this,
	                stack = [0],
	                vstack = [null],
	                lstack = [],
	                table = this.table,
	                yytext = "",
	                yylineno = 0,
	                yyleng = 0,
	                recovering = 0,
	                TERROR = 2,
	                EOF = 1;
	            this.lexer.setInput(input);
	            this.lexer.yy = this.yy;
	            this.yy.lexer = this.lexer;
	            this.yy.parser = this;
	            if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
	            var yyloc = this.lexer.yylloc;
	            lstack.push(yyloc);
	            var ranges = this.lexer.options && this.lexer.options.ranges;
	            if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
	            function popStack(n) {
	                stack.length = stack.length - 2 * n;
	                vstack.length = vstack.length - n;
	                lstack.length = lstack.length - n;
	            }
	            function lex() {
	                var token;
	                token = self.lexer.lex() || 1;
	                if (typeof token !== "number") {
	                    token = self.symbols_[token] || token;
	                }
	                return token;
	            }
	            var symbol,
	                preErrorSymbol,
	                state,
	                action,
	                a,
	                r,
	                yyval = {},
	                p,
	                len,
	                newState,
	                expected;
	            while (true) {
	                state = stack[stack.length - 1];
	                if (this.defaultActions[state]) {
	                    action = this.defaultActions[state];
	                } else {
	                    if (symbol === null || typeof symbol == "undefined") {
	                        symbol = lex();
	                    }
	                    action = table[state] && table[state][symbol];
	                }
	                if (typeof action === "undefined" || !action.length || !action[0]) {
	                    var errStr = "";
	                    if (!recovering) {
	                        expected = [];
	                        for (p in table[state]) if (this.terminals_[p] && p > 2) {
	                            expected.push("'" + this.terminals_[p] + "'");
	                        }
	                        if (this.lexer.showPosition) {
	                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
	                        } else {
	                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
	                        }
	                        this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
	                    }
	                }
	                if (action[0] instanceof Array && action.length > 1) {
	                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
	                }
	                switch (action[0]) {
	                    case 1:
	                        stack.push(symbol);
	                        vstack.push(this.lexer.yytext);
	                        lstack.push(this.lexer.yylloc);
	                        stack.push(action[1]);
	                        symbol = null;
	                        if (!preErrorSymbol) {
	                            yyleng = this.lexer.yyleng;
	                            yytext = this.lexer.yytext;
	                            yylineno = this.lexer.yylineno;
	                            yyloc = this.lexer.yylloc;
	                            if (recovering > 0) recovering--;
	                        } else {
	                            symbol = preErrorSymbol;
	                            preErrorSymbol = null;
	                        }
	                        break;
	                    case 2:
	                        len = this.productions_[action[1]][1];
	                        yyval.$ = vstack[vstack.length - len];
	                        yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
	                        if (ranges) {
	                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
	                        }
	                        r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
	                        if (typeof r !== "undefined") {
	                            return r;
	                        }
	                        if (len) {
	                            stack = stack.slice(0, -1 * len * 2);
	                            vstack = vstack.slice(0, -1 * len);
	                            lstack = lstack.slice(0, -1 * len);
	                        }
	                        stack.push(this.productions_[action[1]][0]);
	                        vstack.push(yyval.$);
	                        lstack.push(yyval._$);
	                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	                        stack.push(newState);
	                        break;
	                    case 3:
	                        return true;
	                }
	            }
	            return true;
	        }
	    };
	    /* Jison generated lexer */
	    var lexer = (function () {
	        var lexer = { EOF: 1,
	            parseError: function parseError(str, hash) {
	                if (this.yy.parser) {
	                    this.yy.parser.parseError(str, hash);
	                } else {
	                    throw new Error(str);
	                }
	            },
	            setInput: function setInput(input) {
	                this._input = input;
	                this._more = this._less = this.done = false;
	                this.yylineno = this.yyleng = 0;
	                this.yytext = this.matched = this.match = "";
	                this.conditionStack = ["INITIAL"];
	                this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
	                if (this.options.ranges) this.yylloc.range = [0, 0];
	                this.offset = 0;
	                return this;
	            },
	            input: function input() {
	                var ch = this._input[0];
	                this.yytext += ch;
	                this.yyleng++;
	                this.offset++;
	                this.match += ch;
	                this.matched += ch;
	                var lines = ch.match(/(?:\r\n?|\n).*/g);
	                if (lines) {
	                    this.yylineno++;
	                    this.yylloc.last_line++;
	                } else {
	                    this.yylloc.last_column++;
	                }
	                if (this.options.ranges) this.yylloc.range[1]++;
	
	                this._input = this._input.slice(1);
	                return ch;
	            },
	            unput: function unput(ch) {
	                var len = ch.length;
	                var lines = ch.split(/(?:\r\n?|\n)/g);
	
	                this._input = ch + this._input;
	                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	                //this.yyleng -= len;
	                this.offset -= len;
	                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	                this.match = this.match.substr(0, this.match.length - 1);
	                this.matched = this.matched.substr(0, this.matched.length - 1);
	
	                if (lines.length - 1) this.yylineno -= lines.length - 1;
	                var r = this.yylloc.range;
	
	                this.yylloc = { first_line: this.yylloc.first_line,
	                    last_line: this.yylineno + 1,
	                    first_column: this.yylloc.first_column,
	                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
	                };
	
	                if (this.options.ranges) {
	                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	                }
	                return this;
	            },
	            more: function more() {
	                this._more = true;
	                return this;
	            },
	            less: function less(n) {
	                this.unput(this.match.slice(n));
	            },
	            pastInput: function pastInput() {
	                var past = this.matched.substr(0, this.matched.length - this.match.length);
	                return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
	            },
	            upcomingInput: function upcomingInput() {
	                var next = this.match;
	                if (next.length < 20) {
	                    next += this._input.substr(0, 20 - next.length);
	                }
	                return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
	            },
	            showPosition: function showPosition() {
	                var pre = this.pastInput();
	                var c = new Array(pre.length + 1).join("-");
	                return pre + this.upcomingInput() + "\n" + c + "^";
	            },
	            next: function next() {
	                if (this.done) {
	                    return this.EOF;
	                }
	                if (!this._input) this.done = true;
	
	                var token, match, tempMatch, index, col, lines;
	                if (!this._more) {
	                    this.yytext = "";
	                    this.match = "";
	                }
	                var rules = this._currentRules();
	                for (var i = 0; i < rules.length; i++) {
	                    tempMatch = this._input.match(this.rules[rules[i]]);
	                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                        match = tempMatch;
	                        index = i;
	                        if (!this.options.flex) break;
	                    }
	                }
	                if (match) {
	                    lines = match[0].match(/(?:\r\n?|\n).*/g);
	                    if (lines) this.yylineno += lines.length;
	                    this.yylloc = { first_line: this.yylloc.last_line,
	                        last_line: this.yylineno + 1,
	                        first_column: this.yylloc.last_column,
	                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
	                    this.yytext += match[0];
	                    this.match += match[0];
	                    this.matches = match;
	                    this.yyleng = this.yytext.length;
	                    if (this.options.ranges) {
	                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
	                    }
	                    this._more = false;
	                    this._input = this._input.slice(match[0].length);
	                    this.matched += match[0];
	                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
	                    if (this.done && this._input) this.done = false;
	                    if (token) {
	                        return token;
	                    } else {
	                        return;
	                    }
	                }
	                if (this._input === "") {
	                    return this.EOF;
	                } else {
	                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), { text: "", token: null, line: this.yylineno });
	                }
	            },
	            lex: function lex() {
	                var r = this.next();
	                if (typeof r !== "undefined") {
	                    return r;
	                } else {
	                    return this.lex();
	                }
	            },
	            begin: function begin(condition) {
	                this.conditionStack.push(condition);
	            },
	            popState: function popState() {
	                return this.conditionStack.pop();
	            },
	            _currentRules: function _currentRules() {
	                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	            },
	            topState: function topState() {
	                return this.conditionStack[this.conditionStack.length - 2];
	            },
	            pushState: function begin(condition) {
	                this.begin(condition);
	            } };
	        lexer.options = {};
	        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
	
	            function strip(start, end) {
	                return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng - end);
	            }
	
	            var YYSTATE = YY_START;
	            switch ($avoiding_name_collisions) {
	                case 0:
	                    if (yy_.yytext.slice(-2) === "\\\\") {
	                        strip(0, 1);
	                        this.begin("mu");
	                    } else if (yy_.yytext.slice(-1) === "\\") {
	                        strip(0, 1);
	                        this.begin("emu");
	                    } else {
	                        this.begin("mu");
	                    }
	                    if (yy_.yytext) {
	                        return 14;
	                    }break;
	                case 1:
	                    return 14;
	                    break;
	                case 2:
	                    this.popState();
	                    return 14;
	
	                    break;
	                case 3:
	                    yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 9);
	                    this.popState();
	                    return 16;
	
	                    break;
	                case 4:
	                    return 14;
	                    break;
	                case 5:
	                    this.popState();
	                    return 13;
	
	                    break;
	                case 6:
	                    return 59;
	                    break;
	                case 7:
	                    return 62;
	                    break;
	                case 8:
	                    return 17;
	                    break;
	                case 9:
	                    this.popState();
	                    this.begin("raw");
	                    return 21;
	
	                    break;
	                case 10:
	                    return 53;
	                    break;
	                case 11:
	                    return 27;
	                    break;
	                case 12:
	                    return 45;
	                    break;
	                case 13:
	                    this.popState();return 42;
	                    break;
	                case 14:
	                    this.popState();return 42;
	                    break;
	                case 15:
	                    return 32;
	                    break;
	                case 16:
	                    return 37;
	                    break;
	                case 17:
	                    return 49;
	                    break;
	                case 18:
	                    return 46;
	                    break;
	                case 19:
	                    this.unput(yy_.yytext);
	                    this.popState();
	                    this.begin("com");
	
	                    break;
	                case 20:
	                    this.popState();
	                    return 13;
	
	                    break;
	                case 21:
	                    return 46;
	                    break;
	                case 22:
	                    return 67;
	                    break;
	                case 23:
	                    return 66;
	                    break;
	                case 24:
	                    return 66;
	                    break;
	                case 25:
	                    return 81;
	                    break;
	                case 26:
	                    // ignore whitespace
	                    break;
	                case 27:
	                    this.popState();return 52;
	                    break;
	                case 28:
	                    this.popState();return 31;
	                    break;
	                case 29:
	                    yy_.yytext = strip(1, 2).replace(/\\"/g, "\"");return 74;
	                    break;
	                case 30:
	                    yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 74;
	                    break;
	                case 31:
	                    return 79;
	                    break;
	                case 32:
	                    return 76;
	                    break;
	                case 33:
	                    return 76;
	                    break;
	                case 34:
	                    return 77;
	                    break;
	                case 35:
	                    return 78;
	                    break;
	                case 36:
	                    return 75;
	                    break;
	                case 37:
	                    return 69;
	                    break;
	                case 38:
	                    return 71;
	                    break;
	                case 39:
	                    return 66;
	                    break;
	                case 40:
	                    return 66;
	                    break;
	                case 41:
	                    return "INVALID";
	                    break;
	                case 42:
	                    return 5;
	                    break;
	            }
	        };
	        lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{\/)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/];
	        lexer.conditions = { mu: { rules: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], inclusive: false }, emu: { rules: [2], inclusive: false }, com: { rules: [5], inclusive: false }, raw: { rules: [3, 4], inclusive: false }, INITIAL: { rules: [0, 1, 42], inclusive: true } };
	        return lexer;
	    })();
	    parser.lexer = lexer;
	    function Parser() {
	        this.yy = {};
	    }Parser.prototype = parser;parser.Parser = Parser;
	    return new Parser();
	})();exports["default"] = handlebars;
	module.exports = exports["default"];

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	
	var _Visitor = __webpack_require__(82);
	
	var _Visitor2 = _interopRequireWildcard(_Visitor);
	
	function WhitespaceControl() {}
	WhitespaceControl.prototype = new _Visitor2['default']();
	
	WhitespaceControl.prototype.Program = function (program) {
	  var isRoot = !this.isRootSeen;
	  this.isRootSeen = true;
	
	  var body = program.body;
	  for (var i = 0, l = body.length; i < l; i++) {
	    var current = body[i],
	        strip = this.accept(current);
	
	    if (!strip) {
	      continue;
	    }
	
	    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
	        _isNextWhitespace = isNextWhitespace(body, i, isRoot),
	        openStandalone = strip.openStandalone && _isPrevWhitespace,
	        closeStandalone = strip.closeStandalone && _isNextWhitespace,
	        inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
	
	    if (strip.close) {
	      omitRight(body, i, true);
	    }
	    if (strip.open) {
	      omitLeft(body, i, true);
	    }
	
	    if (inlineStandalone) {
	      omitRight(body, i);
	
	      if (omitLeft(body, i)) {
	        // If we are on a standalone node, save the indent info for partials
	        if (current.type === 'PartialStatement') {
	          // Pull out the whitespace from the final line
	          current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
	        }
	      }
	    }
	    if (openStandalone) {
	      omitRight((current.program || current.inverse).body);
	
	      // Strip out the previous content node if it's whitespace only
	      omitLeft(body, i);
	    }
	    if (closeStandalone) {
	      // Always strip the next node
	      omitRight(body, i);
	
	      omitLeft((current.inverse || current.program).body);
	    }
	  }
	
	  return program;
	};
	WhitespaceControl.prototype.BlockStatement = function (block) {
	  this.accept(block.program);
	  this.accept(block.inverse);
	
	  // Find the inverse program that is involed with whitespace stripping.
	  var program = block.program || block.inverse,
	      inverse = block.program && block.inverse,
	      firstInverse = inverse,
	      lastInverse = inverse;
	
	  if (inverse && inverse.chained) {
	    firstInverse = inverse.body[0].program;
	
	    // Walk the inverse chain to find the last inverse that is actually in the chain.
	    while (lastInverse.chained) {
	      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
	    }
	  }
	
	  var strip = {
	    open: block.openStrip.open,
	    close: block.closeStrip.close,
	
	    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
	    // so our parent can determine if we actually are standalone
	    openStandalone: isNextWhitespace(program.body),
	    closeStandalone: isPrevWhitespace((firstInverse || program).body)
	  };
	
	  if (block.openStrip.close) {
	    omitRight(program.body, null, true);
	  }
	
	  if (inverse) {
	    var inverseStrip = block.inverseStrip;
	
	    if (inverseStrip.open) {
	      omitLeft(program.body, null, true);
	    }
	
	    if (inverseStrip.close) {
	      omitRight(firstInverse.body, null, true);
	    }
	    if (block.closeStrip.open) {
	      omitLeft(lastInverse.body, null, true);
	    }
	
	    // Find standalone else statments
	    if (isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
	      omitLeft(program.body);
	      omitRight(firstInverse.body);
	    }
	  } else if (block.closeStrip.open) {
	    omitLeft(program.body, null, true);
	  }
	
	  return strip;
	};
	
	WhitespaceControl.prototype.MustacheStatement = function (mustache) {
	  return mustache.strip;
	};
	
	WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
	  /* istanbul ignore next */
	  var strip = node.strip || {};
	  return {
	    inlineStandalone: true,
	    open: strip.open,
	    close: strip.close
	  };
	};
	
	function isPrevWhitespace(body, i, isRoot) {
	  if (i === undefined) {
	    i = body.length;
	  }
	
	  // Nodes that end with newlines are considered whitespace (but are special
	  // cased for strip operations)
	  var prev = body[i - 1],
	      sibling = body[i - 2];
	  if (!prev) {
	    return isRoot;
	  }
	
	  if (prev.type === 'ContentStatement') {
	    return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
	  }
	}
	function isNextWhitespace(body, i, isRoot) {
	  if (i === undefined) {
	    i = -1;
	  }
	
	  var next = body[i + 1],
	      sibling = body[i + 2];
	  if (!next) {
	    return isRoot;
	  }
	
	  if (next.type === 'ContentStatement') {
	    return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
	  }
	}
	
	// Marks the node to the right of the position as omitted.
	// I.e. {{foo}}' ' will mark the ' ' node as omitted.
	//
	// If i is undefined, then the first child will be marked as such.
	//
	// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitRight(body, i, multiple) {
	  var current = body[i == null ? 0 : i + 1];
	  if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
	    return;
	  }
	
	  var original = current.value;
	  current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
	  current.rightStripped = current.value !== original;
	}
	
	// Marks the node to the left of the position as omitted.
	// I.e. ' '{{foo}} will mark the ' ' node as omitted.
	//
	// If i is undefined then the last child will be marked as such.
	//
	// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitLeft(body, i, multiple) {
	  var current = body[i == null ? body.length - 1 : i - 1];
	  if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
	    return;
	  }
	
	  // We omit the last node if it's whitespace only and not preceeded by a non-content node.
	  var original = current.value;
	  current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
	  current.leftStripped = current.value !== original;
	  return current.leftStripped;
	}
	
	exports['default'] = WhitespaceControl;
	module.exports = exports['default'];

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	var _AST = __webpack_require__(78);
	
	var _AST2 = _interopRequireWildcard(_AST);
	
	function Visitor() {
	  this.parents = [];
	}
	
	Visitor.prototype = {
	  constructor: Visitor,
	  mutating: false,
	
	  // Visits a given value. If mutating, will replace the value if necessary.
	  acceptKey: function acceptKey(node, name) {
	    var value = this.accept(node[name]);
	    if (this.mutating) {
	      // Hacky sanity check:
	      if (value && (!value.type || !_AST2['default'][value.type])) {
	        throw new _Exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
	      }
	      node[name] = value;
	    }
	  },
	
	  // Performs an accept operation with added sanity check to ensure
	  // required keys are not removed.
	  acceptRequired: function acceptRequired(node, name) {
	    this.acceptKey(node, name);
	
	    if (!node[name]) {
	      throw new _Exception2['default'](node.type + ' requires ' + name);
	    }
	  },
	
	  // Traverses a given array. If mutating, empty respnses will be removed
	  // for child elements.
	  acceptArray: function acceptArray(array) {
	    for (var i = 0, l = array.length; i < l; i++) {
	      this.acceptKey(array, i);
	
	      if (!array[i]) {
	        array.splice(i, 1);
	        i--;
	        l--;
	      }
	    }
	  },
	
	  accept: function accept(object) {
	    if (!object) {
	      return;
	    }
	
	    if (this.current) {
	      this.parents.unshift(this.current);
	    }
	    this.current = object;
	
	    var ret = this[object.type](object);
	
	    this.current = this.parents.shift();
	
	    if (!this.mutating || ret) {
	      return ret;
	    } else if (ret !== false) {
	      return object;
	    }
	  },
	
	  Program: function Program(program) {
	    this.acceptArray(program.body);
	  },
	
	  MustacheStatement: function MustacheStatement(mustache) {
	    this.acceptRequired(mustache, 'path');
	    this.acceptArray(mustache.params);
	    this.acceptKey(mustache, 'hash');
	  },
	
	  BlockStatement: function BlockStatement(block) {
	    this.acceptRequired(block, 'path');
	    this.acceptArray(block.params);
	    this.acceptKey(block, 'hash');
	
	    this.acceptKey(block, 'program');
	    this.acceptKey(block, 'inverse');
	  },
	
	  PartialStatement: function PartialStatement(partial) {
	    this.acceptRequired(partial, 'name');
	    this.acceptArray(partial.params);
	    this.acceptKey(partial, 'hash');
	  },
	
	  ContentStatement: function ContentStatement() {},
	  CommentStatement: function CommentStatement() {},
	
	  SubExpression: function SubExpression(sexpr) {
	    this.acceptRequired(sexpr, 'path');
	    this.acceptArray(sexpr.params);
	    this.acceptKey(sexpr, 'hash');
	  },
	
	  PathExpression: function PathExpression() {},
	
	  StringLiteral: function StringLiteral() {},
	  NumberLiteral: function NumberLiteral() {},
	  BooleanLiteral: function BooleanLiteral() {},
	  UndefinedLiteral: function UndefinedLiteral() {},
	  NullLiteral: function NullLiteral() {},
	
	  Hash: function Hash(hash) {
	    this.acceptArray(hash.pairs);
	  },
	  HashPair: function HashPair(pair) {
	    this.acceptRequired(pair, 'value');
	  }
	};
	
	exports['default'] = Visitor;
	module.exports = exports['default'];
	/* content */ /* comment */ /* path */ /* string */ /* number */ /* bool */ /* literal */ /* literal */

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	exports.SourceLocation = SourceLocation;
	exports.id = id;
	exports.stripFlags = stripFlags;
	exports.stripComment = stripComment;
	exports.preparePath = preparePath;
	exports.prepareMustache = prepareMustache;
	exports.prepareRawBlock = prepareRawBlock;
	exports.prepareBlock = prepareBlock;
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	function SourceLocation(source, locInfo) {
	  this.source = source;
	  this.start = {
	    line: locInfo.first_line,
	    column: locInfo.first_column
	  };
	  this.end = {
	    line: locInfo.last_line,
	    column: locInfo.last_column
	  };
	}
	
	function id(token) {
	  if (/^\[.*\]$/.test(token)) {
	    return token.substr(1, token.length - 2);
	  } else {
	    return token;
	  }
	}
	
	function stripFlags(open, close) {
	  return {
	    open: open.charAt(2) === '~',
	    close: close.charAt(close.length - 3) === '~'
	  };
	}
	
	function stripComment(comment) {
	  return comment.replace(/^\{\{~?\!-?-?/, '').replace(/-?-?~?\}\}$/, '');
	}
	
	function preparePath(data, parts, locInfo) {
	  locInfo = this.locInfo(locInfo);
	
	  var original = data ? '@' : '',
	      dig = [],
	      depth = 0,
	      depthString = '';
	
	  for (var i = 0, l = parts.length; i < l; i++) {
	    var part = parts[i].part,
	
	    // If we have [] syntax then we do not treat path references as operators,
	    // i.e. foo.[this] resolves to approximately context.foo['this']
	    isLiteral = parts[i].original !== part;
	    original += (parts[i].separator || '') + part;
	
	    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
	      if (dig.length > 0) {
	        throw new _Exception2['default']('Invalid path: ' + original, { loc: locInfo });
	      } else if (part === '..') {
	        depth++;
	        depthString += '../';
	      }
	    } else {
	      dig.push(part);
	    }
	  }
	
	  return new this.PathExpression(data, depth, dig, original, locInfo);
	}
	
	function prepareMustache(path, params, hash, open, strip, locInfo) {
	  // Must use charAt to support IE pre-10
	  var escapeFlag = open.charAt(3) || open.charAt(2),
	      escaped = escapeFlag !== '{' && escapeFlag !== '&';
	
	  return new this.MustacheStatement(path, params, hash, escaped, strip, this.locInfo(locInfo));
	}
	
	function prepareRawBlock(openRawBlock, content, close, locInfo) {
	  if (openRawBlock.path.original !== close) {
	    var errorNode = { loc: openRawBlock.path.loc };
	
	    throw new _Exception2['default'](openRawBlock.path.original + ' doesn\'t match ' + close, errorNode);
	  }
	
	  locInfo = this.locInfo(locInfo);
	  var program = new this.Program([content], null, {}, locInfo);
	
	  return new this.BlockStatement(openRawBlock.path, openRawBlock.params, openRawBlock.hash, program, undefined, {}, {}, {}, locInfo);
	}
	
	function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
	  // When we are chaining inverse calls, we will not have a close path
	  if (close && close.path && openBlock.path.original !== close.path.original) {
	    var errorNode = { loc: openBlock.path.loc };
	
	    throw new _Exception2['default'](openBlock.path.original + ' doesn\'t match ' + close.path.original, errorNode);
	  }
	
	  program.blockParams = openBlock.blockParams;
	
	  var inverse = undefined,
	      inverseStrip = undefined;
	
	  if (inverseAndProgram) {
	    if (inverseAndProgram.chain) {
	      inverseAndProgram.program.body[0].closeStrip = close.strip;
	    }
	
	    inverseStrip = inverseAndProgram.strip;
	    inverse = inverseAndProgram.program;
	  }
	
	  if (inverted) {
	    inverted = inverse;
	    inverse = program;
	    program = inverted;
	  }
	
	  return new this.BlockStatement(openBlock.path, openBlock.params, openBlock.hash, program, inverse, openBlock.strip, inverseStrip, close && close.strip, this.locInfo(locInfo));
	}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	exports.Compiler = Compiler;
	exports.precompile = precompile;
	exports.compile = compile;
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	var _isArray$indexOf = __webpack_require__(70);
	
	var _AST = __webpack_require__(78);
	
	var _AST2 = _interopRequireWildcard(_AST);
	
	var slice = [].slice;
	
	function Compiler() {}
	
	// the foundHelper register will disambiguate helper lookup from finding a
	// function in a context. This is necessary for mustache compatibility, which
	// requires that context functions in blocks are evaluated by blockHelperMissing,
	// and then proceed as if the resulting value was provided to blockHelperMissing.
	
	Compiler.prototype = {
	  compiler: Compiler,
	
	  equals: function equals(other) {
	    var len = this.opcodes.length;
	    if (other.opcodes.length !== len) {
	      return false;
	    }
	
	    for (var i = 0; i < len; i++) {
	      var opcode = this.opcodes[i],
	          otherOpcode = other.opcodes[i];
	      if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
	        return false;
	      }
	    }
	
	    // We know that length is the same between the two arrays because they are directly tied
	    // to the opcode behavior above.
	    len = this.children.length;
	    for (var i = 0; i < len; i++) {
	      if (!this.children[i].equals(other.children[i])) {
	        return false;
	      }
	    }
	
	    return true;
	  },
	
	  guid: 0,
	
	  compile: function compile(program, options) {
	    this.sourceNode = [];
	    this.opcodes = [];
	    this.children = [];
	    this.options = options;
	    this.stringParams = options.stringParams;
	    this.trackIds = options.trackIds;
	
	    options.blockParams = options.blockParams || [];
	
	    // These changes will propagate to the other compiler components
	    var knownHelpers = options.knownHelpers;
	    options.knownHelpers = {
	      helperMissing: true,
	      blockHelperMissing: true,
	      each: true,
	      'if': true,
	      unless: true,
	      'with': true,
	      log: true,
	      lookup: true
	    };
	    if (knownHelpers) {
	      for (var _name in knownHelpers) {
	        if (_name in knownHelpers) {
	          options.knownHelpers[_name] = knownHelpers[_name];
	        }
	      }
	    }
	
	    return this.accept(program);
	  },
	
	  compileProgram: function compileProgram(program) {
	    var childCompiler = new this.compiler(),
	        // eslint-disable-line new-cap
	    result = childCompiler.compile(program, this.options),
	        guid = this.guid++;
	
	    this.usePartial = this.usePartial || result.usePartial;
	
	    this.children[guid] = result;
	    this.useDepths = this.useDepths || result.useDepths;
	
	    return guid;
	  },
	
	  accept: function accept(node) {
	    this.sourceNode.unshift(node);
	    var ret = this[node.type](node);
	    this.sourceNode.shift();
	    return ret;
	  },
	
	  Program: function Program(program) {
	    this.options.blockParams.unshift(program.blockParams);
	
	    var body = program.body,
	        bodyLength = body.length;
	    for (var i = 0; i < bodyLength; i++) {
	      this.accept(body[i]);
	    }
	
	    this.options.blockParams.shift();
	
	    this.isSimple = bodyLength === 1;
	    this.blockParams = program.blockParams ? program.blockParams.length : 0;
	
	    return this;
	  },
	
	  BlockStatement: function BlockStatement(block) {
	    transformLiteralToPath(block);
	
	    var program = block.program,
	        inverse = block.inverse;
	
	    program = program && this.compileProgram(program);
	    inverse = inverse && this.compileProgram(inverse);
	
	    var type = this.classifySexpr(block);
	
	    if (type === 'helper') {
	      this.helperSexpr(block, program, inverse);
	    } else if (type === 'simple') {
	      this.simpleSexpr(block);
	
	      // now that the simple mustache is resolved, we need to
	      // evaluate it by executing `blockHelperMissing`
	      this.opcode('pushProgram', program);
	      this.opcode('pushProgram', inverse);
	      this.opcode('emptyHash');
	      this.opcode('blockValue', block.path.original);
	    } else {
	      this.ambiguousSexpr(block, program, inverse);
	
	      // now that the simple mustache is resolved, we need to
	      // evaluate it by executing `blockHelperMissing`
	      this.opcode('pushProgram', program);
	      this.opcode('pushProgram', inverse);
	      this.opcode('emptyHash');
	      this.opcode('ambiguousBlockValue');
	    }
	
	    this.opcode('append');
	  },
	
	  PartialStatement: function PartialStatement(partial) {
	    this.usePartial = true;
	
	    var params = partial.params;
	    if (params.length > 1) {
	      throw new _Exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
	    } else if (!params.length) {
	      params.push({ type: 'PathExpression', parts: [], depth: 0 });
	    }
	
	    var partialName = partial.name.original,
	        isDynamic = partial.name.type === 'SubExpression';
	    if (isDynamic) {
	      this.accept(partial.name);
	    }
	
	    this.setupFullMustacheParams(partial, undefined, undefined, true);
	
	    var indent = partial.indent || '';
	    if (this.options.preventIndent && indent) {
	      this.opcode('appendContent', indent);
	      indent = '';
	    }
	
	    this.opcode('invokePartial', isDynamic, partialName, indent);
	    this.opcode('append');
	  },
	
	  MustacheStatement: function MustacheStatement(mustache) {
	    this.SubExpression(mustache); // eslint-disable-line new-cap
	
	    if (mustache.escaped && !this.options.noEscape) {
	      this.opcode('appendEscaped');
	    } else {
	      this.opcode('append');
	    }
	  },
	
	  ContentStatement: function ContentStatement(content) {
	    if (content.value) {
	      this.opcode('appendContent', content.value);
	    }
	  },
	
	  CommentStatement: function CommentStatement() {},
	
	  SubExpression: function SubExpression(sexpr) {
	    transformLiteralToPath(sexpr);
	    var type = this.classifySexpr(sexpr);
	
	    if (type === 'simple') {
	      this.simpleSexpr(sexpr);
	    } else if (type === 'helper') {
	      this.helperSexpr(sexpr);
	    } else {
	      this.ambiguousSexpr(sexpr);
	    }
	  },
	  ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
	    var path = sexpr.path,
	        name = path.parts[0],
	        isBlock = program != null || inverse != null;
	
	    this.opcode('getContext', path.depth);
	
	    this.opcode('pushProgram', program);
	    this.opcode('pushProgram', inverse);
	
	    this.accept(path);
	
	    this.opcode('invokeAmbiguous', name, isBlock);
	  },
	
	  simpleSexpr: function simpleSexpr(sexpr) {
	    this.accept(sexpr.path);
	    this.opcode('resolvePossibleLambda');
	  },
	
	  helperSexpr: function helperSexpr(sexpr, program, inverse) {
	    var params = this.setupFullMustacheParams(sexpr, program, inverse),
	        path = sexpr.path,
	        name = path.parts[0];
	
	    if (this.options.knownHelpers[name]) {
	      this.opcode('invokeKnownHelper', params.length, name);
	    } else if (this.options.knownHelpersOnly) {
	      throw new _Exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
	    } else {
	      path.falsy = true;
	
	      this.accept(path);
	      this.opcode('invokeHelper', params.length, path.original, _AST2['default'].helpers.simpleId(path));
	    }
	  },
	
	  PathExpression: function PathExpression(path) {
	    this.addDepth(path.depth);
	    this.opcode('getContext', path.depth);
	
	    var name = path.parts[0],
	        scoped = _AST2['default'].helpers.scopedId(path),
	        blockParamId = !path.depth && !scoped && this.blockParamIndex(name);
	
	    if (blockParamId) {
	      this.opcode('lookupBlockParam', blockParamId, path.parts);
	    } else if (!name) {
	      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
	      this.opcode('pushContext');
	    } else if (path.data) {
	      this.options.data = true;
	      this.opcode('lookupData', path.depth, path.parts);
	    } else {
	      this.opcode('lookupOnContext', path.parts, path.falsy, scoped);
	    }
	  },
	
	  StringLiteral: function StringLiteral(string) {
	    this.opcode('pushString', string.value);
	  },
	
	  NumberLiteral: function NumberLiteral(number) {
	    this.opcode('pushLiteral', number.value);
	  },
	
	  BooleanLiteral: function BooleanLiteral(bool) {
	    this.opcode('pushLiteral', bool.value);
	  },
	
	  UndefinedLiteral: function UndefinedLiteral() {
	    this.opcode('pushLiteral', 'undefined');
	  },
	
	  NullLiteral: function NullLiteral() {
	    this.opcode('pushLiteral', 'null');
	  },
	
	  Hash: function Hash(hash) {
	    var pairs = hash.pairs,
	        i = 0,
	        l = pairs.length;
	
	    this.opcode('pushHash');
	
	    for (; i < l; i++) {
	      this.pushParam(pairs[i].value);
	    }
	    while (i--) {
	      this.opcode('assignToHash', pairs[i].key);
	    }
	    this.opcode('popHash');
	  },
	
	  // HELPERS
	  opcode: function opcode(name) {
	    this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
	  },
	
	  addDepth: function addDepth(depth) {
	    if (!depth) {
	      return;
	    }
	
	    this.useDepths = true;
	  },
	
	  classifySexpr: function classifySexpr(sexpr) {
	    var isSimple = _AST2['default'].helpers.simpleId(sexpr.path);
	
	    var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);
	
	    // a mustache is an eligible helper if:
	    // * its id is simple (a single part, not `this` or `..`)
	    var isHelper = !isBlockParam && _AST2['default'].helpers.helperExpression(sexpr);
	
	    // if a mustache is an eligible helper but not a definite
	    // helper, it is ambiguous, and will be resolved in a later
	    // pass or at runtime.
	    var isEligible = !isBlockParam && (isHelper || isSimple);
	
	    // if ambiguous, we can possibly resolve the ambiguity now
	    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
	    if (isEligible && !isHelper) {
	      var _name2 = sexpr.path.parts[0],
	          options = this.options;
	
	      if (options.knownHelpers[_name2]) {
	        isHelper = true;
	      } else if (options.knownHelpersOnly) {
	        isEligible = false;
	      }
	    }
	
	    if (isHelper) {
	      return 'helper';
	    } else if (isEligible) {
	      return 'ambiguous';
	    } else {
	      return 'simple';
	    }
	  },
	
	  pushParams: function pushParams(params) {
	    for (var i = 0, l = params.length; i < l; i++) {
	      this.pushParam(params[i]);
	    }
	  },
	
	  pushParam: function pushParam(val) {
	    var value = val.value != null ? val.value : val.original || '';
	
	    if (this.stringParams) {
	      if (value.replace) {
	        value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
	      }
	
	      if (val.depth) {
	        this.addDepth(val.depth);
	      }
	      this.opcode('getContext', val.depth || 0);
	      this.opcode('pushStringParam', value, val.type);
	
	      if (val.type === 'SubExpression') {
	        // SubExpressions get evaluated and passed in
	        // in string params mode.
	        this.accept(val);
	      }
	    } else {
	      if (this.trackIds) {
	        var blockParamIndex = undefined;
	        if (val.parts && !_AST2['default'].helpers.scopedId(val) && !val.depth) {
	          blockParamIndex = this.blockParamIndex(val.parts[0]);
	        }
	        if (blockParamIndex) {
	          var blockParamChild = val.parts.slice(1).join('.');
	          this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
	        } else {
	          value = val.original || value;
	          if (value.replace) {
	            value = value.replace(/^\.\//g, '').replace(/^\.$/g, '');
	          }
	
	          this.opcode('pushId', val.type, value);
	        }
	      }
	      this.accept(val);
	    }
	  },
	
	  setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
	    var params = sexpr.params;
	    this.pushParams(params);
	
	    this.opcode('pushProgram', program);
	    this.opcode('pushProgram', inverse);
	
	    if (sexpr.hash) {
	      this.accept(sexpr.hash);
	    } else {
	      this.opcode('emptyHash', omitEmpty);
	    }
	
	    return params;
	  },
	
	  blockParamIndex: function blockParamIndex(name) {
	    for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
	      var blockParams = this.options.blockParams[depth],
	          param = blockParams && _isArray$indexOf.indexOf(blockParams, name);
	      if (blockParams && param >= 0) {
	        return [depth, param];
	      }
	    }
	  }
	};
	
	function precompile(input, options, env) {
	  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
	    throw new _Exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
	  }
	
	  options = options || {};
	  if (!('data' in options)) {
	    options.data = true;
	  }
	  if (options.compat) {
	    options.useDepths = true;
	  }
	
	  var ast = env.parse(input, options),
	      environment = new env.Compiler().compile(ast, options);
	  return new env.JavaScriptCompiler().compile(environment, options);
	}
	
	function compile(input, _x, env) {
	  var options = arguments[1] === undefined ? {} : arguments[1];
	
	  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
	    throw new _Exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
	  }
	
	  if (!('data' in options)) {
	    options.data = true;
	  }
	  if (options.compat) {
	    options.useDepths = true;
	  }
	
	  var compiled = undefined;
	
	  function compileInput() {
	    var ast = env.parse(input, options),
	        environment = new env.Compiler().compile(ast, options),
	        templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
	    return env.template(templateSpec);
	  }
	
	  // Template is only compiled on first use and cached after that point.
	  function ret(context, execOptions) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled.call(this, context, execOptions);
	  }
	  ret._setup = function (setupOptions) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled._setup(setupOptions);
	  };
	  ret._child = function (i, data, blockParams, depths) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled._child(i, data, blockParams, depths);
	  };
	  return ret;
	}
	
	function argEquals(a, b) {
	  if (a === b) {
	    return true;
	  }
	
	  if (_isArray$indexOf.isArray(a) && _isArray$indexOf.isArray(b) && a.length === b.length) {
	    for (var i = 0; i < a.length; i++) {
	      if (!argEquals(a[i], b[i])) {
	        return false;
	      }
	    }
	    return true;
	  }
	}
	
	function transformLiteralToPath(sexpr) {
	  if (!sexpr.path.parts) {
	    var literal = sexpr.path;
	    // Casting to string here to make false and 0 literal values play nicely with the rest
	    // of the system.
	    sexpr.path = new _AST2['default'].PathExpression(false, 0, [literal.original + ''], literal.original + '', literal.loc);
	  }
	}

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	
	var _COMPILER_REVISION$REVISION_CHANGES = __webpack_require__(69);
	
	var _Exception = __webpack_require__(71);
	
	var _Exception2 = _interopRequireWildcard(_Exception);
	
	var _isArray = __webpack_require__(70);
	
	var _CodeGen = __webpack_require__(86);
	
	var _CodeGen2 = _interopRequireWildcard(_CodeGen);
	
	function Literal(value) {
	  this.value = value;
	}
	
	function JavaScriptCompiler() {}
	
	JavaScriptCompiler.prototype = {
	  // PUBLIC API: You can override these methods in a subclass to provide
	  // alternative compiled forms for name lookup and buffering semantics
	  nameLookup: function nameLookup(parent, name /* , type*/) {
	    if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
	      return [parent, '.', name];
	    } else {
	      return [parent, '[\'', name, '\']'];
	    }
	  },
	  depthedLookup: function depthedLookup(name) {
	    return [this.aliasable('this.lookup'), '(depths, "', name, '")'];
	  },
	
	  compilerInfo: function compilerInfo() {
	    var revision = _COMPILER_REVISION$REVISION_CHANGES.COMPILER_REVISION,
	        versions = _COMPILER_REVISION$REVISION_CHANGES.REVISION_CHANGES[revision];
	    return [revision, versions];
	  },
	
	  appendToBuffer: function appendToBuffer(source, location, explicit) {
	    // Force a source as this simplifies the merge logic.
	    if (!_isArray.isArray(source)) {
	      source = [source];
	    }
	    source = this.source.wrap(source, location);
	
	    if (this.environment.isSimple) {
	      return ['return ', source, ';'];
	    } else if (explicit) {
	      // This is a case where the buffer operation occurs as a child of another
	      // construct, generally braces. We have to explicitly output these buffer
	      // operations to ensure that the emitted code goes in the correct location.
	      return ['buffer += ', source, ';'];
	    } else {
	      source.appendToBuffer = true;
	      return source;
	    }
	  },
	
	  initializeBuffer: function initializeBuffer() {
	    return this.quotedString('');
	  },
	  // END PUBLIC API
	
	  compile: function compile(environment, options, context, asObject) {
	    this.environment = environment;
	    this.options = options;
	    this.stringParams = this.options.stringParams;
	    this.trackIds = this.options.trackIds;
	    this.precompile = !asObject;
	
	    this.name = this.environment.name;
	    this.isChild = !!context;
	    this.context = context || {
	      programs: [],
	      environments: []
	    };
	
	    this.preamble();
	
	    this.stackSlot = 0;
	    this.stackVars = [];
	    this.aliases = {};
	    this.registers = { list: [] };
	    this.hashes = [];
	    this.compileStack = [];
	    this.inlineStack = [];
	    this.blockParams = [];
	
	    this.compileChildren(environment, options);
	
	    this.useDepths = this.useDepths || environment.useDepths || this.options.compat;
	    this.useBlockParams = this.useBlockParams || environment.useBlockParams;
	
	    var opcodes = environment.opcodes,
	        opcode = undefined,
	        firstLoc = undefined,
	        i = undefined,
	        l = undefined;
	
	    for (i = 0, l = opcodes.length; i < l; i++) {
	      opcode = opcodes[i];
	
	      this.source.currentLocation = opcode.loc;
	      firstLoc = firstLoc || opcode.loc;
	      this[opcode.opcode].apply(this, opcode.args);
	    }
	
	    // Flush any trailing content that might be pending.
	    this.source.currentLocation = firstLoc;
	    this.pushSource('');
	
	    /* istanbul ignore next */
	    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
	      throw new _Exception2['default']('Compile completed with content left on stack');
	    }
	
	    var fn = this.createFunctionContext(asObject);
	    if (!this.isChild) {
	      var ret = {
	        compiler: this.compilerInfo(),
	        main: fn
	      };
	      var programs = this.context.programs;
	      for (i = 0, l = programs.length; i < l; i++) {
	        if (programs[i]) {
	          ret[i] = programs[i];
	        }
	      }
	
	      if (this.environment.usePartial) {
	        ret.usePartial = true;
	      }
	      if (this.options.data) {
	        ret.useData = true;
	      }
	      if (this.useDepths) {
	        ret.useDepths = true;
	      }
	      if (this.useBlockParams) {
	        ret.useBlockParams = true;
	      }
	      if (this.options.compat) {
	        ret.compat = true;
	      }
	
	      if (!asObject) {
	        ret.compiler = JSON.stringify(ret.compiler);
	
	        this.source.currentLocation = { start: { line: 1, column: 0 } };
	        ret = this.objectLiteral(ret);
	
	        if (options.srcName) {
	          ret = ret.toStringWithSourceMap({ file: options.destName });
	          ret.map = ret.map && ret.map.toString();
	        } else {
	          ret = ret.toString();
	        }
	      } else {
	        ret.compilerOptions = this.options;
	      }
	
	      return ret;
	    } else {
	      return fn;
	    }
	  },
	
	  preamble: function preamble() {
	    // track the last context pushed into place to allow skipping the
	    // getContext opcode when it would be a noop
	    this.lastContext = 0;
	    this.source = new _CodeGen2['default'](this.options.srcName);
	  },
	
	  createFunctionContext: function createFunctionContext(asObject) {
	    var varDeclarations = '';
	
	    var locals = this.stackVars.concat(this.registers.list);
	    if (locals.length > 0) {
	      varDeclarations += ', ' + locals.join(', ');
	    }
	
	    // Generate minimizer alias mappings
	    //
	    // When using true SourceNodes, this will update all references to the given alias
	    // as the source nodes are reused in situ. For the non-source node compilation mode,
	    // aliases will not be used, but this case is already being run on the client and
	    // we aren't concern about minimizing the template size.
	    var aliasCount = 0;
	    for (var alias in this.aliases) {
	      // eslint-disable-line guard-for-in
	      var node = this.aliases[alias];
	
	      if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
	        varDeclarations += ', alias' + ++aliasCount + '=' + alias;
	        node.children[0] = 'alias' + aliasCount;
	      }
	    }
	
	    var params = ['depth0', 'helpers', 'partials', 'data'];
	
	    if (this.useBlockParams || this.useDepths) {
	      params.push('blockParams');
	    }
	    if (this.useDepths) {
	      params.push('depths');
	    }
	
	    // Perform a second pass over the output to merge content when possible
	    var source = this.mergeSource(varDeclarations);
	
	    if (asObject) {
	      params.push(source);
	
	      return Function.apply(this, params);
	    } else {
	      return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
	    }
	  },
	  mergeSource: function mergeSource(varDeclarations) {
	    var isSimple = this.environment.isSimple,
	        appendOnly = !this.forceBuffer,
	        appendFirst = undefined,
	        sourceSeen = undefined,
	        bufferStart = undefined,
	        bufferEnd = undefined;
	    this.source.each(function (line) {
	      if (line.appendToBuffer) {
	        if (bufferStart) {
	          line.prepend('  + ');
	        } else {
	          bufferStart = line;
	        }
	        bufferEnd = line;
	      } else {
	        if (bufferStart) {
	          if (!sourceSeen) {
	            appendFirst = true;
	          } else {
	            bufferStart.prepend('buffer += ');
	          }
	          bufferEnd.add(';');
	          bufferStart = bufferEnd = undefined;
	        }
	
	        sourceSeen = true;
	        if (!isSimple) {
	          appendOnly = false;
	        }
	      }
	    });
	
	    if (appendOnly) {
	      if (bufferStart) {
	        bufferStart.prepend('return ');
	        bufferEnd.add(';');
	      } else if (!sourceSeen) {
	        this.source.push('return "";');
	      }
	    } else {
	      varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());
	
	      if (bufferStart) {
	        bufferStart.prepend('return buffer + ');
	        bufferEnd.add(';');
	      } else {
	        this.source.push('return buffer;');
	      }
	    }
	
	    if (varDeclarations) {
	      this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
	    }
	
	    return this.source.merge();
	  },
	
	  // [blockValue]
	  //
	  // On stack, before: hash, inverse, program, value
	  // On stack, after: return value of blockHelperMissing
	  //
	  // The purpose of this opcode is to take a block of the form
	  // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
	  // replace it on the stack with the result of properly
	  // invoking blockHelperMissing.
	  blockValue: function blockValue(name) {
	    var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
	        params = [this.contextName(0)];
	    this.setupHelperArgs(name, 0, params);
	
	    var blockName = this.popStack();
	    params.splice(1, 0, blockName);
	
	    this.push(this.source.functionCall(blockHelperMissing, 'call', params));
	  },
	
	  // [ambiguousBlockValue]
	  //
	  // On stack, before: hash, inverse, program, value
	  // Compiler value, before: lastHelper=value of last found helper, if any
	  // On stack, after, if no lastHelper: same as [blockValue]
	  // On stack, after, if lastHelper: value
	  ambiguousBlockValue: function ambiguousBlockValue() {
	    // We're being a bit cheeky and reusing the options value from the prior exec
	    var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
	        params = [this.contextName(0)];
	    this.setupHelperArgs('', 0, params, true);
	
	    this.flushInline();
	
	    var current = this.topStack();
	    params.splice(1, 0, current);
	
	    this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
	  },
	
	  // [appendContent]
	  //
	  // On stack, before: ...
	  // On stack, after: ...
	  //
	  // Appends the string value of `content` to the current buffer
	  appendContent: function appendContent(content) {
	    if (this.pendingContent) {
	      content = this.pendingContent + content;
	    } else {
	      this.pendingLocation = this.source.currentLocation;
	    }
	
	    this.pendingContent = content;
	  },
	
	  // [append]
	  //
	  // On stack, before: value, ...
	  // On stack, after: ...
	  //
	  // Coerces `value` to a String and appends it to the current buffer.
	  //
	  // If `value` is truthy, or 0, it is coerced into a string and appended
	  // Otherwise, the empty string is appended
	  append: function append() {
	    if (this.isInline()) {
	      this.replaceStack(function (current) {
	        return [' != null ? ', current, ' : ""'];
	      });
	
	      this.pushSource(this.appendToBuffer(this.popStack()));
	    } else {
	      var local = this.popStack();
	      this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
	      if (this.environment.isSimple) {
	        this.pushSource(['else { ', this.appendToBuffer('\'\'', undefined, true), ' }']);
	      }
	    }
	  },
	
	  // [appendEscaped]
	  //
	  // On stack, before: value, ...
	  // On stack, after: ...
	  //
	  // Escape `value` and append it to the buffer
	  appendEscaped: function appendEscaped() {
	    this.pushSource(this.appendToBuffer([this.aliasable('this.escapeExpression'), '(', this.popStack(), ')']));
	  },
	
	  // [getContext]
	  //
	  // On stack, before: ...
	  // On stack, after: ...
	  // Compiler value, after: lastContext=depth
	  //
	  // Set the value of the `lastContext` compiler value to the depth
	  getContext: function getContext(depth) {
	    this.lastContext = depth;
	  },
	
	  // [pushContext]
	  //
	  // On stack, before: ...
	  // On stack, after: currentContext, ...
	  //
	  // Pushes the value of the current context onto the stack.
	  pushContext: function pushContext() {
	    this.pushStackLiteral(this.contextName(this.lastContext));
	  },
	
	  // [lookupOnContext]
	  //
	  // On stack, before: ...
	  // On stack, after: currentContext[name], ...
	  //
	  // Looks up the value of `name` on the current context and pushes
	  // it onto the stack.
	  lookupOnContext: function lookupOnContext(parts, falsy, scoped) {
	    var i = 0;
	
	    if (!scoped && this.options.compat && !this.lastContext) {
	      // The depthed query is expected to handle the undefined logic for the root level that
	      // is implemented below, so we evaluate that directly in compat mode
	      this.push(this.depthedLookup(parts[i++]));
	    } else {
	      this.pushContext();
	    }
	
	    this.resolvePath('context', parts, i, falsy);
	  },
	
	  // [lookupBlockParam]
	  //
	  // On stack, before: ...
	  // On stack, after: blockParam[name], ...
	  //
	  // Looks up the value of `parts` on the given block param and pushes
	  // it onto the stack.
	  lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
	    this.useBlockParams = true;
	
	    this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
	    this.resolvePath('context', parts, 1);
	  },
	
	  // [lookupData]
	  //
	  // On stack, before: ...
	  // On stack, after: data, ...
	  //
	  // Push the data lookup operator
	  lookupData: function lookupData(depth, parts) {
	    if (!depth) {
	      this.pushStackLiteral('data');
	    } else {
	      this.pushStackLiteral('this.data(data, ' + depth + ')');
	    }
	
	    this.resolvePath('data', parts, 0, true);
	  },
	
	  resolvePath: function resolvePath(type, parts, i, falsy) {
	    var _this = this;
	
	    if (this.options.strict || this.options.assumeObjects) {
	      this.push(strictLookup(this.options.strict, this, parts, type));
	      return;
	    }
	
	    var len = parts.length;
	    for (; i < len; i++) {
	      /*eslint-disable no-loop-func */
	      this.replaceStack(function (current) {
	        var lookup = _this.nameLookup(current, parts[i], type);
	        // We want to ensure that zero and false are handled properly if the context (falsy flag)
	        // needs to have the special handling for these values.
	        if (!falsy) {
	          return [' != null ? ', lookup, ' : ', current];
	        } else {
	          // Otherwise we can use generic falsy handling
	          return [' && ', lookup];
	        }
	      });
	      /*eslint-enable no-loop-func */
	    }
	  },
	
	  // [resolvePossibleLambda]
	  //
	  // On stack, before: value, ...
	  // On stack, after: resolved value, ...
	  //
	  // If the `value` is a lambda, replace it on the stack by
	  // the return value of the lambda
	  resolvePossibleLambda: function resolvePossibleLambda() {
	    this.push([this.aliasable('this.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
	  },
	
	  // [pushStringParam]
	  //
	  // On stack, before: ...
	  // On stack, after: string, currentContext, ...
	  //
	  // This opcode is designed for use in string mode, which
	  // provides the string value of a parameter along with its
	  // depth rather than resolving it immediately.
	  pushStringParam: function pushStringParam(string, type) {
	    this.pushContext();
	    this.pushString(type);
	
	    // If it's a subexpression, the string result
	    // will be pushed after this opcode.
	    if (type !== 'SubExpression') {
	      if (typeof string === 'string') {
	        this.pushString(string);
	      } else {
	        this.pushStackLiteral(string);
	      }
	    }
	  },
	
	  emptyHash: function emptyHash(omitEmpty) {
	    if (this.trackIds) {
	      this.push('{}'); // hashIds
	    }
	    if (this.stringParams) {
	      this.push('{}'); // hashContexts
	      this.push('{}'); // hashTypes
	    }
	    this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
	  },
	  pushHash: function pushHash() {
	    if (this.hash) {
	      this.hashes.push(this.hash);
	    }
	    this.hash = { values: [], types: [], contexts: [], ids: [] };
	  },
	  popHash: function popHash() {
	    var hash = this.hash;
	    this.hash = this.hashes.pop();
	
	    if (this.trackIds) {
	      this.push(this.objectLiteral(hash.ids));
	    }
	    if (this.stringParams) {
	      this.push(this.objectLiteral(hash.contexts));
	      this.push(this.objectLiteral(hash.types));
	    }
	
	    this.push(this.objectLiteral(hash.values));
	  },
	
	  // [pushString]
	  //
	  // On stack, before: ...
	  // On stack, after: quotedString(string), ...
	  //
	  // Push a quoted version of `string` onto the stack
	  pushString: function pushString(string) {
	    this.pushStackLiteral(this.quotedString(string));
	  },
	
	  // [pushLiteral]
	  //
	  // On stack, before: ...
	  // On stack, after: value, ...
	  //
	  // Pushes a value onto the stack. This operation prevents
	  // the compiler from creating a temporary variable to hold
	  // it.
	  pushLiteral: function pushLiteral(value) {
	    this.pushStackLiteral(value);
	  },
	
	  // [pushProgram]
	  //
	  // On stack, before: ...
	  // On stack, after: program(guid), ...
	  //
	  // Push a program expression onto the stack. This takes
	  // a compile-time guid and converts it into a runtime-accessible
	  // expression.
	  pushProgram: function pushProgram(guid) {
	    if (guid != null) {
	      this.pushStackLiteral(this.programExpression(guid));
	    } else {
	      this.pushStackLiteral(null);
	    }
	  },
	
	  // [invokeHelper]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of helper invocation
	  //
	  // Pops off the helper's parameters, invokes the helper,
	  // and pushes the helper's return value onto the stack.
	  //
	  // If the helper is not found, `helperMissing` is called.
	  invokeHelper: function invokeHelper(paramSize, name, isSimple) {
	    var nonHelper = this.popStack(),
	        helper = this.setupHelper(paramSize, name),
	        simple = isSimple ? [helper.name, ' || '] : '';
	
	    var lookup = ['('].concat(simple, nonHelper);
	    if (!this.options.strict) {
	      lookup.push(' || ', this.aliasable('helpers.helperMissing'));
	    }
	    lookup.push(')');
	
	    this.push(this.source.functionCall(lookup, 'call', helper.callParams));
	  },
	
	  // [invokeKnownHelper]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of helper invocation
	  //
	  // This operation is used when the helper is known to exist,
	  // so a `helperMissing` fallback is not required.
	  invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
	    var helper = this.setupHelper(paramSize, name);
	    this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
	  },
	
	  // [invokeAmbiguous]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of disambiguation
	  //
	  // This operation is used when an expression like `{{foo}}`
	  // is provided, but we don't know at compile-time whether it
	  // is a helper or a path.
	  //
	  // This operation emits more code than the other options,
	  // and can be avoided by passing the `knownHelpers` and
	  // `knownHelpersOnly` flags at compile-time.
	  invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
	    this.useRegister('helper');
	
	    var nonHelper = this.popStack();
	
	    this.emptyHash();
	    var helper = this.setupHelper(0, name, helperCall);
	
	    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
	
	    var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
	    if (!this.options.strict) {
	      lookup[0] = '(helper = ';
	      lookup.push(' != null ? helper : ', this.aliasable('helpers.helperMissing'));
	    }
	
	    this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
	  },
	
	  // [invokePartial]
	  //
	  // On stack, before: context, ...
	  // On stack after: result of partial invocation
	  //
	  // This operation pops off a context, invokes a partial with that context,
	  // and pushes the result of the invocation back.
	  invokePartial: function invokePartial(isDynamic, name, indent) {
	    var params = [],
	        options = this.setupParams(name, 1, params, false);
	
	    if (isDynamic) {
	      name = this.popStack();
	      delete options.name;
	    }
	
	    if (indent) {
	      options.indent = JSON.stringify(indent);
	    }
	    options.helpers = 'helpers';
	    options.partials = 'partials';
	
	    if (!isDynamic) {
	      params.unshift(this.nameLookup('partials', name, 'partial'));
	    } else {
	      params.unshift(name);
	    }
	
	    if (this.options.compat) {
	      options.depths = 'depths';
	    }
	    options = this.objectLiteral(options);
	    params.push(options);
	
	    this.push(this.source.functionCall('this.invokePartial', '', params));
	  },
	
	  // [assignToHash]
	  //
	  // On stack, before: value, ..., hash, ...
	  // On stack, after: ..., hash, ...
	  //
	  // Pops a value off the stack and assigns it to the current hash
	  assignToHash: function assignToHash(key) {
	    var value = this.popStack(),
	        context = undefined,
	        type = undefined,
	        id = undefined;
	
	    if (this.trackIds) {
	      id = this.popStack();
	    }
	    if (this.stringParams) {
	      type = this.popStack();
	      context = this.popStack();
	    }
	
	    var hash = this.hash;
	    if (context) {
	      hash.contexts[key] = context;
	    }
	    if (type) {
	      hash.types[key] = type;
	    }
	    if (id) {
	      hash.ids[key] = id;
	    }
	    hash.values[key] = value;
	  },
	
	  pushId: function pushId(type, name, child) {
	    if (type === 'BlockParam') {
	      this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
	    } else if (type === 'PathExpression') {
	      this.pushString(name);
	    } else if (type === 'SubExpression') {
	      this.pushStackLiteral('true');
	    } else {
	      this.pushStackLiteral('null');
	    }
	  },
	
	  // HELPERS
	
	  compiler: JavaScriptCompiler,
	
	  compileChildren: function compileChildren(environment, options) {
	    var children = environment.children,
	        child = undefined,
	        compiler = undefined;
	
	    for (var i = 0, l = children.length; i < l; i++) {
	      child = children[i];
	      compiler = new this.compiler(); // eslint-disable-line new-cap
	
	      var index = this.matchExistingProgram(child);
	
	      if (index == null) {
	        this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
	        index = this.context.programs.length;
	        child.index = index;
	        child.name = 'program' + index;
	        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
	        this.context.environments[index] = child;
	
	        this.useDepths = this.useDepths || compiler.useDepths;
	        this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
	      } else {
	        child.index = index;
	        child.name = 'program' + index;
	
	        this.useDepths = this.useDepths || child.useDepths;
	        this.useBlockParams = this.useBlockParams || child.useBlockParams;
	      }
	    }
	  },
	  matchExistingProgram: function matchExistingProgram(child) {
	    for (var i = 0, len = this.context.environments.length; i < len; i++) {
	      var environment = this.context.environments[i];
	      if (environment && environment.equals(child)) {
	        return i;
	      }
	    }
	  },
	
	  programExpression: function programExpression(guid) {
	    var child = this.environment.children[guid],
	        programParams = [child.index, 'data', child.blockParams];
	
	    if (this.useBlockParams || this.useDepths) {
	      programParams.push('blockParams');
	    }
	    if (this.useDepths) {
	      programParams.push('depths');
	    }
	
	    return 'this.program(' + programParams.join(', ') + ')';
	  },
	
	  useRegister: function useRegister(name) {
	    if (!this.registers[name]) {
	      this.registers[name] = true;
	      this.registers.list.push(name);
	    }
	  },
	
	  push: function push(expr) {
	    if (!(expr instanceof Literal)) {
	      expr = this.source.wrap(expr);
	    }
	
	    this.inlineStack.push(expr);
	    return expr;
	  },
	
	  pushStackLiteral: function pushStackLiteral(item) {
	    this.push(new Literal(item));
	  },
	
	  pushSource: function pushSource(source) {
	    if (this.pendingContent) {
	      this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
	      this.pendingContent = undefined;
	    }
	
	    if (source) {
	      this.source.push(source);
	    }
	  },
	
	  replaceStack: function replaceStack(callback) {
	    var prefix = ['('],
	        stack = undefined,
	        createdStack = undefined,
	        usedLiteral = undefined;
	
	    /* istanbul ignore next */
	    if (!this.isInline()) {
	      throw new _Exception2['default']('replaceStack on non-inline');
	    }
	
	    // We want to merge the inline statement into the replacement statement via ','
	    var top = this.popStack(true);
	
	    if (top instanceof Literal) {
	      // Literals do not need to be inlined
	      stack = [top.value];
	      prefix = ['(', stack];
	      usedLiteral = true;
	    } else {
	      // Get or create the current stack name for use by the inline
	      createdStack = true;
	      var _name = this.incrStack();
	
	      prefix = ['((', this.push(_name), ' = ', top, ')'];
	      stack = this.topStack();
	    }
	
	    var item = callback.call(this, stack);
	
	    if (!usedLiteral) {
	      this.popStack();
	    }
	    if (createdStack) {
	      this.stackSlot--;
	    }
	    this.push(prefix.concat(item, ')'));
	  },
	
	  incrStack: function incrStack() {
	    this.stackSlot++;
	    if (this.stackSlot > this.stackVars.length) {
	      this.stackVars.push('stack' + this.stackSlot);
	    }
	    return this.topStackName();
	  },
	  topStackName: function topStackName() {
	    return 'stack' + this.stackSlot;
	  },
	  flushInline: function flushInline() {
	    var inlineStack = this.inlineStack;
	    this.inlineStack = [];
	    for (var i = 0, len = inlineStack.length; i < len; i++) {
	      var entry = inlineStack[i];
	      /* istanbul ignore if */
	      if (entry instanceof Literal) {
	        this.compileStack.push(entry);
	      } else {
	        var stack = this.incrStack();
	        this.pushSource([stack, ' = ', entry, ';']);
	        this.compileStack.push(stack);
	      }
	    }
	  },
	  isInline: function isInline() {
	    return this.inlineStack.length;
	  },
	
	  popStack: function popStack(wrapped) {
	    var inline = this.isInline(),
	        item = (inline ? this.inlineStack : this.compileStack).pop();
	
	    if (!wrapped && item instanceof Literal) {
	      return item.value;
	    } else {
	      if (!inline) {
	        /* istanbul ignore next */
	        if (!this.stackSlot) {
	          throw new _Exception2['default']('Invalid stack pop');
	        }
	        this.stackSlot--;
	      }
	      return item;
	    }
	  },
	
	  topStack: function topStack() {
	    var stack = this.isInline() ? this.inlineStack : this.compileStack,
	        item = stack[stack.length - 1];
	
	    /* istanbul ignore if */
	    if (item instanceof Literal) {
	      return item.value;
	    } else {
	      return item;
	    }
	  },
	
	  contextName: function contextName(context) {
	    if (this.useDepths && context) {
	      return 'depths[' + context + ']';
	    } else {
	      return 'depth' + context;
	    }
	  },
	
	  quotedString: function quotedString(str) {
	    return this.source.quotedString(str);
	  },
	
	  objectLiteral: function objectLiteral(obj) {
	    return this.source.objectLiteral(obj);
	  },
	
	  aliasable: function aliasable(name) {
	    var ret = this.aliases[name];
	    if (ret) {
	      ret.referenceCount++;
	      return ret;
	    }
	
	    ret = this.aliases[name] = this.source.wrap(name);
	    ret.aliasable = true;
	    ret.referenceCount = 1;
	
	    return ret;
	  },
	
	  setupHelper: function setupHelper(paramSize, name, blockHelper) {
	    var params = [],
	        paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
	    var foundHelper = this.nameLookup('helpers', name, 'helper');
	
	    return {
	      params: params,
	      paramsInit: paramsInit,
	      name: foundHelper,
	      callParams: [this.contextName(0)].concat(params)
	    };
	  },
	
	  setupParams: function setupParams(helper, paramSize, params) {
	    var options = {},
	        contexts = [],
	        types = [],
	        ids = [],
	        param = undefined;
	
	    options.name = this.quotedString(helper);
	    options.hash = this.popStack();
	
	    if (this.trackIds) {
	      options.hashIds = this.popStack();
	    }
	    if (this.stringParams) {
	      options.hashTypes = this.popStack();
	      options.hashContexts = this.popStack();
	    }
	
	    var inverse = this.popStack(),
	        program = this.popStack();
	
	    // Avoid setting fn and inverse if neither are set. This allows
	    // helpers to do a check for `if (options.fn)`
	    if (program || inverse) {
	      options.fn = program || 'this.noop';
	      options.inverse = inverse || 'this.noop';
	    }
	
	    // The parameters go on to the stack in order (making sure that they are evaluated in order)
	    // so we need to pop them off the stack in reverse order
	    var i = paramSize;
	    while (i--) {
	      param = this.popStack();
	      params[i] = param;
	
	      if (this.trackIds) {
	        ids[i] = this.popStack();
	      }
	      if (this.stringParams) {
	        types[i] = this.popStack();
	        contexts[i] = this.popStack();
	      }
	    }
	
	    if (this.trackIds) {
	      options.ids = this.source.generateArray(ids);
	    }
	    if (this.stringParams) {
	      options.types = this.source.generateArray(types);
	      options.contexts = this.source.generateArray(contexts);
	    }
	
	    if (this.options.data) {
	      options.data = 'data';
	    }
	    if (this.useBlockParams) {
	      options.blockParams = 'blockParams';
	    }
	    return options;
	  },
	
	  setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
	    var options = this.setupParams(helper, paramSize, params, true);
	    options = this.objectLiteral(options);
	    if (useRegister) {
	      this.useRegister('options');
	      params.push('options');
	      return ['options=', options];
	    } else {
	      params.push(options);
	      return '';
	    }
	  }
	};
	
	(function () {
	  var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');
	
	  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
	
	  for (var i = 0, l = reservedWords.length; i < l; i++) {
	    compilerWords[reservedWords[i]] = true;
	  }
	})();
	
	JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
	  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
	};
	
	function strictLookup(requireTerminal, compiler, parts, type) {
	  var stack = compiler.popStack(),
	      i = 0,
	      len = parts.length;
	  if (requireTerminal) {
	    len--;
	  }
	
	  for (; i < len; i++) {
	    stack = compiler.nameLookup(stack, parts[i], type);
	  }
	
	  if (requireTerminal) {
	    return [compiler.aliasable('this.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ')'];
	  } else {
	    return stack;
	  }
	}
	
	exports['default'] = JavaScriptCompiler;
	module.exports = exports['default'];

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	/*global define */
	
	var _isArray = __webpack_require__(70);
	
	var SourceNode = undefined;
	
	try {
	  /* istanbul ignore next */
	  if (false) {
	    // We don't support this in AMD environments. For these environments, we asusme that
	    // they are running on the browser and thus have no need for the source-map library.
	    var SourceMap = require('source-map');
	    SourceNode = SourceMap.SourceNode;
	  }
	} catch (err) {}
	
	/* istanbul ignore if: tested but not covered in istanbul due to dist build  */
	if (!SourceNode) {
	  SourceNode = function (line, column, srcFile, chunks) {
	    this.src = '';
	    if (chunks) {
	      this.add(chunks);
	    }
	  };
	  /* istanbul ignore next */
	  SourceNode.prototype = {
	    add: function add(chunks) {
	      if (_isArray.isArray(chunks)) {
	        chunks = chunks.join('');
	      }
	      this.src += chunks;
	    },
	    prepend: function prepend(chunks) {
	      if (_isArray.isArray(chunks)) {
	        chunks = chunks.join('');
	      }
	      this.src = chunks + this.src;
	    },
	    toStringWithSourceMap: function toStringWithSourceMap() {
	      return { code: this.toString() };
	    },
	    toString: function toString() {
	      return this.src;
	    }
	  };
	}
	
	function castChunk(chunk, codeGen, loc) {
	  if (_isArray.isArray(chunk)) {
	    var ret = [];
	
	    for (var i = 0, len = chunk.length; i < len; i++) {
	      ret.push(codeGen.wrap(chunk[i], loc));
	    }
	    return ret;
	  } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
	    // Handle primitives that the SourceNode will throw up on
	    return chunk + '';
	  }
	  return chunk;
	}
	
	function CodeGen(srcFile) {
	  this.srcFile = srcFile;
	  this.source = [];
	}
	
	CodeGen.prototype = {
	  prepend: function prepend(source, loc) {
	    this.source.unshift(this.wrap(source, loc));
	  },
	  push: function push(source, loc) {
	    this.source.push(this.wrap(source, loc));
	  },
	
	  merge: function merge() {
	    var source = this.empty();
	    this.each(function (line) {
	      source.add(['  ', line, '\n']);
	    });
	    return source;
	  },
	
	  each: function each(iter) {
	    for (var i = 0, len = this.source.length; i < len; i++) {
	      iter(this.source[i]);
	    }
	  },
	
	  empty: function empty() {
	    var loc = arguments[0] === undefined ? this.currentLocation || { start: {} } : arguments[0];
	
	    return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
	  },
	  wrap: function wrap(chunk) {
	    var loc = arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];
	
	    if (chunk instanceof SourceNode) {
	      return chunk;
	    }
	
	    chunk = castChunk(chunk, this, loc);
	
	    return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
	  },
	
	  functionCall: function functionCall(fn, type, params) {
	    params = this.generateList(params);
	    return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
	  },
	
	  quotedString: function quotedString(str) {
	    return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
	    .replace(/\u2029/g, '\\u2029') + '"';
	  },
	
	  objectLiteral: function objectLiteral(obj) {
	    var pairs = [];
	
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        var value = castChunk(obj[key], this);
	        if (value !== 'undefined') {
	          pairs.push([this.quotedString(key), ':', value]);
	        }
	      }
	    }
	
	    var ret = this.generateList(pairs);
	    ret.prepend('{');
	    ret.add('}');
	    return ret;
	  },
	
	  generateList: function generateList(entries, loc) {
	    var ret = this.empty(loc);
	
	    for (var i = 0, len = entries.length; i < len; i++) {
	      if (i) {
	        ret.add(',');
	      }
	
	      ret.add(castChunk(entries[i], this, loc));
	    }
	
	    return ret;
	  },
	
	  generateArray: function generateArray(entries, loc) {
	    var ret = this.generateList(entries, loc);
	    ret.prepend('[');
	    ret.add(']');
	
	    return ret;
	  }
	};
	
	exports['default'] = CodeGen;
	module.exports = exports['default'];
	
	/* NOP */

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	exports.__esModule = true;
	exports.print = print;
	exports.PrintVisitor = PrintVisitor;
	/*eslint-disable new-cap */
	
	var _Visitor = __webpack_require__(82);
	
	var _Visitor2 = _interopRequireWildcard(_Visitor);
	
	function print(ast) {
	  return new PrintVisitor().accept(ast);
	}
	
	function PrintVisitor() {
	  this.padding = 0;
	}
	
	PrintVisitor.prototype = new _Visitor2['default']();
	
	PrintVisitor.prototype.pad = function (string) {
	  var out = '';
	
	  for (var i = 0, l = this.padding; i < l; i++) {
	    out = out + '  ';
	  }
	
	  out = out + string + '\n';
	  return out;
	};
	
	PrintVisitor.prototype.Program = function (program) {
	  var out = '',
	      body = program.body,
	      i = undefined,
	      l = undefined;
	
	  if (program.blockParams) {
	    var blockParams = 'BLOCK PARAMS: [';
	    for (i = 0, l = program.blockParams.length; i < l; i++) {
	      blockParams += ' ' + program.blockParams[i];
	    }
	    blockParams += ' ]';
	    out += this.pad(blockParams);
	  }
	
	  for (i = 0, l = body.length; i < l; i++) {
	    out = out + this.accept(body[i]);
	  }
	
	  this.padding--;
	
	  return out;
	};
	
	PrintVisitor.prototype.MustacheStatement = function (mustache) {
	  return this.pad('{{ ' + this.SubExpression(mustache) + ' }}');
	};
	
	PrintVisitor.prototype.BlockStatement = function (block) {
	  var out = '';
	
	  out = out + this.pad('BLOCK:');
	  this.padding++;
	  out = out + this.pad(this.SubExpression(block));
	  if (block.program) {
	    out = out + this.pad('PROGRAM:');
	    this.padding++;
	    out = out + this.accept(block.program);
	    this.padding--;
	  }
	  if (block.inverse) {
	    if (block.program) {
	      this.padding++;
	    }
	    out = out + this.pad('{{^}}');
	    this.padding++;
	    out = out + this.accept(block.inverse);
	    this.padding--;
	    if (block.program) {
	      this.padding--;
	    }
	  }
	  this.padding--;
	
	  return out;
	};
	
	PrintVisitor.prototype.PartialStatement = function (partial) {
	  var content = 'PARTIAL:' + partial.name.original;
	  if (partial.params[0]) {
	    content += ' ' + this.accept(partial.params[0]);
	  }
	  if (partial.hash) {
	    content += ' ' + this.accept(partial.hash);
	  }
	  return this.pad('{{> ' + content + ' }}');
	};
	
	PrintVisitor.prototype.ContentStatement = function (content) {
	  return this.pad('CONTENT[ \'' + content.value + '\' ]');
	};
	
	PrintVisitor.prototype.CommentStatement = function (comment) {
	  return this.pad('{{! \'' + comment.value + '\' }}');
	};
	
	PrintVisitor.prototype.SubExpression = function (sexpr) {
	  var params = sexpr.params,
	      paramStrings = [],
	      hash = undefined;
	
	  for (var i = 0, l = params.length; i < l; i++) {
	    paramStrings.push(this.accept(params[i]));
	  }
	
	  params = '[' + paramStrings.join(', ') + ']';
	
	  hash = sexpr.hash ? ' ' + this.accept(sexpr.hash) : '';
	
	  return this.accept(sexpr.path) + ' ' + params + hash;
	};
	
	PrintVisitor.prototype.PathExpression = function (id) {
	  var path = id.parts.join('/');
	  return (id.data ? '@' : '') + 'PATH:' + path;
	};
	
	PrintVisitor.prototype.StringLiteral = function (string) {
	  return '"' + string.value + '"';
	};
	
	PrintVisitor.prototype.NumberLiteral = function (number) {
	  return 'NUMBER{' + number.value + '}';
	};
	
	PrintVisitor.prototype.BooleanLiteral = function (bool) {
	  return 'BOOLEAN{' + bool.value + '}';
	};
	
	PrintVisitor.prototype.UndefinedLiteral = function () {
	  return 'UNDEFINED';
	};
	
	PrintVisitor.prototype.NullLiteral = function () {
	  return 'NULL';
	};
	
	PrintVisitor.prototype.Hash = function (hash) {
	  var pairs = hash.pairs,
	      joinedPairs = [];
	
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    joinedPairs.push(this.accept(pairs[i]));
	  }
	
	  return 'HASH{' + joinedPairs.join(', ') + '}';
	};
	PrintVisitor.prototype.HashPair = function (pair) {
	  return pair.key + '=' + this.accept(pair.value);
	};
	/*eslint-enable new-cap */

/***/ },
/* 88 */
/***/ function(module, exports) {



/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(90);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(92)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./quill.core.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./quill.core.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(91)();
	// imports
	
	
	// module
	exports.push([module.id, "/*!\n * Quill Editor v1.0.0\n * https://quilljs.com/\n * Copyright (c) 2014, Jason Chen\n * Copyright (c) 2013, salesforce.com\n */\n.ql-container {\n  box-sizing: border-box;\n  font-family: Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  height: 100%;\n  margin: 0px;\n  position: relative;\n}\n.ql-clipboard {\n  left: -100000px;\n  height: 1px;\n  overflow-y: hidden;\n  position: absolute;\n  top: 50%;\n}\n.ql-clipboard p {\n  margin: 0;\n  padding: 0;\n}\n.ql-editor {\n  box-sizing: border-box;\n  cursor: text;\n  line-height: 1.42;\n  height: 100%;\n  outline: none;\n  overflow-y: auto;\n  padding: 12px 15px;\n  tab-size: 4;\n  -moz-tab-size: 4;\n  text-align: left;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n.ql-editor p,\n.ql-editor ol,\n.ql-editor ul,\n.ql-editor pre,\n.ql-editor blockquote,\n.ql-editor h1,\n.ql-editor h2,\n.ql-editor h3,\n.ql-editor h4,\n.ql-editor h5,\n.ql-editor h6 {\n  margin: 0;\n  padding: 0;\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol,\n.ql-editor ul {\n  padding-left: 1.5em;\n}\n.ql-editor ol > li,\n.ql-editor ul > li {\n  list-style-type: none;\n}\n.ql-editor ul > li::before {\n  content: '\\25CF';\n}\n.ql-editor li::before {\n  display: inline-block;\n  margin-right: 0.3em;\n  text-align: right;\n  white-space: nowrap;\n  width: 1.2em;\n}\n.ql-editor li:not(.ql-direction-rtl)::before {\n  margin-left: -1.5em;\n}\n.ql-editor ol li,\n.ql-editor ul li {\n  padding-left: 1.5em;\n}\n.ql-editor ol li {\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n  counter-increment: list-num;\n}\n.ql-editor ol li:before {\n  content: counter(list-num, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-1 {\n  counter-increment: list-1;\n}\n.ql-editor ol li.ql-indent-1:before {\n  content: counter(list-1, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-1 {\n  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-2 {\n  counter-increment: list-2;\n}\n.ql-editor ol li.ql-indent-2:before {\n  content: counter(list-2, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-2 {\n  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-3 {\n  counter-increment: list-3;\n}\n.ql-editor ol li.ql-indent-3:before {\n  content: counter(list-3, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-3 {\n  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-4 {\n  counter-increment: list-4;\n}\n.ql-editor ol li.ql-indent-4:before {\n  content: counter(list-4, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-4 {\n  counter-reset: list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-5 {\n  counter-increment: list-5;\n}\n.ql-editor ol li.ql-indent-5:before {\n  content: counter(list-5, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-5 {\n  counter-reset: list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-6 {\n  counter-increment: list-6;\n}\n.ql-editor ol li.ql-indent-6:before {\n  content: counter(list-6, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-6 {\n  counter-reset: list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-7 {\n  counter-increment: list-7;\n}\n.ql-editor ol li.ql-indent-7:before {\n  content: counter(list-7, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-7 {\n  counter-reset: list-8 list-9;\n}\n.ql-editor ol li.ql-indent-8 {\n  counter-increment: list-8;\n}\n.ql-editor ol li.ql-indent-8:before {\n  content: counter(list-8, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-8 {\n  counter-reset: list-9;\n}\n.ql-editor ol li.ql-indent-9 {\n  counter-increment: list-9;\n}\n.ql-editor ol li.ql-indent-9:before {\n  content: counter(list-9, decimal) '. ';\n}\n.ql-editor .ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 3em;\n}\n.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 4.5em;\n}\n.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 3em;\n}\n.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 4.5em;\n}\n.ql-editor .ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 6em;\n}\n.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 7.5em;\n}\n.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 6em;\n}\n.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 7.5em;\n}\n.ql-editor .ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 9em;\n}\n.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 10.5em;\n}\n.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 9em;\n}\n.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 10.5em;\n}\n.ql-editor .ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 12em;\n}\n.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 13.5em;\n}\n.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 12em;\n}\n.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 13.5em;\n}\n.ql-editor .ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 15em;\n}\n.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 16.5em;\n}\n.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 15em;\n}\n.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 16.5em;\n}\n.ql-editor .ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 18em;\n}\n.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 19.5em;\n}\n.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 18em;\n}\n.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 19.5em;\n}\n.ql-editor .ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 21em;\n}\n.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 22.5em;\n}\n.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 21em;\n}\n.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 22.5em;\n}\n.ql-editor .ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 24em;\n}\n.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 25.5em;\n}\n.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 24em;\n}\n.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 25.5em;\n}\n.ql-editor .ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 27em;\n}\n.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 28.5em;\n}\n.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 27em;\n}\n.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 28.5em;\n}\n.ql-editor .ql-video {\n  display: block;\n  max-width: 100%;\n}\n.ql-editor .ql-video.ql-align-center {\n  margin: 0 auto;\n}\n.ql-editor .ql-video.ql-align-right {\n  margin: 0 0 0 auto;\n}\n.ql-editor .ql-bg-black {\n  background-color: #000;\n}\n.ql-editor .ql-bg-red {\n  background-color: #e60000;\n}\n.ql-editor .ql-bg-orange {\n  background-color: #f90;\n}\n.ql-editor .ql-bg-yellow {\n  background-color: #ff0;\n}\n.ql-editor .ql-bg-green {\n  background-color: #008a00;\n}\n.ql-editor .ql-bg-blue {\n  background-color: #06c;\n}\n.ql-editor .ql-bg-purple {\n  background-color: #93f;\n}\n.ql-editor .ql-color-white {\n  color: #fff;\n}\n.ql-editor .ql-color-red {\n  color: #e60000;\n}\n.ql-editor .ql-color-orange {\n  color: #f90;\n}\n.ql-editor .ql-color-yellow {\n  color: #ff0;\n}\n.ql-editor .ql-color-green {\n  color: #008a00;\n}\n.ql-editor .ql-color-blue {\n  color: #06c;\n}\n.ql-editor .ql-color-purple {\n  color: #93f;\n}\n.ql-editor .ql-font-serif {\n  font-family: Georgia, Times New Roman, serif;\n}\n.ql-editor .ql-font-monospace {\n  font-family: Monaco, Courier New, monospace;\n}\n.ql-editor .ql-size-small {\n  font-size: 0.75em;\n}\n.ql-editor .ql-size-large {\n  font-size: 1.5em;\n}\n.ql-editor .ql-size-huge {\n  font-size: 2.5em;\n}\n.ql-editor .ql-direction-rtl {\n  direction: rtl;\n  text-align: inherit;\n}\n.ql-editor .ql-align-center {\n  text-align: center;\n}\n.ql-editor .ql-align-justify {\n  text-align: justify;\n}\n.ql-editor .ql-align-right {\n  text-align: right;\n}\n.ql-editor.ql-blank::before {\n  color: rgba(0,0,0,0.6);\n  content: attr(data-placeholder);\n  font-style: italic;\n  pointer-events: none;\n  position: absolute;\n}\n", ""]);
	
	// exports


/***/ },
/* 91 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(94);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(92)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./quill.snow.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./quill.snow.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(91)();
	// imports
	
	
	// module
	exports.push([module.id, "/*!\n * Quill Editor v1.0.0\n * https://quilljs.com/\n * Copyright (c) 2014, Jason Chen\n * Copyright (c) 2013, salesforce.com\n */\n.ql-container {\n  box-sizing: border-box;\n  font-family: Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  height: 100%;\n  margin: 0px;\n  position: relative;\n}\n.ql-clipboard {\n  left: -100000px;\n  height: 1px;\n  overflow-y: hidden;\n  position: absolute;\n  top: 50%;\n}\n.ql-clipboard p {\n  margin: 0;\n  padding: 0;\n}\n.ql-editor {\n  box-sizing: border-box;\n  cursor: text;\n  line-height: 1.42;\n  height: 100%;\n  outline: none;\n  overflow-y: auto;\n  padding: 12px 15px;\n  tab-size: 4;\n  -moz-tab-size: 4;\n  text-align: left;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n.ql-editor p,\n.ql-editor ol,\n.ql-editor ul,\n.ql-editor pre,\n.ql-editor blockquote,\n.ql-editor h1,\n.ql-editor h2,\n.ql-editor h3,\n.ql-editor h4,\n.ql-editor h5,\n.ql-editor h6 {\n  margin: 0;\n  padding: 0;\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol,\n.ql-editor ul {\n  padding-left: 1.5em;\n}\n.ql-editor ol > li,\n.ql-editor ul > li {\n  list-style-type: none;\n}\n.ql-editor ul > li::before {\n  content: '\\25CF';\n}\n.ql-editor li::before {\n  display: inline-block;\n  margin-right: 0.3em;\n  text-align: right;\n  white-space: nowrap;\n  width: 1.2em;\n}\n.ql-editor li:not(.ql-direction-rtl)::before {\n  margin-left: -1.5em;\n}\n.ql-editor ol li,\n.ql-editor ul li {\n  padding-left: 1.5em;\n}\n.ql-editor ol li {\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n  counter-increment: list-num;\n}\n.ql-editor ol li:before {\n  content: counter(list-num, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-1 {\n  counter-increment: list-1;\n}\n.ql-editor ol li.ql-indent-1:before {\n  content: counter(list-1, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-1 {\n  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-2 {\n  counter-increment: list-2;\n}\n.ql-editor ol li.ql-indent-2:before {\n  content: counter(list-2, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-2 {\n  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-3 {\n  counter-increment: list-3;\n}\n.ql-editor ol li.ql-indent-3:before {\n  content: counter(list-3, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-3 {\n  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-4 {\n  counter-increment: list-4;\n}\n.ql-editor ol li.ql-indent-4:before {\n  content: counter(list-4, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-4 {\n  counter-reset: list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-5 {\n  counter-increment: list-5;\n}\n.ql-editor ol li.ql-indent-5:before {\n  content: counter(list-5, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-5 {\n  counter-reset: list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-6 {\n  counter-increment: list-6;\n}\n.ql-editor ol li.ql-indent-6:before {\n  content: counter(list-6, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-6 {\n  counter-reset: list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-7 {\n  counter-increment: list-7;\n}\n.ql-editor ol li.ql-indent-7:before {\n  content: counter(list-7, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-7 {\n  counter-reset: list-8 list-9;\n}\n.ql-editor ol li.ql-indent-8 {\n  counter-increment: list-8;\n}\n.ql-editor ol li.ql-indent-8:before {\n  content: counter(list-8, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-8 {\n  counter-reset: list-9;\n}\n.ql-editor ol li.ql-indent-9 {\n  counter-increment: list-9;\n}\n.ql-editor ol li.ql-indent-9:before {\n  content: counter(list-9, decimal) '. ';\n}\n.ql-editor .ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 3em;\n}\n.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 4.5em;\n}\n.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 3em;\n}\n.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 4.5em;\n}\n.ql-editor .ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 6em;\n}\n.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 7.5em;\n}\n.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 6em;\n}\n.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 7.5em;\n}\n.ql-editor .ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 9em;\n}\n.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 10.5em;\n}\n.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 9em;\n}\n.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 10.5em;\n}\n.ql-editor .ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 12em;\n}\n.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 13.5em;\n}\n.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 12em;\n}\n.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 13.5em;\n}\n.ql-editor .ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 15em;\n}\n.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 16.5em;\n}\n.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 15em;\n}\n.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 16.5em;\n}\n.ql-editor .ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 18em;\n}\n.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 19.5em;\n}\n.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 18em;\n}\n.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 19.5em;\n}\n.ql-editor .ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 21em;\n}\n.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 22.5em;\n}\n.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 21em;\n}\n.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 22.5em;\n}\n.ql-editor .ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 24em;\n}\n.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 25.5em;\n}\n.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 24em;\n}\n.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 25.5em;\n}\n.ql-editor .ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 27em;\n}\n.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 28.5em;\n}\n.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 27em;\n}\n.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 28.5em;\n}\n.ql-editor .ql-video {\n  display: block;\n  max-width: 100%;\n}\n.ql-editor .ql-video.ql-align-center {\n  margin: 0 auto;\n}\n.ql-editor .ql-video.ql-align-right {\n  margin: 0 0 0 auto;\n}\n.ql-editor .ql-bg-black {\n  background-color: #000;\n}\n.ql-editor .ql-bg-red {\n  background-color: #e60000;\n}\n.ql-editor .ql-bg-orange {\n  background-color: #f90;\n}\n.ql-editor .ql-bg-yellow {\n  background-color: #ff0;\n}\n.ql-editor .ql-bg-green {\n  background-color: #008a00;\n}\n.ql-editor .ql-bg-blue {\n  background-color: #06c;\n}\n.ql-editor .ql-bg-purple {\n  background-color: #93f;\n}\n.ql-editor .ql-color-white {\n  color: #fff;\n}\n.ql-editor .ql-color-red {\n  color: #e60000;\n}\n.ql-editor .ql-color-orange {\n  color: #f90;\n}\n.ql-editor .ql-color-yellow {\n  color: #ff0;\n}\n.ql-editor .ql-color-green {\n  color: #008a00;\n}\n.ql-editor .ql-color-blue {\n  color: #06c;\n}\n.ql-editor .ql-color-purple {\n  color: #93f;\n}\n.ql-editor .ql-font-serif {\n  font-family: Georgia, Times New Roman, serif;\n}\n.ql-editor .ql-font-monospace {\n  font-family: Monaco, Courier New, monospace;\n}\n.ql-editor .ql-size-small {\n  font-size: 0.75em;\n}\n.ql-editor .ql-size-large {\n  font-size: 1.5em;\n}\n.ql-editor .ql-size-huge {\n  font-size: 2.5em;\n}\n.ql-editor .ql-direction-rtl {\n  direction: rtl;\n  text-align: inherit;\n}\n.ql-editor .ql-align-center {\n  text-align: center;\n}\n.ql-editor .ql-align-justify {\n  text-align: justify;\n}\n.ql-editor .ql-align-right {\n  text-align: right;\n}\n.ql-editor.ql-blank::before {\n  color: rgba(0,0,0,0.6);\n  content: attr(data-placeholder);\n  font-style: italic;\n  pointer-events: none;\n  position: absolute;\n}\n.ql-snow.ql-toolbar:after,\n.ql-snow .ql-toolbar:after {\n  clear: both;\n  content: '';\n  display: table;\n}\n.ql-snow.ql-toolbar button,\n.ql-snow .ql-toolbar button {\n  background: none;\n  border: none;\n  cursor: pointer;\n  display: inline-block;\n  float: left;\n  height: 24px;\n  outline: none;\n  padding: 3px 5px;\n  width: 28px;\n}\n.ql-snow.ql-toolbar button svg,\n.ql-snow .ql-toolbar button svg {\n  float: left;\n  height: 100%;\n}\n.ql-snow.ql-toolbar input.ql-image[type=file],\n.ql-snow .ql-toolbar input.ql-image[type=file] {\n  display: none;\n}\n.ql-snow.ql-toolbar button:hover,\n.ql-snow .ql-toolbar button:hover,\n.ql-snow.ql-toolbar button.ql-active,\n.ql-snow .ql-toolbar button.ql-active,\n.ql-snow.ql-toolbar .ql-picker-label:hover,\n.ql-snow .ql-toolbar .ql-picker-label:hover,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active,\n.ql-snow.ql-toolbar .ql-picker-item:hover,\n.ql-snow .ql-toolbar .ql-picker-item:hover,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected {\n  color: #06c;\n}\n.ql-snow.ql-toolbar button:hover .ql-fill,\n.ql-snow .ql-toolbar button:hover .ql-fill,\n.ql-snow.ql-toolbar button.ql-active .ql-fill,\n.ql-snow .ql-toolbar button.ql-active .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,\n.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {\n  fill: #06c;\n}\n.ql-snow.ql-toolbar button:hover .ql-stroke,\n.ql-snow .ql-toolbar button:hover .ql-stroke,\n.ql-snow.ql-toolbar button.ql-active .ql-stroke,\n.ql-snow .ql-toolbar button.ql-active .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,\n.ql-snow.ql-toolbar button:hover .ql-stroke-mitter,\n.ql-snow .ql-toolbar button:hover .ql-stroke-mitter,\n.ql-snow.ql-toolbar button.ql-active .ql-stroke-mitter,\n.ql-snow .ql-toolbar button.ql-active .ql-stroke-mitter,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-mitter,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-mitter,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-mitter,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-mitter,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-mitter,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-mitter,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-mitter,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-mitter {\n  stroke: #06c;\n}\n.ql-snow {\n  box-sizing: border-box;\n}\n.ql-snow * {\n  box-sizing: border-box;\n}\n.ql-snow .ql-hidden {\n  display: none;\n}\n.ql-snow .ql-out-bottom,\n.ql-snow .ql-out-top {\n  visibility: hidden;\n}\n.ql-snow .ql-tooltip {\n  position: absolute;\n}\n.ql-snow .ql-tooltip a {\n  cursor: pointer;\n  text-decoration: none;\n}\n.ql-snow .ql-formats {\n  display: inline-block;\n  vertical-align: middle;\n}\n.ql-snow .ql-formats:after {\n  clear: both;\n  content: '';\n  display: table;\n}\n.ql-snow .ql-toolbar.snow,\n.ql-snow .ql-stroke {\n  fill: none;\n  stroke: #444;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 2;\n}\n.ql-snow .ql-stroke-mitter {\n  fill: none;\n  stroke: #444;\n  stroke-mitterlimit: 10;\n  stroke-width: 2;\n}\n.ql-snow .ql-fill,\n.ql-snow .ql-stroke.ql-fill {\n  fill: #444;\n}\n.ql-snow .ql-empty {\n  fill: none;\n}\n.ql-snow .ql-even {\n  fill-rule: evenodd;\n}\n.ql-snow .ql-thin,\n.ql-snow .ql-stroke.ql-thin {\n  stroke-width: 1;\n}\n.ql-snow .ql-transparent {\n  opacity: 0.4;\n}\n.ql-snow .ql-direction svg:last-child {\n  display: none;\n}\n.ql-snow .ql-direction.ql-active svg:last-child {\n  display: inline;\n}\n.ql-snow .ql-direction.ql-active svg:first-child {\n  display: none;\n}\n.ql-snow .ql-editor h1 {\n  font-size: 2em;\n}\n.ql-snow .ql-editor h2 {\n  font-size: 1.5em;\n}\n.ql-snow .ql-editor h3 {\n  font-size: 1.17em;\n}\n.ql-snow .ql-editor h4 {\n  font-size: 1em;\n}\n.ql-snow .ql-editor h5 {\n  font-size: 0.83em;\n}\n.ql-snow .ql-editor h6 {\n  font-size: 0.67em;\n}\n.ql-snow .ql-editor a {\n  text-decoration: underline;\n}\n.ql-snow .ql-editor blockquote {\n  border-left: 4px solid #ccc;\n  margin-bottom: 5px;\n  margin-top: 5px;\n  padding-left: 16px;\n}\n.ql-snow .ql-editor code,\n.ql-snow .ql-editor pre {\n  background-color: #f0f0f0;\n  border-radius: 3px;\n}\n.ql-snow .ql-editor pre {\n  white-space: pre-wrap;\n  margin-bottom: 5px;\n  margin-top: 5px;\n  padding: 5px 10px;\n}\n.ql-snow .ql-editor code {\n  font-size: 85%;\n  padding-bottom: 2px;\n  padding-top: 2px;\n}\n.ql-snow .ql-editor code:before,\n.ql-snow .ql-editor code:after {\n  content: \"\\A0\";\n  letter-spacing: -2px;\n}\n.ql-snow .ql-editor pre.ql-syntax {\n  background-color: #23241f;\n  color: #f8f8f2;\n  overflow: visible;\n}\n.ql-snow .ql-editor img {\n  max-width: 100%;\n}\n.ql-snow .ql-picker {\n  color: #444;\n  display: inline-block;\n  float: left;\n  font-size: 14px;\n  font-weight: 500;\n  height: 24px;\n  position: relative;\n  vertical-align: middle;\n}\n.ql-snow .ql-picker-label {\n  cursor: pointer;\n  display: inline-block;\n  height: 100%;\n  padding-left: 8px;\n  padding-right: 2px;\n  position: relative;\n  width: 100%;\n}\n.ql-snow .ql-picker-label::before {\n  display: inline-block;\n  line-height: 22px;\n}\n.ql-snow .ql-picker-options {\n  background-color: #fff;\n  display: none;\n  min-width: 100%;\n  padding: 4px 8px;\n  position: absolute;\n  white-space: nowrap;\n}\n.ql-snow .ql-picker-options .ql-picker-item {\n  cursor: pointer;\n  display: block;\n  padding-bottom: 5px;\n  padding-top: 5px;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-label {\n  color: #ccc;\n  z-index: 2;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {\n  fill: #ccc;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {\n  stroke: #ccc;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-options {\n  display: block;\n  margin-top: -1px;\n  top: 100%;\n  z-index: 1;\n}\n.ql-snow .ql-color-picker,\n.ql-snow .ql-icon-picker {\n  width: 28px;\n}\n.ql-snow .ql-color-picker .ql-picker-label,\n.ql-snow .ql-icon-picker .ql-picker-label {\n  padding: 2px 4px;\n}\n.ql-snow .ql-color-picker .ql-picker-label svg,\n.ql-snow .ql-icon-picker .ql-picker-label svg {\n  right: 4px;\n}\n.ql-snow .ql-icon-picker .ql-picker-options {\n  padding: 4px 0px;\n}\n.ql-snow .ql-icon-picker .ql-picker-item {\n  height: 24px;\n  width: 24px;\n  padding: 2px 4px;\n}\n.ql-snow .ql-color-picker .ql-picker-options {\n  padding: 3px 5px;\n  width: 152px;\n}\n.ql-snow .ql-color-picker .ql-picker-item {\n  border: 1px solid transparent;\n  float: left;\n  height: 16px;\n  margin: 2px;\n  padding: 0px;\n  width: 16px;\n}\n.ql-snow .ql-color-picker .ql-picker-item.ql-primary-color {\n  margin-bottom: toolbarPadding;\n}\n.ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {\n  position: absolute;\n  margin-top: -9px;\n  right: 0;\n  top: 50%;\n  width: 18px;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {\n  content: attr(data-label);\n}\n.ql-snow .ql-picker.ql-header {\n  width: 98px;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item::before {\n  content: 'Normal';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"1\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"1\"]::before {\n  content: 'Heading 1';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"2\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"2\"]::before {\n  content: 'Heading 2';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"3\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"3\"]::before {\n  content: 'Heading 3';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"4\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"4\"]::before {\n  content: 'Heading 4';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"5\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"5\"]::before {\n  content: 'Heading 5';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"6\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"6\"]::before {\n  content: 'Heading 6';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"1\"]::before {\n  font-size: 2em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"2\"]::before {\n  font-size: 1.5em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"3\"]::before {\n  font-size: 1.17em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"4\"]::before {\n  font-size: 1em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"5\"]::before {\n  font-size: 0.83em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"6\"]::before {\n  font-size: 0.67em;\n}\n.ql-snow .ql-picker.ql-font {\n  width: 108px;\n}\n.ql-snow .ql-picker.ql-font .ql-picker-label::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item::before {\n  content: 'Sans Serif';\n}\n.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {\n  content: 'Serif';\n}\n.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {\n  content: 'Monospace';\n}\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {\n  font-family: Georgia, Times New Roman, serif;\n}\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {\n  font-family: Monaco, Courier New, monospace;\n}\n.ql-snow .ql-picker.ql-size {\n  width: 98px;\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item::before {\n  content: 'Normal';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {\n  content: 'Small';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {\n  content: 'Large';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {\n  content: 'Huge';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {\n  font-size: 10px;\n}\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {\n  font-size: 18px;\n}\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {\n  font-size: 32px;\n}\n.ql-snow .ql-color-picker.ql-background .ql-picker-item {\n  background-color: #fff;\n}\n.ql-snow .ql-color-picker.ql-color .ql-picker-item {\n  background-color: #000;\n}\n.ql-toolbar.ql-snow {\n  border: 1px solid #ccc;\n  box-sizing: border-box;\n  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\n  padding: 8px;\n}\n.ql-toolbar.ql-snow .ql-formats {\n  margin-right: 15px;\n}\n.ql-toolbar.ql-snow .ql-picker-label {\n  border: 1px solid transparent;\n}\n.ql-toolbar.ql-snow .ql-picker-options {\n  border: 1px solid transparent;\n  box-shadow: rgba(0,0,0,0.2) 0 2px 8px;\n}\n.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {\n  border-color: #ccc;\n}\n.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {\n  border-color: #ccc;\n}\n.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,\n.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {\n  border-color: #000;\n}\n.ql-toolbar.ql-snow + .ql-container.ql-snow {\n  border-top: 0px;\n}\n.ql-snow .ql-tooltip {\n  background-color: #fff;\n  border: 1px solid #ccc;\n  box-shadow: 0px 0px 5px #ddd;\n  color: #444;\n  margin-top: 10px;\n  padding: 5px 12px;\n  white-space: nowrap;\n}\n.ql-snow .ql-tooltip::before {\n  content: \"Visit URL:\";\n  line-height: 26px;\n  margin-right: 8px;\n}\n.ql-snow .ql-tooltip input[type=text] {\n  display: none;\n  border: 1px solid #ccc;\n  font-size: 13px;\n  height: 26px;\n  margin: 0px;\n  padding: 3px 5px;\n  width: 170px;\n}\n.ql-snow .ql-tooltip a.ql-preview {\n  display: inline-block;\n  max-width: 200px;\n  overflow-x: hidden;\n  text-overflow: ellipsis;\n  vertical-align: top;\n}\n.ql-snow .ql-tooltip a.ql-action::after {\n  border-right: 1px solid #ccc;\n  content: 'Edit';\n  margin-left: 16px;\n  padding-right: 8px;\n}\n.ql-snow .ql-tooltip a.ql-remove::before {\n  content: 'Remove';\n  margin-left: 8px;\n}\n.ql-snow .ql-tooltip a {\n  line-height: 26px;\n}\n.ql-snow .ql-tooltip.ql-editing a.ql-preview,\n.ql-snow .ql-tooltip.ql-editing a.ql-remove {\n  display: none;\n}\n.ql-snow .ql-tooltip.ql-editing input[type=text] {\n  display: inline-block;\n}\n.ql-snow .ql-tooltip.ql-editing a.ql-action::after {\n  border-right: 0px;\n  content: 'Save';\n  padding-right: 0px;\n}\n.ql-snow .ql-tooltip[data-mode=link]::before {\n  content: \"Enter link:\";\n}\n.ql-snow .ql-tooltip[data-mode=formula]::before {\n  content: \"Enter formula:\";\n}\n.ql-snow .ql-tooltip[data-mode=video]::before {\n  content: \"Enter video:\";\n}\n.ql-snow a {\n  color: #06c;\n}\n.ql-container.ql-snow {\n  border: 1px solid #ccc;\n}\n", ""]);
	
	// exports


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(96);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(92)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(91)();
	// imports
	
	
	// module
	exports.push([module.id, ".ql-snow .ql-out-bottom, .ql-snow .ql-out-top {\n    visibility: visible !important;\n}", ""]);
	
	// exports


/***/ }
/******/ ])
});
;
//# sourceMappingURL=lib.js.map