
## Classes
Global | Description
------ | -----------
Editor | 
EditorBuilder | 

## Editor
**Kind**: global class  

* [Editor](#markdown-header-editor)
    * [new Editor(targetEl, options)](#markdown-header-new-editortargetel-options)
    * [.getHTML()](#markdown-header-editorgethtml-string) ⇒ String
    * [.on()](#markdown-header-editoron)
    * [.off()](#markdown-header-editoroff)
    * [.once()](#markdown-header-editoronce)
    * ["text-change"](#markdown-header-textchange)

### new Editor(targetEl, options)
Constructs an Editor (a thin wrapper around QuillJS)
 Should use the EditorBuilder to construct one of these


| Param | Type | Description |
| --- | --- | --- |
| targetEl | HTMLElement | the DOM node that will be converted into the WYSIWYG editor |
| options | Object | the options provided to QuillJS |

### editor.getHTML() ⇒ String
Returns the contents of the editor as html

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.on()
See [EventEmitter.on](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.off()
See [EventEmitter.removeListener](https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener)

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.once()
See [EventEmitter.once](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener)

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### "text-change"
Text change event, fired whenever the contents of the editor have changed

**Kind**: event emitted by [Editor](#markdown-header-new-editortargetel-options)  
## EditorBuilder
**Kind**: global class  

* [EditorBuilder](#markdown-header-editorbuilder)
    * [new EditorBuilder(target)](#markdown-header-new-editorbuildertarget)
    * [.withDefaultToolbar(toolbarContainer)](#markdown-header-editorbuilderwithdefaulttoolbartoolbarcontainer-this) ⇒ this
    * [.withPlaceholderText(placeholder)](#markdown-header-editorbuilderwithplaceholdertextplaceholder-this) ⇒ this
    * [.build()](#markdown-header-editorbuilderbuild-editor) ⇒ Editor

### new EditorBuilder(target)
A builder that constructs the WYSIWYG editor with a fluent interface;
Used because QuillJS (v1.0.0) expects all configuration options upfront, but it's nice to avoid
    having that much complexity in a wrapper constructor


| Param | Type | Description |
| --- | --- | --- |
| target | String ⎮ HTMLElement | DOM element, (or CSS selector) to hold the editor |

### editorBuilder.withDefaultToolbar(toolbarContainer) ⇒ this
Adds a default toolbar, with preset options; the default toolbar HTML will be inserted into the
    specified element and hooked up to the editor

**Kind**: instance method of [EditorBuilder](#markdown-header-new-editorbuildertarget)  

| Param | Type | Description |
| --- | --- | --- |
| toolbarContainer | String ⎮ HTMLElement | Element or CSS selector to hold the toolbar |

### editorBuilder.withPlaceholderText(placeholder) ⇒ this
Adds placeholder text to display when the text editor is empty

**Kind**: instance method of [EditorBuilder](#markdown-header-new-editorbuildertarget)  

| Param | Type |
| --- | --- |
| placeholder | String | 

### editorBuilder.build() ⇒ Editor
Builds the editor based on the specified options.

**Kind**: instance method of [EditorBuilder](#markdown-header-new-editorbuildertarget)  
