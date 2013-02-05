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
            expect(Cookies.set(cookieKey, 'value')).toBe(Cookies);
        });
        
        it('sets a cookie in "document.cookie"', function () {
            expect(document.cookie).toContain(cookieKey + '=value');
        });
        
        it('is aliased by "Cookies(key, value [, options])"', function () {
            Cookies(cookieKey, 'monster');
            expect(document.cookie).toContain(cookieKey + '=monster');
        });
        
        it('URI encodes the cookie key', function () {
            var specialKey = 'key;with,special\tcharacters';
            Cookies.set(specialKey, 'value');
            expect(document.cookie).toContain(encodeURIComponent(specialKey) + '=value');
            Cookies.expire(specialKey);
        });
        
        it('URI encodes special characters in the cookie value as defined by RFC6265', function () {
            Cookies.set(cookieKey, '|piñata=papier-mâché, and\t\\"candy";|');
            expect(document.cookie).toContain(cookieKey + '=|pi%C3%B1ata=papier-m%C3%A2ch%C3%A9%2C%20and%09%5C%22candy%22%3B|');
        });
        
        // No way to know if a cookie is actually secure unless HTTP is used.
        if (window.location.protocol === 'http:') {
            it('sets secure cookies when "options.secure" is true', function () {
                Cookies.set(cookieKey, 'value', { secure: true });
                expect(document.cookie).not.toContain(cookieKey + '=');
            });
            
            it('overrides the "Cookies.default.secure" value when set in "options.secure"', function () {
                Cookies.defaults.secure = true;
                Cookies.set(cookieKey, 'value', { secure: false });
                expect(document.cookie).toContain(cookieKey + '=value');
                
                Cookies.defaults.secure = false;
                Cookies.set(cookieKey, 'value', { secure: true });
                expect(document.cookie).not.toContain(cookieKey + '=value');
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
            Cookies.set(cookieKey, 'value');
            Cookies(cookieKey, undefined);
            expect(document.cookie).not.toContain(cookieKey + '=');
        });
    });
    
    describe('.get(key)', function () {
        it('is aliased by calling "Cookies" as a function', function () {
            Cookies.set(cookieKey, 'value')
            expect(Cookies.get(cookieKey)).toEqual(Cookies(cookieKey));
        });
        
        it('returns the most locally scoped cookie value for a specific key', function () {
            Cookies.set(cookieKey, 'value');
            Cookies.set(cookieKey, 'monster', { path: '/' });
            expect(Cookies.get(cookieKey)).toEqual('value');
            Cookies.expire(cookieKey, { path: '/' });
        });
        
        it('returns "undefined" for cookies that don\'t exist', function () {
            Cookies.expire(cookieKey);
            expect(Cookies.get(cookieKey)).toBeUndefined();
        });
        
        it('caches cookie values', function () {
            Cookies.set(cookieKey, 'value').get(cookieKey);
            expect(Cookies._cache[cookieKey]).toEqual('value');
        });
    });
});