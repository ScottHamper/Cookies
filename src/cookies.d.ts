/*!
 * Cookies.d.ts - 0.1
 * TypeScript declaration file for Cookies.js 0.3.0
 * Tuesday, February 12 2013 @ 12:33 AM EST
 *
 * Copyright (c) 2013, Scott Hamper
 * Licensed under the MIT license,
 * http://www.opensource.org/licenses/MIT
 */
 
interface CookieOptions {
    path: string;
    domain: string;
    expires: any;
    secure: bool;
}

interface CookiesStatic {
    (key: string, value?: any, options?: CookieOptions): any;
    
    get(key: string): string;
    set(key: string, value: any, options?: CookieOptions): CookiesStatic;
    expire(key: string, options?: CookieOptions): CookiesStatic;
    
    defaults: CookieOptions;
    enabled: bool;
}

declare var Cookies: CookiesStatic;