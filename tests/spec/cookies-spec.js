﻿/*
 * Cookies.js Automated Test Specifications
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
describe('UNIT TESTS', function () {
    var mockDocument;

    beforeEach(function () {
        mockDocument = {};
        Cookies._document = mockDocument;
        Cookies._cachedDocumentCookie = '';
    });

    describe('Cookies(key)', function () {
        it('returns `Cookies.get(key)`', function () {
            var key = 'key';
            var value = 'value';
            
            spyOn(Cookies, 'get').andReturn(value);
            
            expect(Cookies(key)).toEqual(value);
            expect(Cookies.get).toHaveBeenCalledWith(key);
        });
    });

    describe('Cookies(key, value[, options])', function () {
        var key = 'key';
        var value = 'value';
        var options = undefined;
        
        it('calls `Cookies.set(key, value, options)`', function () {
            spyOn(Cookies, 'set');
            Cookies(key, value, options);
            
            expect(Cookies.set).toHaveBeenCalledWith(key, value, options);
        });
        
        it('returns `Cookies`', function () {
            expect(Cookies(key, value, options)).toEqual(Cookies);
        });
    });

    describe('Cookies.defaults', function () {
        it('has a defined `path` value of "/"', function () {
            expect(Cookies.defaults.path).toEqual('/');
        });
        
        it('has an undefined `domain` value', function () {
            expect(Cookies.defaults.domain).toBeUndefined();
        });
        
        it('has an undefined `expires` value', function () {
            expect(Cookies.defaults.expires).toBeUndefined();
        });
        
        it('has a defined `secure` value of `false`', function () {
            expect(Cookies.defaults.secure).toBe(false);
        });

        it('has a defined `sameSite` value of `null`', function () {
          expect(Cookies.defaults.sameSite).toBe(null);
        });
    });

    describe('Cookies.get(key)', function () {
        var key;
        
        beforeEach(function () {
            key = 'key';
            mockDocument.cookie = 'key=value';
        });
        
        it('returns `undefined` when `key` is undefined', function () {
            key = undefined;
            expect(Cookies.get(key)).toBeUndefined();
        });
        
        it('returns `undefined` for a cookie key that does not exist', function () {
            key = 'undefined';
            expect(Cookies.get(key)).toBeUndefined();
        });
        
        it('calls `Cookies._renewCache()` when `document.cookie` does not equal `Cookies._cachedDocumentCookie`', function () {
            Cookies._cachedDocumentCookie = undefined;
            
            spyOn(Cookies, '_renewCache');
            Cookies.get(key);
            
            expect(Cookies._renewCache).toHaveBeenCalled();
        });
        
        it('does not call `Cookies._renewCache()` when `document.cookie` equals `Cookies._cachedDocumentCookie`', function () {
            Cookies._cachedDocumentCookie = mockDocument.cookie;
            
            spyOn(Cookies, '_renewCache');
            Cookies.get('key');
            
            expect(Cookies._renewCache).not.toHaveBeenCalled();
        });
        
        it('returns the value of the cookie when it exists', function () {
            expect(Cookies.get(key)).toEqual('value');
        });
        
        it('returns the value of keys that are named the same as built-in `Object` properties', function () {
            key = 'constructor';
            mockDocument.cookie = 'constructor=value';
            
            expect(Cookies.get(key)).toEqual('value');
        });
        
        it('URI decodes cookie values', function () {
            mockDocument.cookie = 'key=%5C%22%2C%3B%20%C3%B1%C3%A2%C3%A9';

            expect(Cookies.get('key')).toEqual('\\",; ñâé');
        });
        
        it('returns the value of a properly encoded cookie when another cookie with a malformed value exists', function () {
            mockDocument.cookie = 'key=value; malformed=%D0%EE%F1%F1%E8%FF';
            
            expect(Cookies.get('key')).toEqual('value');
        });
        
        it('returns the value of a properly encoded cookie when another cookie with a malformed key exists', function () {
            mockDocument.cookie = 'key=value; %D0%EE%F1%F1%E8%FF=malformed';
            
            expect(Cookies.get('key')).toEqual('value');
        });
    });

    describe('Cookies.set(key, value[, options])', function () {
        var key, value, options;
        var originalDefaults = Cookies.defaults;
        
        beforeEach(function () {
            key = 'key';
            value = 'value';
            options = undefined;
            
            Cookies.defaults = {
                path: '/cookies',
                domain: 'www.scotthamper.com',
                expires: '01/01/2013 GMT',
                secure: false,
                sameSite: null
            };
        });
        
        afterEach(function () {
            Cookies.defaults = originalDefaults;
        });
        
        it('returns the `Cookies` object', function () {
            expect(Cookies.set(key, value, options)).toEqual(Cookies);
        });
        
        it('calls `Cookies._getExtendedOptions(options)`', function () {
            options = { path: '/' };
            
            spyOn(Cookies, '_getExtendedOptions').andCallThrough();
            Cookies.set(key, value, options);
            
            expect(Cookies._getExtendedOptions).toHaveBeenCalledWith(options);
        });
        
        it('calls `Cookies._getExpiresDate(options.expires)`', function () {
            options = { expires: '01/01/2013' };
            
            spyOn(Cookies, '_getExpiresDate').andCallThrough();
            
            Cookies.set(key, value, options);
            expect(Cookies._getExpiresDate).toHaveBeenCalledWith(options.expires);
            
            Cookies.set(key, 0, options);
            expect(Cookies._getExpiresDate).toHaveBeenCalledWith(options.expires);
        });
        
        it('calls `Cookies._getExpiresDate(-1)` when value is `undefined`', function () {
            options = { expires: '01/01/2013' };
            
            spyOn(Cookies, '_getExpiresDate').andCallThrough();
            Cookies.set(key, undefined, options);
            
            expect(Cookies._getExpiresDate).toHaveBeenCalledWith(-1);
        });
        
        it('calls `Cookies._generateCookieString(key, value, options)` with extended options and options.expires as a Date instance', function () {
            var extendedOptionsWithExpiresDate = {
                path: Cookies.defaults.path,
                domain: Cookies.defaults.domain,
                expires: new Date(Cookies.defaults.expires),
                secure: Cookies.defaults.secure,
                sameSite: Cookies.defaults.sameSite
            };
            
            spyOn(Cookies, '_generateCookieString').andCallThrough();
            Cookies.set(key, value, options);
            
            expect(Cookies._generateCookieString).toHaveBeenCalledWith(key, value, extendedOptionsWithExpiresDate);
        });
        
        it('sets `document.cookie` to the proper cookie string', function () {
            var expires = new Date(Cookies.defaults.expires).toGMTString(); // IE appends "UTC" instead of "GMT", so I can't hard-code the value
            var expectedCookieString = 'key=value;path=/cookies;domain=www.scotthamper.com;expires=' + expires;
            Cookies.set(key, value, options);
            
            expect(mockDocument.cookie).toEqual(expectedCookieString);
        });
    });

    describe('Cookies.expire(key, options)', function () {
        var key = 'key';

        it('calls `Cookies.set(key, undefined, options)`', function () {
            var options = undefined;
            
            spyOn(Cookies, 'set');
            Cookies.expire(key, options);
            
            expect(Cookies.set).toHaveBeenCalledWith(key, undefined, options);
        });
        
        it('returns `Cookies`', function () {
            expect(Cookies.expire(key)).toEqual(Cookies);
        });
    });

    describe('"PRIVATE" FUNCTIONS', function () {
        describe('Cookies._getExtendedOptions(options)', function () {
            var originalDefaults = Cookies.defaults;
            
            beforeEach(function () {
                Cookies.defaults = {
                    path: '/cookies',
                    domain: 'www.scotthamper.com',
                    expires: '01/01/2013',
                    secure: false,
                    sameSite: null
                };
            });
            
            afterEach(function () {
                Cookies.defaults = originalDefaults;
            });

            it('returns `Cookies.defaults` when `options` is undefined', function () {
                expect(Cookies._getExtendedOptions(undefined)).toEqual(Cookies.defaults);
            });
            
            it('returns `options` when all properties are defined on `options`', function () {
                var options = {
                    path: '/nom',
                    domain: 'www.github.com',
                    expires: '02/02/2013',
                    secure: true,
                    sameSite: 'None'
                };
                
                expect(Cookies._getExtendedOptions(options)).toEqual(options);
            });
            
            it('returns `Cookies.defaults` with an overridden `path` property when only `options.path` is specified', function () {
                var options = { path: '/nom' };
                
                expect(Cookies._getExtendedOptions(options)).toEqual({
                    path: options.path,
                    domain: Cookies.defaults.domain,
                    expires: Cookies.defaults.expires,
                    secure: Cookies.defaults.secure,
                    sameSite: Cookies.defaults.sameSite
                });
            });
            
            it('returns `Cookies.defaults` with an overridden `domain` property when only `options.domain` is specified', function () {
                var options = { domain: 'www.github.com' };
                
                expect(Cookies._getExtendedOptions(options)).toEqual({
                    path: Cookies.defaults.path,
                    domain: options.domain,
                    expires: Cookies.defaults.expires,
                    secure: Cookies.defaults.secure,
                    sameSite: Cookies.defaults.sameSite
                });
            });
            
            it('returns `Cookies.defaults` with an overridden `expires` property when only `options.expires` is specified', function () {
                var options = { expires: '02/02/2013' };
                
                expect(Cookies._getExtendedOptions(options)).toEqual({
                    path: Cookies.defaults.path,
                    domain: Cookies.defaults.domain,
                    expires: options.expires,
                    secure: Cookies.defaults.secure,
                    sameSite: Cookies.defaults.sameSite
                });
            });
            
            it('returns `Cookies.defaults` with an overridden `secure` property when only `options.secure` is specified', function () {
                var options = { secure: true };
                
                expect(Cookies._getExtendedOptions(options)).toEqual({
                    path: Cookies.defaults.path,
                    domain: Cookies.defaults.domain,
                    expires: Cookies.defaults.expires,
                    secure: options.secure,
                    sameSite: Cookies.defaults.sameSite
                });
            });
            
            it('returns an object with `secure` set to `false`, when `options.secure` is `false` and `Cookies.defaults.secure` is `true`', function () {
                var options = { secure: false };
                Cookies.defaults.secure = true;
                expect(Cookies._getExtendedOptions(options).secure).toBe(false);
            });
            
            it('does not modify `options`', function () {
                var options = {};
                Cookies._getExtendedOptions(options);
                
                expect(options.path).toBeUndefined();
                expect(options.domain).toBeUndefined();
                expect(options.expires).toBeUndefined();
                expect(options.secure).toBeUndefined();
                expect(options.sameSite).toBeUndefined();
            });
        });
        
        describe('Cookies._isValidDate(date)', function () {
            it('returns `false` when `date` is not a Date instance', function () {
                expect(Cookies._isValidDate('cookies')).toBe(false);
                expect(Cookies._isValidDate(1)).toBe(false);
                expect(Cookies._isValidDate(['array'])).toBe(false);
                expect(Cookies._isValidDate({ key: 'value' })).toBe(false);
                expect(Cookies._isValidDate(/regex/)).toBe(false);
            });
            
            it('returns `false` when `date` is an invalid Date instance', function () {
                var date = new Date('cookies');
                expect(Cookies._isValidDate(date)).toBe(false);
            });
            
            it('returns `true` when `date` is a valid Date instance', function () {
                var date = new Date();
                expect(Cookies._isValidDate(date)).toBe(true);
            });
        });
        
        describe('Cookies._getExpiresDate(expires)', function () {
            it('returns a Date object set to the current time plus <expires> seconds, when `expires` is a finite number', function () {
                var now = new Date('01/01/2013 00:00:00');
                var expires = 5;
                expect(Cookies._getExpiresDate(expires, now)).toEqual(new Date('01/01/2013 00:00:05'));
            });
            
            it('returns `Cookies._maxExpireDate` when `expires` is `Infinity`', function () {
                var expires = Infinity;
                expect(Cookies._getExpiresDate(expires)).toEqual(Cookies._maxExpireDate);
            });
            
            it('returns a Date object when `expires` is a valid Date parsable string', function () {
                var expires = '01/01/2013';
                expect(Cookies._getExpiresDate(expires)).toEqual(new Date('01/01/2013'));
            });
            
            it('returns `expires` when `expires` is a Date object', function () {
                var expires = new Date();
                expect(Cookies._getExpiresDate(expires)).toEqual(expires);
            });
            
            it('returns `undefined` when `expires` is undefined', function () {
                expect(Cookies._getExpiresDate(undefined)).toBeUndefined();
            });
            
            it('throws Error when `expires` is not a number, string, or Date', function () {
                var expires = {};
                expect(function () { Cookies._getExpiresDate(expires); }).toThrow();
            });
            
            it('throws Error when `expires` is a non-date string', function () {
                var expires = 'cookies';
                expect(function () { Cookies._getExpiresDate(expires); }).toThrow();
            });
        });
        
        describe('Cookies._generateCookieString(key, value[, options])', function () {
            var key, value;
            
            beforeEach(function () {
                key = 'key';
                value = 'value';
            });
            
            it('separates the `key` and `value` with an "=" character', function () {
                expect(Cookies._generateCookieString(key, value)).toEqual('key=value');
            });
            
            it('converts a number `value` to a string', function () {
                value = 0;
                expect(Cookies._generateCookieString(key, value)).toEqual('key=0');
            });

            it('URI encodes the `key`', function () {
                key = '\\",; ñâé';
                expect(Cookies._generateCookieString(key, value)).toEqual('%5C%22%2C%3B%20%C3%B1%C3%A2%C3%A9=value');
            });

            it('does not URI encode characters in the `key` that are allowed by RFC6265, except for the "%" character', function () {
                key = '#$%&+^`|';
                expect(Cookies._generateCookieString(key, value)).toEqual('#$%25&+^`|=value');
            });

            it('URI encodes characters in the `key` that are not allowed by RFC6265, but are not encoded by `encodeURIComponent`', function () {
                key = '()';
                expect(Cookies._generateCookieString(key, value)).toEqual('%28%29=value');
            });

            it('URI encodes special characters in the `value`, as defined by RFC6265, as well as the "%" character', function () {
                value = '\\",; ñâé%';
                expect(Cookies._generateCookieString(key, value)).toEqual('key=%5C%22%2C%3B%20%C3%B1%C3%A2%C3%A9%25');
            });
            
            it('does not URI encode characters in the `value` that are allowed by RFC6265, except for the "%" character', function () {
                value = '#$&+/:<=>?@[]^`{|}~%';
                expect(Cookies._generateCookieString(key, value)).toEqual('key=#$&+/:<=>?@[]^`{|}~%25');
            });
            
            it('includes the path when `options.path` is defined', function () {
                var options = { path: '/' };
                expect(Cookies._generateCookieString(key, value, options)).toEqual('key=value;path=/');
            });
            
            it('includes the domain when `options.domain` is defined', function () {
                var options = { domain: 'www.scotthamper.com' };
                expect(Cookies._generateCookieString(key, value, options)).toEqual('key=value;domain=www.scotthamper.com');
            });
            
            it('includes the expiration date when `options.expires` is defined', function () {
                var options = { expires: new Date('01/01/2013 00:00:00 GMT') };
                var expected = 'key=value;expires=' + options.expires.toGMTString(); // IE appends "UTC" instead of "GMT", so I can't hard-code the value
                
                expect(Cookies._generateCookieString(key, value, options)).toEqual(expected);
            });
            
            it('includes the secure flag when `options.secure` is true', function () {
                var options = { secure: true };
                expect(Cookies._generateCookieString(key, value, options)).toEqual('key=value;secure');
            });

            it('includes the SameSite flag when `options.sameSite` is defined', function () {
              var options = { sameSite: 'None' };
              var expected = 'key=value;SameSite=None';
      
              expect(Cookies._generateCookieString(key, value, options)).toEqual(expected);
            });
        });
        
        describe('Cookies._getCacheFromString(documentCookie)', function () {
            it('returns an object of cookie key/value pairs', function () {
                var documentCookie = 'key=value; scott=hamper';
                var expected = {};
                expected[Cookies._cacheKeyPrefix + 'key'] = 'value';
                expected[Cookies._cacheKeyPrefix + 'scott'] = 'hamper';
                
                expect(Cookies._getCacheFromString(documentCookie)).toEqual(expected);
            });
            
            it('returns an empty object if `documentCookie` is an empty string', function () {
                var documentCookie = '';
                expect(Cookies._getCacheFromString(documentCookie)).toEqual({});
            });
            
            it('ignores duplicate cookie keys', function () {
                var documentCookie = 'key=value; key=scott';
                var expected = {};
                expected[Cookies._cacheKeyPrefix + 'key'] = 'value';
                
                expect(Cookies._getCacheFromString(documentCookie)).toEqual(expected);
            });
        });
        
        describe('Cookies._getKeyValuePairFromCookieString(cookieString)', function () {
            it('URI decodes cookie keys', function () {
                var cookieString = '%5C%22%2C%3B%20%C3%B1%C3%A2%C3%A9=value';
                expect(Cookies._getKeyValuePairFromCookieString(cookieString)).toEqual({
                    'key': '\\",; ñâé',
                    'value': 'value'
                });
            });
            
            it('parses cookie values containing an "=" character', function () {
                var cookieString = 'key=value=value';
                expect(Cookies._getKeyValuePairFromCookieString(cookieString)).toEqual({
                    key: 'key',
                    value: 'value=value'
                });
            });
            
            it('parses cookies with an empty string for the value', function () {
                var cookieString = 'key=';
                var expected = { key: 'key', value: '' };
                
                expect(Cookies._getKeyValuePairFromCookieString(cookieString)).toEqual(expected);
                
                cookieString = 'key'; // IE omits the "="
                expect(Cookies._getKeyValuePairFromCookieString(cookieString)).toEqual(expected);
            });
        });

        describe('Cookies._renewCache()', function () {
            it('sets `Cookies._cache` to `Cookies._getCacheFromString(document.cookie)`', function () {
                mockDocument.cookie = 'key=value';
                Cookies._cache = undefined;
                
                spyOn(Cookies, '_getCacheFromString').andCallThrough();
                Cookies._renewCache();
                
                expect(Cookies._getCacheFromString).toHaveBeenCalledWith(mockDocument.cookie);
                expect(Cookies._cache).toEqual(Cookies._getCacheFromString(mockDocument.cookie));
            });
            
            it('sets `Cookies._cachedDocumentCookie` to `document.cookie`', function () {
                mockDocument.cookie = 'key=value';
                Cookies._renewCache();
                expect(Cookies._cachedDocumentCookie).toEqual(mockDocument.cookie);
            });
        });
        
        describe('Cookies._areEnabled()', function () {
            var key;
            
            beforeEach(function () {
                key = 'cookies.js';
            });
            
            it('attempts to set and get a cookie with a key of `cookies.js`', function () {
                var value = 1;
                var documentCookie = 'cookies.js=1';
                
                spyOn(Cookies, 'set').andCallThrough();
                spyOn(Cookies, 'get').andCallThrough();
                Cookies._areEnabled();
                
                expect(Cookies.set).toHaveBeenCalledWith(key, value);
                expect(Cookies.get).toHaveBeenCalledWith(key);
            });

            it('expires the test cookie when done', function () {
                spyOn(Cookies, 'expire').andCallThrough();
                
                Cookies._areEnabled();
                
                expect(Cookies.expire).toHaveBeenCalledWith(key);
            });
            
            it('returns `true` if a cookie can be set and retrieved successfully', function () {
                spyOn(Cookies, 'set').andCallFake(function () {
                    mockDocument.cookie = 'cookies.js=1';
                    return Cookies;
                });
                
                expect(Cookies._areEnabled()).toBe(true);
            });
            
            it('returns `false` if a cookie cannot be set and retrieved successfully', function () {
                mockDocument.cookie = '';
                expect(Cookies._areEnabled()).toBe(false);
            });
        });
    });
});

describe('INTEGRATION TESTS', function () {
    var key = 'key';
    var value = 'value';
    
    beforeEach(function () {
        Cookies._document = window.document;
    });
    
    
    describe('Cookies.enabled', function () {
        it('equals `Cookies._areEnabled()`', function () {
            expect(Cookies.enabled).toEqual(Cookies._areEnabled());
        });
        
        // Cookies have to be enabled in order to do any integration tests
        it('is true', function () {
            expect(Cookies.enabled).toBe(true);
        });
    });
    
    describe('Cookies.set(key, value[, options])', function () {
        afterEach(function () {
            document.cookie = 'key=value;path=/;expires=' + new Date('01/01/2000').toGMTString();
        });
        
        it('sets a cookie', function () {
            Cookies.set(key, value);
            expect(document.cookie).toContain('key=value');
        });
        
        it('expires a cookie when `value` is `undefined`', function () {
            Cookies.set(key, value);
            Cookies.set(key, undefined);
            expect(document.cookie).not.toContain('key=');
        });
    });
    
    describe('Cookies.get(key)', function () {
        beforeEach(function () {
            Cookies.set(key, value);
        });
        
        afterEach(function () {
            Cookies.expire(key);
        });
        
        it('returns the value of a cookie', function () {
            expect(Cookies.get(key)).toEqual(value);
        });
    });
});