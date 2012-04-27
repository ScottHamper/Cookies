/*!
 * Cookies.js - 0.1.0
 * Tuesday, April 24 2012 @ 6:40 PM EST
 *
 * Copyright 2012, Scott Hamper
 * Licensed under the MIT license,
 * http://www.opensource.org/licenses/MIT
 */
(function (window, undefined) {

    var Cookies = function (key) {
        return Cookies.get(key);
    };
    
    Cookies.get = function (key) {
        if (window.document.cookie !== Cookies._cacheString) {
            Cookies._populateCache();
        }
        
        return Cookies._cache[key];
    };
    
    Cookies.defaults = {};
    
    Cookies.set = function (key, value, options) {
        var options = {
            path: options && options.path || Cookies.defaults.path,
            domain: options && options.domain || Cookies.defaults.domain,
            expires: options && options.expires || Cookies.defaults.expires,
            secure: options && options.secure || Cookies.defaults.secure
        };
        
        switch (typeof options.expires) {
            // If a number is passed in, make it work like 'max-age'
            case 'number': options.expires = new Date(Date.now() + options.expires * 1000); break;
            // Allow multiple string formats for dates
            case 'string': options.expires = new Date(options.expires); break;
        }
    
        var cookieString = key + '=' + escape(window.JSON.stringify(value));
        cookieString += options.path ? ';path=' + options.path : '';
        cookieString += options.domain ? ';domain=' + options.domain : '';
        cookieString += options.expires ? ';expires=' + options.expires.toGMTString() : '';
        cookieString += options.secure ? ';secure' : '';
        
        window.document.cookie = cookieString;
        
        return Cookies;
    };
    
    Cookies.expire = function (key, options) {
        return Cookies.set(key, '', {
            path: options && options.path,
            domain: options && options.domain,
            expires: -1
        });
    };
    
    Cookies._populateCache = function () {
        Cookies._cache = {};
        Cookies._cacheString = window.document.cookie;
        
        var cookiesArray = Cookies._cacheString.split(';');
        for (var i = 0; i < cookiesArray.length; i++) {
            var cookieKvp = cookiesArray[i].trim().split('=');
            
            // The first instance of a key in the document.cookie string
            // is the most locally scoped cookie with the specified key.
            // The value of this key will be sent to the web server, so we'll
            // just ignore any other instances of the key.
            if (Cookies._cache[cookieKvp[0]] === undefined) {
                var value = unescape(cookieKvp[1]);
                try { value = window.JSON.parse(value); } catch (ex) { }
                Cookies._cache[cookieKvp[0]] = value;
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
    } else {
        window.Cookies = Cookies;
    }
    
})(window);