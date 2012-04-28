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
    
    var cookieKey = 'cookies-spec.js';
    describe('.set(key, value [, options])', function () {
        it('returns the "Cookies" object', function () {
            expect(Cookies.set(cookieKey)).toBe(Cookies);
        });
        
        it('sets a cookie in "document.cookie"', function () {
            expect(document.cookie).toContain(cookieKey + '=');
        });
        
        it('JSON encodes numbers', function () {
            Cookies.set(cookieKey, 1);
            expect(document.cookie).toContain(cookieKey + '=' + escape(JSON.stringify(1)));
        });
        
        it('JSON encodes strings', function () {
            Cookies.set(cookieKey, '1');
            expect(document.cookie).toContain(cookieKey + '=' + escape(JSON.stringify('1')));
        });
        
        it('JSON encodes arrays', function () {
            Cookies.set(cookieKey, [1, 2, 3]);
            expect(document.cookie).toContain(cookieKey + '=' + escape(JSON.stringify([1, 2, 3])));
        });
        
        it('JSON encodes objects', function () {
            Cookies.set(cookieKey, { key: 'value' });
            expect(document.cookie).toContain(cookieKey + '=' + escape(JSON.stringify({ key: 'value' })));
        });
        
        it('JSON encodes dates', function () {
            var date = new Date();
            Cookies.set(cookieKey, date);
            expect(document.cookie).toContain(cookieKey + '=' + escape(JSON.stringify(date)));
        });
        
        // No way to know if a cookie is actually secure unless HTTP is used.
        if (window.location.protocol === 'http:') {
            it('sets secure cookies when "options.secure" is true', function () {
                Cookies.set(cookieKey, 1, { secure: true });
                expect(document.cookie).not.toContain(cookieKey + '=');
                Cookies.set(cookieKey, 1, { secure: false });
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