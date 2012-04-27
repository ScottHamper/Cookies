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

    it('contains a boolean property named "enabled"', function () {
        expect(Cookies.enabled).toBeBoolean();
    });
    
    it('contains an empty object property named "defaults"', function () {
        expect(Cookies.defaults).toEqual({});
    });
    
    var cookieKey = 'cookies-spec.js';
    describe('.set(key, value [, options])', function () {
        it('returns the "Cookies" object', function () {
            expect(Cookies.set(cookieKey)).toBe(Cookies);
        });
        
        it('sets a cookie in "document.cookie"', function () {
            expect(document.cookie.indexOf(cookieKey + '=')).not.toBeLessThan(0);
        });
    });
    
    describe('.get(key)', function () {
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
        
        it('caches cookies', function () {
            Cookies.set(cookieKey, 1).get(cookieKey);
            expect(Cookies._cache[cookieKey]).toEqual(1);
        });
    });
    
    describe('.expire(key [, options])', function () {
        it('returns the "Cookies" object', function () {
            expect(Cookies.expire(cookieKey)).toBe(Cookies);
        });
        
        it('expires a cookie', function () {
            expect(Cookies.get(cookieKey)).toBeUndefined();
            expect(document.cookie.indexOf(cookieKey + '=')).toBeLessThan(0);
        });
    });
});