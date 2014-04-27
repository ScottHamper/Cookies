/*!
 * Cookies.d.ts
 *
 * Copyright (c) 2014, Scott Hamper
 * Licensed under the MIT license,
 * http://www.opensource.org/licenses/MIT
 */
 
interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: any;
    secure?: boolean;
}

interface CookiesStatic {
    (key:string, value?:any, options?:CookieOptions): any;

    get(key:string): string;
    set(key:string, value:any, options?:CookieOptions): CookiesStatic;
    expire(key:string, options?:CookieOptions): CookiesStatic;

    defaults: CookieOptions;
    enabled: boolean;
}

declare var Cookies:CookiesStatic;

declare module "cookies" {
    export = Cookies;
}