describe('Cookies', function () {
    beforeEach(function () {
        this.addMatchers({
            toBeBoolean: function () {
                return this.actual === true || this.actual === false;
            }
        });
    });
    
    it('exists in the "window" object', function () {
        expect(Cookies).toBeDefined();
    });
    
    describe('.enabled', function () {
        it('returns whether or not the browser has cookies enabled', function () {
            expect(Cookies.enabled).toBeBoolean();
        });
    });
    
    Cookies.defaults.path = undefined;
    var cookieKey = 'cookies-spec.js';
    
    describe('.set(key, value [, options])', function () {
        it('returns the "Cookies" object', function () {
            expect(Cookies.set(cookieKey, 1)).toBe(Cookies);
        });
        
        it('sets a cookie in "document.cookie"', function () {
            expect(document.cookie).toContain(cookieKey + '=');
        });
        
        it('is aliased by "Cookies(key, value [, options])"', function () {
            Cookies(cookieKey, 2);
            expect(document.cookie).toContain(cookieKey + '=2');
        });
        
        it('JSON encodes numbers', function () {
            Cookies.set(cookieKey, 1);
            expect(document.cookie).toContain(cookieKey + '=1');
        });
        
        it('JSON encodes strings', function () {
            Cookies.set(cookieKey, '1');
            expect(document.cookie).toContain(cookieKey + '=' + JSON.stringify('1').replace(/[^!#-+\--:<-[\]-~]/g, encodeURIComponent));
        });
        
        it('JSON encodes arrays', function () {
            var value = [1, 2, 3];
            Cookies.set(cookieKey, value);
            expect(document.cookie).toContain(cookieKey + '=' + JSON.stringify(value).replace(/[^!#-+\--:<-[\]-~]/g, encodeURIComponent));
        });
        
        it('JSON encodes objects', function () {
            var value = { key: 'value' };
            Cookies.set(cookieKey, value);
            expect(document.cookie).toContain(cookieKey + '=' + JSON.stringify(value).replace(/[^!#-+\--:<-[\]-~]/g, encodeURIComponent));
        });
        
        it('JSON encodes dates', function () {
            var value = new Date();
            Cookies.set(cookieKey, value);
            expect(document.cookie).toContain(cookieKey + '=' + JSON.stringify(value).replace(/[^!#-+\--:<-[\]-~]/g, encodeURIComponent));
        });
        
        it('URI encodes the cookie key', function () {
            var specialKey = 'key;with,special\tcharacters';
            Cookies.set(specialKey, 1);
            expect(document.cookie).toContain(encodeURIComponent(specialKey) + '=1');
            Cookies.expire(specialKey);
        });
        
        it('URI encodes special characters in the cookie value as defined by RFC6265', function () {
            var value = '|piñata=papier-mâché, and\t\\"candy";|';
            Cookies.set(cookieKey, value);
            // Value is actually JSON encoded, then URI encoded
            expect(document.cookie).toContain(cookieKey + '=%22|pi%C3%B1ata=papier-m%C3%A2ch%C3%A9%2C%20and%5Ct%5C%5C%5C%22candy%5C%22%3B|%22');
        });
        
        // No way to know if a cookie is actually secure unless HTTP is used.
        if (window.location.protocol === 'http:') {
            it('sets secure cookies when "options.secure" is true', function () {
                Cookies.set(cookieKey, 1, { secure: true });
                expect(document.cookie).not.toContain(cookieKey + '=');
                Cookies.set(cookieKey, 1, { secure: false });
            });
            
            it('overrides the "Cookies.default.secure" value when set in "options.secure"', function () {
                Cookies.defaults.secure = true;
                Cookies.set(cookieKey, 2, { secure: false });
                expect(document.cookie).toContain(cookieKey + '=2');
                
                Cookies.defaults.secure = false;
                Cookies.set(cookieKey, 2, { secure: true });
                expect(document.cookie).not.toContain(cookieKey + '=2');
            });
        }
    });
    
    describe('.expire(key [, options])', function () {
        it('returns the "Cookies" object', function () {
            expect(Cookies.expire(cookieKey)).toBe(Cookies);
        });
        
        it('removes a cookie from "document.cookie"', function () {
            expect(document.cookie).not.toContain(cookieKey + '=');
        });
        
        it('is aliased by "Cookies(key, undefined)"', function () {
            Cookies.set(cookieKey, 1);
            Cookies(cookieKey, undefined);
            expect(document.cookie).not.toContain(cookieKey + '=');
        });
    });
    
    describe('.get(key)', function () {
        it('is aliased by calling "Cookies" as a function', function () {
            expect(Cookies.set(cookieKey, 1).get(cookieKey)).toEqual(Cookies(cookieKey));
        });
        
        it('returns the most locally scoped cookie value for a specific key', function () {
            Cookies.set(cookieKey, 2, { path: '/' });
            expect(Cookies.get(cookieKey)).toEqual(1);
            Cookies.expire(cookieKey, { path: '/' });
        });
        
        it('returns "undefined" for cookies that don\'t exist', function () {
            Cookies.expire(cookieKey);
            expect(Cookies.get(cookieKey)).toBeUndefined();
        });
    
        it('parses JSON encoded numbers', function () {
            expect(Cookies.set(cookieKey, 1).get(cookieKey)).toEqual(1);
        });
        
        it('parses JSON encoded strings', function () {
            expect(Cookies.set(cookieKey, '1').get(cookieKey)).toEqual('1');
        });
        
        it('parses JSON encoded arrays', function () {
            expect(Cookies.set(cookieKey, [1, 2, 3]).get(cookieKey)).toEqual([1, 2, 3]);
        });
        
        it('parses JSON encoded objects', function () {
            expect(Cookies.set(cookieKey, { key: 'value' }).get(cookieKey)).toEqual({ key: 'value' });
        });
        
        it('caches cookie values', function () {
            Cookies.set(cookieKey, 1).get(cookieKey);
            expect(Cookies._cache[cookieKey]).toEqual(1);
        });
    });
});