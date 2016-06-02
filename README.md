# WYSIWYG HTML Editor #

This repository serves as a thin framework-agnostic wrapper around a wysiwyg html editor library.

The primary purpose of the wrapper is to allow the behavior of the wysiwyg editor to be tweaked - to disable unwanted functionality or add functionality not supported out of the box - and give consistent behavior everywhere that it's used.

A secondary purpose is to make it more feasible to swap out implementations under-the-hood with minimal downstream changes.

### Usage ###

The library uses the [UMD pattern](https://github.com/umdjs/umd); if using the global variable form it exports a `window.HTMLEditor` global.

Currently everything (including styling and html) is bundled into a single file `lib.js` for ease-of-use downstream.  


### Development ###

Uses webpack with npm scripts for development:

`npm run build` - builds the webpack bundle (`lib.js`) once.

`npm run watch` - builds the webpack bundle and rebuilds it whenever source code changes

`npm run example` - serves the example page at localhost:8000/example

The normal setup is to run `npm run example` in one terminal and `npm run watch` in another.

---

NOTE: the built library `lib.js` is checked into the source control.  This isn't ideal (must be kept in sync, changes are essentially duplicated); normally you build just before publishing to `npm`, but so long as we're just including this library directly from source control that's not an option.

The alternative - having downstream codebases build after checking out from source control - is nicer from our end, but a pain since it requires all of this libraries dependencies to be installed just to use the built library.  

A pre-push git hook is included to try to help ensure that lib.js stays up-to-date.
