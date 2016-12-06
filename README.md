# WYSIWYG HTML Editor #

This repository serves as a thin framework-agnostic wrapper around a wysiwyg html editor library.

The primary purpose of the wrapper is to allow the behavior of the wysiwyg editor to be tweaked - to disable unwanted functionality or add functionality not supported out of the box - and give consistent behavior everywhere that it's used.

A secondary purpose is to make it more feasible to swap out implementations under-the-hood with minimal downstream changes.

[Changelog](CHANGELOG.md)

### Usage ###

The library uses the [UMD pattern](https://github.com/umdjs/umd); if using the global variable form it exports a `window.HTMLEditor` global.

Currently everything (including styling and html) is bundled into a single file `lib.js` for ease-of-use downstream.  

See [documentation](API.md) and [example page](example/index.html) for API usage.

### Development ###

Uses webpack with npm scripts for development:

`npm run watch` - builds the webpack bundle and rebuilds it whenever source code changes

`npm run example` - serves the example page at localhost:8000/example

`npm run bundle` - builds the webpack bundle (`lib.js`) once.  Builds the minified, production build.

The normal setup is to run `npm run example` in one terminal and `npm run watch` in another.

---

NOTE: If you make changes to the JS Doc comments, please run `npm run doc` to ensure that the API.md stays up-to-date, and check in the results.

A pre-push git hook is included to try to help ensure that API.md stays up-to-date.
