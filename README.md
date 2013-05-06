# Cookies.js

Cookies.js is a small client-side javascript library that makes managing cookies easy.

## Features
- Caches cookie values, making sequential reads faster.
- Supports AMD / CommonJS loaders.
- Cross browser.
- Lightweight.
- [RFC6265](http://www.rfc-editor.org/rfc/rfc6265.txt) Compliant.

## Browser Compatibility
The following browsers have passed all of the Cookies.js unit tests:
- Chrome
- Firefox 3+
- Safari 4+
- Opera 10+
- Internet Explorer 6+

## Getting the Library
### Direct downloads
- [Minified](https://raw.github.com/ScottHamper/Cookies/master/src/cookies.min.js) (~1 KB gzipped)
- [Unminified](https://raw.github.com/ScottHamper/Cookies/master/src/cookies.js) (~1.7 KB gzipped)

### Node Package Manager
`npm install cookies-js`

## A Note About Encoding
Cookies.js URI encodes cookie keys and values, and expects cookie keys to be URI encoded when accessing a cookie.
Keep this in mind when working with cookies on the server side.

### .NET Users
Do not use [HttpUtility.UrlEncode](http://msdn.microsoft.com/en-us/library/4fkewx0t.aspx) and
[HttpUtility.UrlDecode](http://msdn.microsoft.com/en-us/library/adwtk1fy.aspx) on cookie keys or values. `HttpUtility.UrlEncode` will
improperly escape space characters to `'+'` and lower case every escape sequence. `HttpUtility.UrlDecode` will improperly unescape
every `'+'` to a space character. Instead, use
[System.Uri.EscapeDataString](http://msdn.microsoft.com/en-us/library/system.uri.escapedatastring.aspx) and
[System.Uri.UnescapeDataString](http://msdn.microsoft.com/en-us/library/system.uri.unescapedatastring.aspx).


# API Reference

## Methods

### Cookies.set(key, value [, options])
*Alias: Cookies(key, value [, options])*

Sets a cookie in the document. If the cookie does not already exist, it will be created.

#### Arguments:
*key*: A string value of the cookie key to set  
*value*: A string value of the cookie value to set  
*options*: An object containing additional parameters about the cookie (discussed below)

#### Returns:
The `Cookies` object is returned to support chaining.

#### The 'options' Object:
*path*: A string value of the path of the cookie  
*domain*: A string value of the domain of the cookie  
*expires*: A number (of seconds), a date parsable string, or a `Date` object of when the cookie will expire  
*secure*: A boolean value of whether or not the cookie should only be available over SSL

If any property is left undefined, the browser's default value will be used instead. A default value
for any property may be set in the `Cookies.defaults` object.

**Why use 'expires' instead of 'max-age' (or why not both)?**  
Internet Explorer 6 - 8 do not support 'max-age', so Cookies.js always uses 'expires' internally.
However, Cookies.js simplifies things by allowing the `options.expires` property to be used in the
same way as 'max-age' (by setting `options.expires` to the number of seconds the cookie should exist for).

#### Example usage:
```javascript
// Setting a cookie value
Cookies.set('key', 'value');

// Chaining sets together
Cookies.set('key', 'value').set('hello', 'world');

// Setting cookies with additional options
Cookies.set('key', 'value', { domain: 'www.example.com', secure: true });

// Setting cookies with expiration values
Cookies.set('key', 'value', { expires: 600 }); // Expires in 10 minutes
Cookies.set('key', 'value', { expires: '01/01/2012' });
Cookies.set('key', 'value', { expires: new Date(2012, 0, 1) });

// Using the alias
Cookies('key', 'value', { secure: true });
```

### Cookies.get(key)
*Alias: Cookies(key)*

Retrieves the cookie value of the most locally scoped cookie with the specified key.

#### Arguments:
*key*: A string value of a cookie key

#### Returns:
The string value of the cookie.

#### Example Usage:
```javascript
// First set a cookie
Cookies.set('key', 'value');

// Get the cookie value
Cookies.get('key'); // "value"

// Using the alias
Cookies('key'); // "value"
```
    
### Cookies.expire(key [, options])
*Alias: Cookies(key, `undefined` [, options])*

Expires a cookie, removing it from the document.

#### Arguments:
*key*: A string value of the cookie key to expire  
*options*: An object containing additional parameters about the cookie (discussed below)

#### Returns:
The `Cookies` object is returned to support chaining.

#### The 'options' Object:
*path*: A string value of the path of the cookie  
*domain*: A string value of the domain of the cookie

If any property is left `undefined`, the browser's default value will be used instead. A default value
for any property may be set in the `Cookies.defaults` object.

#### Example Usage:
```javascript
// First set a cookie and get its value
Cookies.set('key', 'value').get('key'); // "value"

// Expire the cookie and try to get its value
Cookies.expire('key').get('key'); // undefined

// Using the alias instead
Cookies('key', undefined);
```
    

## Properties

### Cookies.enabled
A boolean value of whether or not the browser has cookies enabled.

#### Example Usage:
```javascript
if (Cookies.enabled) {
    Cookies.set('key', 'value');
}
```

### Cookies.defaults
An object representing default options to be used when setting and expiring cookie values.
`Cookies.defaults` supports the following properties:

*path*: A string value of the path of the cookie  
*domain*: A string value of the domain of the cookie  
*expires*: A number (of seconds), a date parsable string, or a `Date` object of when the cookie will expire  
*secure*: A boolean value of whether or not the cookie should only be available over SSL

By default, only `Cookies.defaults.path` is set to `'/'`, all other properties are `undefined`.
If any property is left undefined, the browser's default value will be used instead.

#### Example Usage:
```javascript
Cookies.defaults = {
    path: '/',
    secure: true
};

Cookies.set('key', 'value'); // Will be secure and have a path of '/'
Cookies.expire('key'); // Will expire the cookie with a path of '/'
```
    
# Change Log

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
