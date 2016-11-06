# Change Log

## 1.2.3
- Fixed null object reference error when both the global `this` and `window` objects are undefined (e.g., when using webpack).

## 1.2.2
- Fixed errors caused when accessing a properly encoded cookie while another cookie had a malformed key/value.

## 1.2.1
- Fixed bower.json and package.json `main` pointing to "src" instead of "dist" now that an unminified version lives in "dist"

## 1.2.0
- `Infinity` may now be used with the "expires" option to set a persistent cookie.
- Included unminified version of the library in "dist"

## 1.1.0
- Added the ability to require Cookies.js in CommonJS/Node environments that do not natively have a `window`
  object, by exporting a factory method that takes an instance of a `window`.

## 1.0.1
- Fixed being unable to retrieve cookie values for keys that were named the same as a built-in `Object` property.

## 1.0.0
- Put Cookies.js into the public domain.
- Explicitly defaulted the `secure` option to `false`.

## 0.4.0
- Replaced deprecated `toGMTString` with `toUTCString` (Thanks [@Zorbash](https://github.com/Zorbash)!)
- Added a proper bower.json file (Thanks [@jstayton](https://github.com/jstayton)!)
- Fixed bug where `Cookies.enabled` was always returning true in IE7 and IE8 (Thanks [@brianlow](https://github.com/brianlow)!)
- Updated cookies.d.ts for Typescript 1.0 (Thanks [@flashandy](https://github.com/flashandy)!)
- Fixed unnecessarily encoding characters in cookie keys that are allowed by RFC6265, and
  fixed not encoding a couple characters in cookies keys that are not allowed by RFC6265.
  ([Issue #18](https://github.com/ScottHamper/Cookies/issues/18))
- Moved the change log to its own file.

## 0.3.1
- Fixed a runtime error that prevented the library from loading when cookies were disabled in the client browser.
- Fixed a bug in IE that would cause the library to improperly read cookies with a value of `""`.

## 0.3.0
- Rewrote the library from the ground up, using test driven development. The public API remains unchanged.
- Restructured project directories.

## 0.2.1
- Properly escaped a `[` literal in the RFC6265 regular expression.

## 0.2.0
- Cookie values are no longer automatically JSON encoded/decoded. This featured was deemed out of the scope of the library.
This change also removes the dependency on a JSON shim for older browsers.

## 0.1.7
- Changed cookie value encoding to only encode the special characters defined in [RFC6265](http://www.rfc-editor.org/rfc/rfc6265.txt)

## 0.1.6
- Added `'use strict';` directive.
- Removed some extraneous code.

## 0.1.5
- Added CommonJS module support.
- Setting an `undefined` value with `Cookies.set` now expires the cookie, mirroring the `Cookies.expire` alias syntax.
- Simplified how the `document.cookie` string is parsed.

## 0.1.4
- Fixed a bug where setting a cookie's `secure` value to`false` caused the `Cookies.defaults.secure` value to be used instead.

## 0.1.3
- Added aliases for `Cookies.set` and `Cookies.expire`.

## 0.1.2
- Set `Cookies.defaults.path` to `'/'`.
- Replaced `escape` and `unescape` function calls with `encodeURIComponent` and `decodeURIComponent`, because the former are deprecated.
- Cookie keys are now URI encoded in addition to cookie values.

## 0.1.1
- Cross browser fixes.

## 0.1.0
- Initial commit.