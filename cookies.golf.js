/*! Cookies.js - 0.2.0; Copyright (c) 2012, Scott Hamper; http://www.opensource.org/licenses/MIT */
(function(f,e){
    var a=function(){
        var r=arguments;
        return 1===r.length?a.get(r[0]):a.set(r[0],r[1],r[2])
    },
    z,
    y='domain',
    x='expires';
        
    a.get=function(c){
        f!==a.s&&a.p();
        return a.c[c]
    };
    z=a.defaults={path:'/'};
    a.set = function (c, d, b) {
        b = {
            path:b&&b.path||z.path,
            domain:b&&b[y]||z[y],
            expires:b&&b[x]||z[x],
            secure:b&&b.secure !== e ? b.secure : z.secure
        };
        d === e && (b[x] = -1, d = '');
        switch (typeof b[x]) {
        case 'number':
            b[x] = new Date((new Date).getTime() + 1E3 * b[x]);
            break;
        case 'string':
            b[x] = new Date(b[x])
        }
        c = encodeURIComponent(c) + '=' + (d + '').replace(/[^!#-+\--:<-[\]-~]/g, encodeURIComponent);
        c += b.path ? ';path=' + b.path : '';
        c += b[y] ? ';'+y+'=' + b[y] : '';
        c += b[x] ? ';'+x+'=' + b[x].toGMTString() : '';
        c += b.secure ? ';secure' : '';
        f = c;
        return a
    };
    a.expire = function (c, d) {
        return a.set(c, e, d)
    };
    a.p = function () {
        a.c = {};
        a.s = f;
        for (var c = a.s.split('; '), d = 0; d < c.length; d++) {
            var b = c[d].indexOf('='),
                g = decodeURIComponent(c[d].substr(0, b)),
                b = decodeURIComponent(c[d].substr(b + 1));
            a.c[g] === e && (a.c[g] = b)
        }
    };
    a.enabled = function () {
        var c = '1' === a('cookies.js', 1)('cookies.js');
        a.expire('cookies.js');
        return c
    }();
    'function' === typeof define && define.amd ? define(function () {
        return a
    }) : 'undefined' !== typeof exports ? ('undefined' != typeof module && module.exports && (exports = module.exports = a), exports.Cookies = a) : window.Cookies = a
})(document.cookie);