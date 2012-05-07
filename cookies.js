/*!
 * Cookies.js - 0.1.6
 * Saturday, May 06 2012 @ 9:56 PM EST
 *
 * Copyright (c) 2012, Scott Hamper
 * Licensed under the MIT license,
 * http://www.opensource.org/licenses/MIT
 */
(function (document, undefined) {
    'use strict';
    
    var Cookies = function () {
        if (arguments.length === 1) {
            return Cookies.get(arguments[0]);
        } else {
            return Cookies.set(arguments[0], arguments[1], arguments[2]);
        }
    };
    
    Cookies.get = function (key) {
        if (document.cookie !== Cookies._cacheString) {
            Cookies._populateCache();
        }
        
        return Cookies._cache[key];
    };
    
    Cookies.defaults = {
        path: '/'
    };
    
    Cookies.set = function (key, value, options) {
        var options = {
            path: options && options.path || Cookies.defaults.path,
            domain: options && options.domain || Cookies.defaults.domain,
            expires: options && options.expires || Cookies.defaults.expires,
            secure: options && options.secure !== undefined ? options.secure : Cookies.defaults.secure
        };
        
        if (value === undefined) { options.expires = -1; }
        
        switch (typeof options.expires) {
            // If a number is passed in, make it work like 'max-age'
            case 'number': options.expires = new Date(new Date().getTime() + options.expires * 1000); break;
            // Allow multiple string formats for dates
            case 'string': options.expires = new Date(options.expires); break;
        }
    
        var cookieString = encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value));
        cookieString += options.path ? ';path=' + options.path : '';
        cookieString += options.domain ? ';domain=' + options.domain : '';
        cookieString += options.expires ? ';expires=' + options.expires.toGMTString() : '';
        cookieString += options.secure ? ';secure' : '';
        
        document.cookie = cookieString;
        
        return Cookies;
    };
    
    Cookies.expire = function (key, options) {
        return Cookies.set(key, undefined, options);
    };
    
    Cookies._populateCache = function () {
        Cookies._cache = {};
        Cookies._cacheString = document.cookie;
        
        var cookiesArray = Cookies._cacheString.split('; ');
        for (var i = 0; i < cookiesArray.length; i++) {
            var cookieKvp = cookiesArray[i].split('=');
            var key = decodeURIComponent(cookieKvp[0]);
            var value = decodeURIComponent(cookieKvp[1]);
            
            // The first instance of a key in the document.cookie string
            // is the most locally scoped cookie with the specified key.
            // The value of this key will be sent to the web server, so we'll
            // just ignore any other instances of the key.
            if (Cookies._cache[key] === undefined) {
                try { value = JSON.parse(value); } catch (ex) { }
                Cookies._cache[key] = value;
            }
        }
    };
    
    Cookies.enabled = (function () {
        var isEnabled = Cookies.set('cookies.js', 1).get('cookies.js') === 1;
        Cookies.expire('cookies.js');
        return isEnabled;
    })();
    
    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return Cookies; });
    // CommonJS support with backwards compatibility for the old `require` API.
    } else if (typeof exports !== 'undefined') {
        if (typeof module != 'undefined' && module.exports) {
            exports = module.exports = Cookies;
        }
        exports.Cookies = Cookies;
    } else {
        window.Cookies = Cookies;
    }
    
})(document);