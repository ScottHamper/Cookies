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
- [Minified](https://raw.github.com/ScottHamper/Cookies/master/dist/cookies.min.js) (~1 KB gzipped)
- [Unminified](https://raw.github.com/ScottHamper/Cookies/master/src/cookies.js) (~1.7 KB gzipped)

### Node Package Manager
`npm install cookies-js`

### Bower
`bower install cookies-js`

## A Note About Encoding
[RFC6265](http://www.rfc-editor.org/rfc/rfc6265.txt) defines a strict set of allowed characters for
cookie keys and values. In order to effectively allow any character to be used in a key or value,
Cookies.js will URI encode disallowed characters in their UTF-8 representation. As such, Cookies.js
also expects cookie keys and values to already be URI encoded in a UTF-8 representation when it
accesses cookies. Keep this in mind when working with cookies on the server side.

### .NET Users
Do not use [HttpUtility.UrlEncode](http://msdn.microsoft.com/en-us/library/4fkewx0t.aspx) and
[HttpUtility.UrlDecode](http://msdn.microsoft.com/en-us/library/adwtk1fy.aspx) on cookie keys or
values. `HttpUtility.UrlEncode` will improperly escape space characters to `'+'` and lower case every
escape sequence. `HttpUtility.UrlDecode` will improperly unescape every `'+'` to a space character.
Instead, use
[System.Uri.EscapeDataString](http://msdn.microsoft.com/en-us/library/system.uri.escapedatastring.aspx)
and [System.Uri.UnescapeDataString](http://msdn.microsoft.com/en-us/library/system.uri.unescapedatastring.aspx).


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