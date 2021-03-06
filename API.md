
## Classes
Global | Description
------ | -----------
Builder | 
Editor | 

## Builder
**Kind**: global class  

* [Builder](#markdown-header-builder)
    * [new Builder(target)](#markdown-header-new-buildertarget)
    * [.withDefaultToolbar(toolbarContainer, locale)](#markdown-header-builderwithdefaulttoolbartoolbarcontainer-locale-this) ⇒ this
    * [.withPlaceholderText(placeholder)](#markdown-header-builderwithplaceholdertextplaceholder-this) ⇒ this
    * [.build()](#markdown-header-builderbuild-editor) ⇒ Editor

### new Builder(target)
A builder that constructs the WYSIWYG editor with a fluent interface;
Used because QuillJS (v1.0.0) expects all configuration options upfront, but it's nice to avoid
    having that much complexity in a wrapper constructor


| Param | Type | Description |
| --- | --- | --- |
| target | String ⎮ HTMLElement | DOM element, (or CSS selector) to hold the editor |

### builder.withDefaultToolbar(toolbarContainer, locale) ⇒ this
Adds a default toolbar, with preset options; the default toolbar HTML will be inserted into the
    specified element and hooked up to the editor

**Kind**: instance method of [Builder](#markdown-header-new-buildertarget)  

| Param | Type | Description |
| --- | --- | --- |
| toolbarContainer | String ⎮ HTMLElement | Element or CSS selector to hold the toolbar |
| locale | String | The locale, used to translate tooltips for the default toolbar |

### builder.withPlaceholderText(placeholder) ⇒ this
Adds placeholder text to display when the text editor is empty

**Kind**: instance method of [Builder](#markdown-header-new-buildertarget)  

| Param | Type |
| --- | --- |
| placeholder | String | 

### builder.build() ⇒ Editor
Builds the editor based on the specified options.

**Kind**: instance method of [Builder](#markdown-header-new-buildertarget)  
## Editor
**Kind**: global class  

* [Editor](#markdown-header-editor)
    * [new Editor(targetEl, options)](#markdown-header-new-editortargetel-options)
    * [.getHTML()](#markdown-header-editorgethtml-string) ⇒ String
    * [.setHTML(html)](#markdown-header-editorsethtmlhtml)
    * [.removeFormat()](#markdown-header-editorremoveformat)
    * [.insertHTML(html, index)](#markdown-header-editorinserthtmlhtml-index)
    * [.insertText(text, name, index)](#markdown-header-editorinserttexttext-name-index)
    * [.deleteText(index, length)](#markdown-header-editordeletetextindex-length)
    * [.getText()](#markdown-header-editorgettext-string) ⇒ String
    * [.getLength()](#markdown-header-editorgetlength-number) ⇒ number
    * [.isBlank()](#markdown-header-editorisblank-boolean) ⇒ Boolean
    * [.getSelection(forceFocus)](#markdown-header-editorgetselectionforcefocus-nullobject) ⇒ null ⎮ Object
    * [.setSelection(index, length)](#markdown-header-editorsetselectionindex-length-) ⇒ *
    * [.on()](#markdown-header-editoron)
    * [.off()](#markdown-header-editoroff)
    * [.once()](#markdown-header-editoronce)
    * ["text-change"](#markdown-header-textchange)

### new Editor(targetEl, options)
Constructs an Editor (a thin wrapper around QuillJS)
 Should use the Builder to construct one of these


| Param | Type | Description |
| --- | --- | --- |
| targetEl | HTMLElement | the DOM node that will be converted into the WYSIWYG editor |
| options | Object | the options provided to QuillJS |

### editor.getHTML() ⇒ String
Returns the contents of the editor as html

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.setHTML(html)
Replaces the contents of the editor with specified html

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  

| Param | Type |
| --- | --- |
| html | String | 

### editor.removeFormat()
Removes formatting from a beginning at an index

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.insertHTML(html, index)
Inserts html into the editor

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  

| Param | Type | Description |
| --- | --- | --- |
| html | String |  |
| index | number | the index (based on text content) to insert the html;                            defaults to appending html to the end, after the trailing newline |

**Example**  
```js
//Inserted before existing contents
editor.insertHTML("HODOR", 0);
//Inserted after last line of existing contents
editor.insertHTML("HODOR");
//Inserted at the end of the last line of existing contents (before trailing newline)
editor.insertHTML("HODOR", editor.getLength() - 1);
```
### editor.insertText(text, name, index)
Inserts text with an optional formatting parameter into the Editor.  This is useful when creating spans or other blots
that have a specific purpose and formatting

 ```
 editor.insertText("COMPANY_NAME", "placeholder", editor.getSelection(true).index);
 ```
This will wrap the string in inputString in the tag and style/attribute specified in the placeholder blot
see: http://quilljs.com/docs/api/#content

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  

| Param | Description |
| --- | --- |
| text | The String to be wrapped by the custom wrapper |
| name | The name of the blot or object with formats to use for wrapping the text in the first parameter. |
| index | the point at which the formatting wrapped text should be inserted. |

### editor.deleteText(index, length)
Deletes text from the editor based on the passed in index and length

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  

| Param | Description |
| --- | --- |
| index | start index |
| length | length of deletion |

### editor.getText() ⇒ String
Get the contents of the editor with the html stripped out

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.getLength() ⇒ number
Get the length of the Editor text content

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.isBlank() ⇒ Boolean
Returns true if the editor is empty

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
### editor.getSelection(forceFocus) ⇒ null ⎮ Object
Returns an object representing the selection state if the editor is focused, otherwise `null`

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  
**Returns**: null ⎮ Object - Returned object (if any) has two properties, `index` and `length` indicating the start and length of the selection  

| Param | Description |
| --- | --- |
| forceFocus | if true, the editor will be focused, otherwise it might return `null` |

### editor.setSelection(index, length) ⇒ *
Set the selection to the index and through the length specified

**Kind**: instance method of [Editor](#markdown-header-new-editortargetel-options)  

| Param | Description |
| --- | --- |
| index | the beginning index of the selection |
| length | the length of the selection range |

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
