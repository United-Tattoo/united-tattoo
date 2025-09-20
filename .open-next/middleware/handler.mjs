
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.7.6";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse3;
    exports.serialize = serialize;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parse3(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1)
          break;
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        if (obj[key] === void 0) {
          let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          let valEndIdx = endIndex(str, endIdx, valStartIdx);
          const value = dec(str.slice(valStartIdx, valEndIdx));
          obj[key] = value;
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        const code = str.charCodeAt(index);
        if (code !== 32 && code !== 9)
          return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        const code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9)
          return index + 1;
      }
      return min;
    }
    function serialize(name, val, options) {
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
      }
      let str = name + "=" + value;
      if (!options)
        return str;
      if (options.maxAge !== void 0) {
        if (!Number.isInteger(options.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
      }
      if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
          throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
      }
      if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
          throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
      }
      if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
      }
      if (options.httpOnly) {
        str += "; HttpOnly";
      }
      if (options.secure) {
        str += "; Secure";
      }
      if (options.partitioned) {
        str += "; Partitioned";
      }
      if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
      }
      if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
      }
      return str;
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const body = await event.arrayBuffer();
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body: shouldHaveBody ? Buffer2.from(body) : void 0,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
var envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          const origin = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
          for (const [key, value] of Object.entries(globalThis.openNextConfig.functions ?? {}).filter(([key2]) => key2 !== "default")) {
            if (value.patterns.some((pattern) => {
              return new RegExp(
                // transform glob pattern to regex
                `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`
              ).test(_path);
            })) {
              debug("Using origin", key, value.patterns);
              return origin[key];
            }
          }
          if (_path.startsWith("/_next/image") && origin.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return origin.imageOptimizer;
          }
          if (origin.default) {
            debug("Using default origin", origin.default, _path);
            return origin.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { Readable } from "node:stream";
function toReadableStream(value, isBase64) {
  return Readable.toWeb(Readable.from(Buffer.from(value, isBase64 ? "base64" : "utf8")));
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return Readable.toWeb(Readable.from([Buffer.from("SOMETHING")]));
  }
  return Readable.toWeb(Readable.from([]));
}
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n) return n.exports;
        var i = r[o] = { exports: {} }, a = true;
        try {
          e[o](i, i.exports, t), a = false;
        } finally {
          a && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var a = e2.length; a > 0 && e2[a - 1][2] > i; a--) e2[a] = e2[a - 1];
            e2[a] = [o, n, i];
            return;
          }
          for (var l = 1 / 0, a = 0; a < e2.length; a++) {
            for (var [o, n, i] = e2[a], u = true, f = 0; f < o.length; f++) l >= i && Object.keys(t.O).every((e3) => t.O[e3](o[f])) ? o.splice(f--, 1) : (u = false, i < l && (l = i));
            if (u) {
              e2.splice(a--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.n = (e2) => {
        var r2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(r2, { a: r2 }), r2;
      }, t.d = (e2, r2) => {
        for (var o in r2) t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 993: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [a, l, u] = o2, f = 0;
          if (a.some((r4) => 0 !== e2[r4])) {
            for (n in l) t.o(l, n) && (t.m[n] = l[n]);
            if (u) var s = u(t);
          }
          for (r3 && r3(o2); f < a.length; f++) i = a[f], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/middleware.js
var require_middleware = __commonJS({
  ".next/server/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[826], { 67: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 195: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 441: (e, t, r) => {
      "use strict";
      let n;
      r.r(t), r.d(t, { default: () => eI });
      var a, i, o, s, c, l, d, u, p, h, f, g, y, w, m = {};
      async function b() {
        let e2 = "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && (await _ENTRIES.middleware_instrumentation).register;
        if (e2) try {
          await e2();
        } catch (e3) {
          throw e3.message = `An error occurred while loading instrumentation hook: ${e3.message}`, e3;
        }
      }
      r.r(m), r.d(m, { config: () => eR, default: () => ex });
      let v = null;
      function S() {
        return v || (v = b()), v;
      }
      function E(e2) {
        return `The edge runtime does not support Node.js '${e2}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e2) {
        let t2 = new Proxy(function() {
        }, { get(t3, r2) {
          if ("then" === r2) return {};
          throw Error(E(e2));
        }, construct() {
          throw Error(E(e2));
        }, apply(r2, n2, a2) {
          if ("function" == typeof a2[0]) return a2[0](t2);
          throw Error(E(e2));
        } });
        return new Proxy({}, { get: () => t2 });
      }, enumerable: false, configurable: false }), S();
      var _ = r(416), A = r(329);
      let P = Symbol("response"), C = Symbol("passThrough"), x = Symbol("waitUntil");
      class R {
        constructor(e2) {
          this[x] = [], this[C] = false;
        }
        respondWith(e2) {
          this[P] || (this[P] = Promise.resolve(e2));
        }
        passThroughOnException() {
          this[C] = true;
        }
        waitUntil(e2) {
          this[x].push(e2);
        }
      }
      class T extends R {
        constructor(e2) {
          super(e2.request), this.sourcePage = e2.page;
        }
        get request() {
          throw new _.qJ({ page: this.sourcePage });
        }
        respondWith() {
          throw new _.qJ({ page: this.sourcePage });
        }
      }
      var O = r(669), k = r(241);
      function I(e2, t2) {
        let r2 = "string" == typeof t2 ? new URL(t2) : t2, n2 = new URL(e2, t2), a2 = r2.protocol + "//" + r2.host;
        return n2.protocol + "//" + n2.host === a2 ? n2.toString().replace(a2, "") : n2.toString();
      }
      var N = r(718);
      let H = [["RSC"], ["Next-Router-State-Tree"], ["Next-Router-Prefetch"]], M = ["__nextFallback", "__nextLocale", "__nextInferredLocaleFromDefault", "__nextDefaultLocale", "__nextIsNotFound", "_rsc"], D = ["__nextDataReq"], U = "nxtP", W = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", api: "api", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", appMetadataRoute: "app-metadata-route", appRouteHandler: "app-route-handler" };
      ({ ...W, GROUP: { serverOnly: [W.reactServerComponents, W.actionBrowser, W.appMetadataRoute, W.appRouteHandler, W.instrument], clientOnly: [W.serverSideRendering, W.appPagesBrowser], nonClientServerTarget: [W.middleware, W.api], app: [W.reactServerComponents, W.actionBrowser, W.appMetadataRoute, W.appRouteHandler, W.serverSideRendering, W.appPagesBrowser, W.shared, W.instrument] } });
      var L = r(217);
      class K extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new K();
        }
      }
      class j extends Headers {
        constructor(e2) {
          super(), this.headers = new Proxy(e2, { get(t2, r2, n2) {
            if ("symbol" == typeof r2) return L.g.get(t2, r2, n2);
            let a2 = r2.toLowerCase(), i2 = Object.keys(e2).find((e3) => e3.toLowerCase() === a2);
            if (void 0 !== i2) return L.g.get(t2, i2, n2);
          }, set(t2, r2, n2, a2) {
            if ("symbol" == typeof r2) return L.g.set(t2, r2, n2, a2);
            let i2 = r2.toLowerCase(), o2 = Object.keys(e2).find((e3) => e3.toLowerCase() === i2);
            return L.g.set(t2, o2 ?? r2, n2, a2);
          }, has(t2, r2) {
            if ("symbol" == typeof r2) return L.g.has(t2, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e2).find((e3) => e3.toLowerCase() === n2);
            return void 0 !== a2 && L.g.has(t2, a2);
          }, deleteProperty(t2, r2) {
            if ("symbol" == typeof r2) return L.g.deleteProperty(t2, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e2).find((e3) => e3.toLowerCase() === n2);
            return void 0 === a2 || L.g.deleteProperty(t2, a2);
          } });
        }
        static seal(e2) {
          return new Proxy(e2, { get(e3, t2, r2) {
            switch (t2) {
              case "append":
              case "delete":
              case "set":
                return K.callable;
              default:
                return L.g.get(e3, t2, r2);
            }
          } });
        }
        merge(e2) {
          return Array.isArray(e2) ? e2.join(", ") : e2;
        }
        static from(e2) {
          return e2 instanceof Headers ? e2 : new j(e2);
        }
        append(e2, t2) {
          let r2 = this.headers[e2];
          "string" == typeof r2 ? this.headers[e2] = [r2, t2] : Array.isArray(r2) ? r2.push(t2) : this.headers[e2] = t2;
        }
        delete(e2) {
          delete this.headers[e2];
        }
        get(e2) {
          let t2 = this.headers[e2];
          return void 0 !== t2 ? this.merge(t2) : null;
        }
        has(e2) {
          return void 0 !== this.headers[e2];
        }
        set(e2, t2) {
          this.headers[e2] = t2;
        }
        forEach(e2, t2) {
          for (let [r2, n2] of this.entries()) e2.call(t2, n2, r2, this);
        }
        *entries() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = e2.toLowerCase(), r2 = this.get(t2);
            yield [t2, r2];
          }
        }
        *keys() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = e2.toLowerCase();
            yield t2;
          }
        }
        *values() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = this.get(e2);
            yield t2;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      var J = r(938);
      let B = Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
      class $ {
        disable() {
          throw B;
        }
        getStore() {
        }
        run() {
          throw B;
        }
        exit() {
          throw B;
        }
        enterWith() {
          throw B;
        }
      }
      let V = globalThis.AsyncLocalStorage;
      function G() {
        return V ? new V() : new $();
      }
      let q = G();
      class F extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
        }
        static callable() {
          throw new F();
        }
      }
      class z {
        static seal(e2) {
          return new Proxy(e2, { get(e3, t2, r2) {
            switch (t2) {
              case "clear":
              case "delete":
              case "set":
                return F.callable;
              default:
                return L.g.get(e3, t2, r2);
            }
          } });
        }
      }
      let X = Symbol.for("next.mutated.cookies");
      class Y {
        static wrap(e2, t2) {
          let r2 = new J.nV(new Headers());
          for (let t3 of e2.getAll()) r2.set(t3);
          let n2 = [], a2 = /* @__PURE__ */ new Set(), i2 = () => {
            let e3 = q.getStore();
            if (e3 && (e3.pathWasRevalidated = true), n2 = r2.getAll().filter((e4) => a2.has(e4.name)), t2) {
              let e4 = [];
              for (let t3 of n2) {
                let r3 = new J.nV(new Headers());
                r3.set(t3), e4.push(r3.toString());
              }
              t2(e4);
            }
          };
          return new Proxy(r2, { get(e3, t3, r3) {
            switch (t3) {
              case X:
                return n2;
              case "delete":
                return function(...t4) {
                  a2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    e3.delete(...t4);
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t4) {
                  a2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    return e3.set(...t4);
                  } finally {
                    i2();
                  }
                };
              default:
                return L.g.get(e3, t3, r3);
            }
          } });
        }
      }
      !function(e2) {
        e2.handleRequest = "BaseServer.handleRequest", e2.run = "BaseServer.run", e2.pipe = "BaseServer.pipe", e2.getStaticHTML = "BaseServer.getStaticHTML", e2.render = "BaseServer.render", e2.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e2.renderToResponse = "BaseServer.renderToResponse", e2.renderToHTML = "BaseServer.renderToHTML", e2.renderError = "BaseServer.renderError", e2.renderErrorToResponse = "BaseServer.renderErrorToResponse", e2.renderErrorToHTML = "BaseServer.renderErrorToHTML", e2.render404 = "BaseServer.render404";
      }(a || (a = {})), function(e2) {
        e2.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e2.loadComponents = "LoadComponents.loadComponents";
      }(i || (i = {})), function(e2) {
        e2.getRequestHandler = "NextServer.getRequestHandler", e2.getServer = "NextServer.getServer", e2.getServerRequestHandler = "NextServer.getServerRequestHandler", e2.createServer = "createServer.createServer";
      }(o || (o = {})), function(e2) {
        e2.compression = "NextNodeServer.compression", e2.getBuildId = "NextNodeServer.getBuildId", e2.createComponentTree = "NextNodeServer.createComponentTree", e2.clientComponentLoading = "NextNodeServer.clientComponentLoading", e2.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e2.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e2.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e2.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e2.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e2.sendRenderResult = "NextNodeServer.sendRenderResult", e2.proxyRequest = "NextNodeServer.proxyRequest", e2.runApi = "NextNodeServer.runApi", e2.render = "NextNodeServer.render", e2.renderHTML = "NextNodeServer.renderHTML", e2.imageOptimizer = "NextNodeServer.imageOptimizer", e2.getPagePath = "NextNodeServer.getPagePath", e2.getRoutesManifest = "NextNodeServer.getRoutesManifest", e2.findPageComponents = "NextNodeServer.findPageComponents", e2.getFontManifest = "NextNodeServer.getFontManifest", e2.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e2.getRequestHandler = "NextNodeServer.getRequestHandler", e2.renderToHTML = "NextNodeServer.renderToHTML", e2.renderError = "NextNodeServer.renderError", e2.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e2.render404 = "NextNodeServer.render404", e2.startResponse = "NextNodeServer.startResponse", e2.route = "route", e2.onProxyReq = "onProxyReq", e2.apiResolver = "apiResolver", e2.internalFetch = "internalFetch";
      }(s || (s = {})), (c || (c = {})).startServer = "startServer.startServer", function(e2) {
        e2.getServerSideProps = "Render.getServerSideProps", e2.getStaticProps = "Render.getStaticProps", e2.renderToString = "Render.renderToString", e2.renderDocument = "Render.renderDocument", e2.createBodyResult = "Render.createBodyResult";
      }(l || (l = {})), function(e2) {
        e2.renderToString = "AppRender.renderToString", e2.renderToReadableStream = "AppRender.renderToReadableStream", e2.getBodyResult = "AppRender.getBodyResult", e2.fetch = "AppRender.fetch";
      }(d || (d = {})), (u || (u = {})).executeRoute = "Router.executeRoute", (p || (p = {})).runHandler = "Node.runHandler", (h || (h = {})).runHandler = "AppRouteRouteHandlers.runHandler", function(e2) {
        e2.generateMetadata = "ResolveMetadata.generateMetadata", e2.generateViewport = "ResolveMetadata.generateViewport";
      }(f || (f = {})), (g || (g = {})).execute = "Middleware.execute";
      let Z = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], Q = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"], { context: ee, propagation: et, trace: er, SpanStatusCode: en, SpanKind: ea, ROOT_CONTEXT: ei } = n = r(439), eo = (e2) => null !== e2 && "object" == typeof e2 && "function" == typeof e2.then, es = (e2, t2) => {
        (null == t2 ? void 0 : t2.bubble) === true ? e2.setAttribute("next.bubble", true) : (t2 && e2.recordException(t2), e2.setStatus({ code: en.ERROR, message: null == t2 ? void 0 : t2.message })), e2.end();
      }, ec = /* @__PURE__ */ new Map(), el = n.createContextKey("next.rootSpanId"), ed = 0, eu = () => ed++;
      class ep {
        getTracerInstance() {
          return er.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return ee;
        }
        getActiveScopeSpan() {
          return er.getSpan(null == ee ? void 0 : ee.active());
        }
        withPropagatedContext(e2, t2, r2) {
          let n2 = ee.active();
          if (er.getSpanContext(n2)) return t2();
          let a2 = et.extract(n2, e2, r2);
          return ee.with(a2, t2);
        }
        trace(...e2) {
          var t2;
          let [r2, n2, a2] = e2, { fn: i2, options: o2 } = "function" == typeof n2 ? { fn: n2, options: {} } : { fn: a2, options: { ...n2 } }, s2 = o2.spanName ?? r2;
          if (!Z.includes(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || o2.hideSpan) return i2();
          let c2 = this.getSpanContext((null == o2 ? void 0 : o2.parentSpan) ?? this.getActiveScopeSpan()), l2 = false;
          c2 ? (null == (t2 = er.getSpanContext(c2)) ? void 0 : t2.isRemote) && (l2 = true) : (c2 = (null == ee ? void 0 : ee.active()) ?? ei, l2 = true);
          let d2 = eu();
          return o2.attributes = { "next.span_name": s2, "next.span_type": r2, ...o2.attributes }, ee.with(c2.setValue(el, d2), () => this.getTracerInstance().startActiveSpan(s2, o2, (e3) => {
            let t3 = "performance" in globalThis ? globalThis.performance.now() : void 0, n3 = () => {
              ec.delete(d2), t3 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && Q.includes(r2 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e4) => "-" + e4.toLowerCase())}`, { start: t3, end: performance.now() });
            };
            l2 && ec.set(d2, new Map(Object.entries(o2.attributes ?? {})));
            try {
              if (i2.length > 1) return i2(e3, (t5) => es(e3, t5));
              let t4 = i2(e3);
              if (eo(t4)) return t4.then((t5) => (e3.end(), t5)).catch((t5) => {
                throw es(e3, t5), t5;
              }).finally(n3);
              return e3.end(), n3(), t4;
            } catch (t4) {
              throw es(e3, t4), n3(), t4;
            }
          }));
        }
        wrap(...e2) {
          let t2 = this, [r2, n2, a2] = 3 === e2.length ? e2 : [e2[0], {}, e2[1]];
          return Z.includes(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e3 = n2;
            "function" == typeof e3 && "function" == typeof a2 && (e3 = e3.apply(this, arguments));
            let i2 = arguments.length - 1, o2 = arguments[i2];
            if ("function" != typeof o2) return t2.trace(r2, e3, () => a2.apply(this, arguments));
            {
              let n3 = t2.getContext().bind(ee.active(), o2);
              return t2.trace(r2, e3, (e4, t3) => (arguments[i2] = function(e5) {
                return null == t3 || t3(e5), n3.apply(this, arguments);
              }, a2.apply(this, arguments)));
            }
          } : a2;
        }
        startSpan(...e2) {
          let [t2, r2] = e2, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t2, r2, n2);
        }
        getSpanContext(e2) {
          return e2 ? er.setSpan(ee.active(), e2) : void 0;
        }
        getRootSpanAttributes() {
          let e2 = ee.active().getValue(el);
          return ec.get(e2);
        }
      }
      let eh = (() => {
        let e2 = new ep();
        return () => e2;
      })(), ef = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(ef);
      class eg {
        constructor(e2, t2, r2, n2) {
          var a2;
          let i2 = e2 && function(e3, t3) {
            let r3 = j.from(e3.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t3.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t2, e2).isOnDemandRevalidate, o2 = null == (a2 = r2.get(ef)) ? void 0 : a2.value;
          this.isEnabled = !!(!i2 && o2 && e2 && o2 === e2.previewModeId), this._previewModeId = null == e2 ? void 0 : e2.previewModeId, this._mutableCookies = n2;
        }
        enable() {
          if (!this._previewModeId) throw Error("Invariant: previewProps missing previewModeId this should never happen");
          this._mutableCookies.set({ name: ef, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" });
        }
        disable() {
          this._mutableCookies.set({ name: ef, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) });
        }
      }
      function ey(e2, t2) {
        if ("x-middleware-set-cookie" in e2.headers && "string" == typeof e2.headers["x-middleware-set-cookie"]) {
          let r2 = e2.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e3 of (0, A.l$)(r2)) n2.append("set-cookie", e3);
          for (let e3 of new J.nV(n2).getAll()) t2.set(e3);
        }
      }
      let ew = { wrap(e2, { req: t2, res: r2, renderOpts: n2 }, a2) {
        let i2;
        function o2(e3) {
          r2 && r2.setHeader("Set-Cookie", e3);
        }
        n2 && "previewProps" in n2 && (i2 = n2.previewProps);
        let s2 = {}, c2 = { get headers() {
          return s2.headers || (s2.headers = function(e3) {
            let t3 = j.from(e3);
            for (let e4 of H) t3.delete(e4.toString().toLowerCase());
            return j.seal(t3);
          }(t2.headers)), s2.headers;
        }, get cookies() {
          if (!s2.cookies) {
            let e3 = new J.qC(j.from(t2.headers));
            ey(t2, e3), s2.cookies = z.seal(e3);
          }
          return s2.cookies;
        }, get mutableCookies() {
          if (!s2.mutableCookies) {
            let e3 = function(e4, t3) {
              let r3 = new J.qC(j.from(e4));
              return Y.wrap(r3, t3);
            }(t2.headers, (null == n2 ? void 0 : n2.onUpdateCookies) || (r2 ? o2 : void 0));
            ey(t2, e3), s2.mutableCookies = e3;
          }
          return s2.mutableCookies;
        }, get draftMode() {
          return s2.draftMode || (s2.draftMode = new eg(i2, t2, this.cookies, this.mutableCookies)), s2.draftMode;
        }, reactLoadableManifest: (null == n2 ? void 0 : n2.reactLoadableManifest) || {}, assetPrefix: (null == n2 ? void 0 : n2.assetPrefix) || "" };
        return e2.run(c2, a2, c2);
      } }, em = G();
      function eb() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      class ev extends O.I {
        constructor(e2) {
          super(e2.input, e2.init), this.sourcePage = e2.page;
        }
        get request() {
          throw new _.qJ({ page: this.sourcePage });
        }
        respondWith() {
          throw new _.qJ({ page: this.sourcePage });
        }
        waitUntil() {
          throw new _.qJ({ page: this.sourcePage });
        }
      }
      let eS = { keys: (e2) => Array.from(e2.keys()), get: (e2, t2) => e2.get(t2) ?? void 0 }, eE = (e2, t2) => eh().withPropagatedContext(e2.headers, t2, eS), e_ = false;
      async function eA(e2) {
        let t2, n2;
        !function() {
          if (!e_ && (e_ = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: e3, wrapRequestHandler: t3 } = r(177);
            e3(), eE = t3(eE);
          }
        }(), await S();
        let a2 = void 0 !== self.__BUILD_MANIFEST;
        e2.request.url = e2.request.url.replace(/\.rsc($|\?)/, "$1");
        let i2 = new N.c(e2.request.url, { headers: e2.request.headers, nextConfig: e2.request.nextConfig });
        for (let e3 of [...i2.searchParams.keys()]) {
          let t3 = i2.searchParams.getAll(e3);
          if (e3 !== U && e3.startsWith(U)) {
            let r2 = e3.substring(U.length);
            for (let e4 of (i2.searchParams.delete(r2), t3)) i2.searchParams.append(r2, e4);
            i2.searchParams.delete(e3);
          }
        }
        let o2 = i2.buildId;
        i2.buildId = "";
        let s2 = e2.request.headers["x-nextjs-data"];
        s2 && "/index" === i2.pathname && (i2.pathname = "/");
        let c2 = (0, A.EK)(e2.request.headers), l2 = /* @__PURE__ */ new Map();
        if (!a2) for (let e3 of H) {
          let t3 = e3.toString().toLowerCase();
          c2.get(t3) && (l2.set(t3, c2.get(t3)), c2.delete(t3));
        }
        let d2 = new ev({ page: e2.page, input: function(e3, t3) {
          let r2 = "string" == typeof e3, n3 = r2 ? new URL(e3) : e3;
          for (let e4 of M) n3.searchParams.delete(e4);
          if (t3) for (let e4 of D) n3.searchParams.delete(e4);
          return r2 ? n3.toString() : n3;
        }(i2, true).toString(), init: { body: e2.request.body, geo: e2.request.geo, headers: c2, ip: e2.request.ip, method: e2.request.method, nextConfig: e2.request.nextConfig, signal: e2.request.signal } });
        s2 && Object.defineProperty(d2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCache && e2.IncrementalCache && (globalThis.__incrementalCache = new e2.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e2.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: eb() }) }));
        let u2 = new T({ request: d2, page: e2.page });
        if ((t2 = await eE(d2, () => "/middleware" === e2.page || "/src/middleware" === e2.page ? eh().trace(g.execute, { spanName: `middleware ${d2.method} ${d2.nextUrl.pathname}`, attributes: { "http.target": d2.nextUrl.pathname, "http.method": d2.method } }, () => ew.wrap(em, { req: d2, renderOpts: { onUpdateCookies: (e3) => {
          n2 = e3;
        }, previewProps: eb() } }, () => e2.handler(d2, u2))) : e2.handler(d2, u2))) && !(t2 instanceof Response)) throw TypeError("Expected an instance of Response to be returned");
        t2 && n2 && t2.headers.set("set-cookie", n2);
        let p2 = null == t2 ? void 0 : t2.headers.get("x-middleware-rewrite");
        if (t2 && p2 && !a2) {
          let r2 = new N.c(p2, { forceLocale: true, headers: e2.request.headers, nextConfig: e2.request.nextConfig });
          r2.host === d2.nextUrl.host && (r2.buildId = o2 || r2.buildId, t2.headers.set("x-middleware-rewrite", String(r2)));
          let n3 = I(String(r2), String(i2));
          s2 && t2.headers.set("x-nextjs-rewrite", n3);
        }
        let h2 = null == t2 ? void 0 : t2.headers.get("Location");
        if (t2 && h2 && !a2) {
          let r2 = new N.c(h2, { forceLocale: false, headers: e2.request.headers, nextConfig: e2.request.nextConfig });
          t2 = new Response(t2.body, t2), r2.host === d2.nextUrl.host && (r2.buildId = o2 || r2.buildId, t2.headers.set("Location", String(r2))), s2 && (t2.headers.delete("Location"), t2.headers.set("x-nextjs-redirect", I(String(r2), String(i2))));
        }
        let f2 = t2 || k.x.next(), y2 = f2.headers.get("x-middleware-override-headers"), w2 = [];
        if (y2) {
          for (let [e3, t3] of l2) f2.headers.set(`x-middleware-request-${e3}`, t3), w2.push(e3);
          w2.length > 0 && f2.headers.set("x-middleware-override-headers", y2 + "," + w2.join(","));
        }
        return { response: f2, waitUntil: Promise.all(u2[x]), fetchMetrics: d2.fetchMetrics };
      }
      var eP = r(784), eC = r(635);
      !function(e2) {
        e2.SUPER_ADMIN = "SUPER_ADMIN", e2.SHOP_ADMIN = "SHOP_ADMIN", e2.ARTIST = "ARTIST", e2.CLIENT = "CLIENT";
      }(y || (y = {})), function(e2) {
        e2.PENDING = "PENDING", e2.CONFIRMED = "CONFIRMED", e2.IN_PROGRESS = "IN_PROGRESS", e2.COMPLETED = "COMPLETED", e2.CANCELLED = "CANCELLED";
      }(w || (w = {}));
      let ex = (0, eP.withAuth)(function(e2) {
        let t2 = e2.nextauth.token, { pathname: r2 } = e2.nextUrl;
        if (r2.startsWith("/admin")) {
          if (!t2) return eC.NextResponse.redirect(new URL("/auth/signin", e2.url));
          let r3 = t2.role;
          if (r3 !== y.SHOP_ADMIN && r3 !== y.SUPER_ADMIN) return eC.NextResponse.redirect(new URL("/unauthorized", e2.url));
        }
        if (r2.startsWith("/artist")) {
          if (!t2) return eC.NextResponse.redirect(new URL("/auth/signin", e2.url));
          let r3 = t2.role;
          if (r3 !== y.ARTIST && r3 !== y.SHOP_ADMIN && r3 !== y.SUPER_ADMIN) return eC.NextResponse.redirect(new URL("/unauthorized", e2.url));
        }
        if (r2.startsWith("/api/admin")) {
          if (!t2) return eC.NextResponse.json({ error: "Authentication required" }, { status: 401 });
          let e3 = t2.role;
          if (e3 !== y.SHOP_ADMIN && e3 !== y.SUPER_ADMIN) return eC.NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }
        return eC.NextResponse.next();
      }, { callbacks: { authorized: ({ token: e2, req: t2 }) => {
        let { pathname: r2 } = t2.nextUrl;
        return !!(["/", "/artists", "/contact", "/book", "/aftercare", "/gift-cards", "/specials", "/terms", "/privacy", "/auth/signin", "/auth/error", "/unauthorized"].some((e3) => r2 === e3 || r2.startsWith(e3)) || r2.match(/^\/artists\/[^\/]+$/) || r2.startsWith("/api/auth") || r2.startsWith("/api/public")) || !!e2;
      } } }), eR = { matcher: ["/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)"] }, eT = { ...m }, eO = eT.middleware || eT.default, ek = "/middleware";
      if ("function" != typeof eO) throw Error(`The Middleware "${ek}" must export a \`middleware\` or a \`default\` function`);
      function eI(e2) {
        return eA({ ...e2, page: ek, handler: eO });
      }
    }, 282: (e, t) => {
      "use strict";
      function r(e2, t2, r2) {
        n(e2, t2), t2.set(e2, r2);
      }
      function n(e2, t2) {
        if (t2.has(e2)) throw TypeError("Cannot initialize the same private elements twice on an object");
      }
      function a(e2, t2) {
        return e2.get(o(e2, t2));
      }
      function i(e2, t2, r2) {
        return e2.set(o(e2, t2), r2), r2;
      }
      function o(e2, t2, r2) {
        if ("function" == typeof e2 ? e2 === t2 : e2.has(t2)) return arguments.length < 3 ? t2 : r2;
        throw TypeError("Private element is not present on this object");
      }
      Object.defineProperty(t, "__esModule", { value: true }), t.SessionStore = void 0, t.defaultCookies = function(e2) {
        let t2 = e2 ? "__Secure-" : "";
        return { sessionToken: { name: `${t2}next-auth.session-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e2 } }, callbackUrl: { name: `${t2}next-auth.callback-url`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e2 } }, csrfToken: { name: `${e2 ? "__Host-" : ""}next-auth.csrf-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e2 } }, pkceCodeVerifier: { name: `${t2}next-auth.pkce.code_verifier`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e2, maxAge: 900 } }, state: { name: `${t2}next-auth.state`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e2, maxAge: 900 } }, nonce: { name: `${t2}next-auth.nonce`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e2 } } };
      };
      var s = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakSet();
      class u {
        constructor(e2, t2, o2) {
          !function(e3, t3) {
            n(e3, t3), t3.add(e3);
          }(this, d), r(this, s, {}), r(this, c, void 0), r(this, l, void 0), i(l, this, o2), i(c, this, e2);
          let { cookies: u2 } = t2, { name: p2 } = e2;
          if ("function" == typeof (null == u2 ? void 0 : u2.getAll)) for (let { name: e3, value: t3 } of u2.getAll()) e3.startsWith(p2) && (a(s, this)[e3] = t3);
          else if (u2 instanceof Map) for (let e3 of u2.keys()) e3.startsWith(p2) && (a(s, this)[e3] = u2.get(e3));
          else for (let e3 in u2) e3.startsWith(p2) && (a(s, this)[e3] = u2[e3]);
        }
        get value() {
          return Object.keys(a(s, this)).sort((e2, t2) => {
            var r2, n2;
            return parseInt(null !== (r2 = e2.split(".").pop()) && void 0 !== r2 ? r2 : "0") - parseInt(null !== (n2 = t2.split(".").pop()) && void 0 !== n2 ? n2 : "0");
          }).map((e2) => a(s, this)[e2]).join("");
        }
        chunk(e2, t2) {
          let r2 = o(d, this, h).call(this);
          for (let n2 of o(d, this, p).call(this, { name: a(c, this).name, value: e2, options: { ...a(c, this).options, ...t2 } })) r2[n2.name] = n2;
          return Object.values(r2);
        }
        clean() {
          return Object.values(o(d, this, h).call(this));
        }
      }
      function p(e2) {
        let t2 = Math.ceil(e2.value.length / 3933);
        if (1 === t2) return a(s, this)[e2.name] = e2.value, [e2];
        let r2 = [];
        for (let n2 = 0; n2 < t2; n2++) {
          let t3 = `${e2.name}.${n2}`, i2 = e2.value.substr(3933 * n2, 3933);
          r2.push({ ...e2, name: t3, value: i2 }), a(s, this)[t3] = i2;
        }
        return a(l, this).debug("CHUNKING_SESSION_COOKIE", { message: "Session cookie exceeds allowed 4096 bytes.", emptyCookieSize: 163, valueSize: e2.value.length, chunks: r2.map((e3) => e3.value.length + 163) }), r2;
      }
      function h() {
        let e2 = {};
        for (let r2 in a(s, this)) {
          var t2;
          null === (t2 = a(s, this)) || void 0 === t2 || delete t2[r2], e2[r2] = { name: r2, value: "", options: { ...a(c, this).options, maxAge: 0 } };
        }
        return e2;
      }
      t.SessionStore = u;
    }, 859: (e, t, r) => {
      "use strict";
      var n = r(476);
      Object.defineProperty(t, "__esModule", { value: true });
      var a = { encode: true, decode: true, getToken: true };
      t.decode = p, t.encode = u, t.getToken = h;
      var i = r(507), o = n(r(728)), s = r(532), c = r(282), l = r(555);
      Object.keys(l).forEach(function(e2) {
        !("default" === e2 || "__esModule" === e2 || Object.prototype.hasOwnProperty.call(a, e2)) && (e2 in t && t[e2] === l[e2] || Object.defineProperty(t, e2, { enumerable: true, get: function() {
          return l[e2];
        } }));
      });
      let d = () => Date.now() / 1e3 | 0;
      async function u(e2) {
        let { token: t2 = {}, secret: r2, maxAge: n2 = 2592e3, salt: a2 = "" } = e2, o2 = await f(r2, a2);
        return await new i.EncryptJWT(t2).setProtectedHeader({ alg: "dir", enc: "A256GCM" }).setIssuedAt().setExpirationTime(d() + n2).setJti((0, s.v4)()).encrypt(o2);
      }
      async function p(e2) {
        let { token: t2, secret: r2, salt: n2 = "" } = e2;
        if (!t2) return null;
        let a2 = await f(r2, n2), { payload: o2 } = await (0, i.jwtDecrypt)(t2, a2, { clockTolerance: 15 });
        return o2;
      }
      async function h(e2) {
        var t2, r2, n2, a2;
        let { req: i2, secureCookie: o2 = null !== (t2 = null === (r2 = process.env.NEXTAUTH_URL) || void 0 === r2 ? void 0 : r2.startsWith("https://")) && void 0 !== t2 ? t2 : !!process.env.VERCEL, cookieName: s2 = o2 ? "__Secure-next-auth.session-token" : "next-auth.session-token", raw: l2, decode: d2 = p, logger: u2 = console, secret: h2 = null !== (n2 = process.env.NEXTAUTH_SECRET) && void 0 !== n2 ? n2 : process.env.AUTH_SECRET } = e2;
        if (!i2) throw Error("Must pass `req` to JWT getToken()");
        let f2 = new c.SessionStore({ name: s2, options: { secure: o2 } }, { cookies: i2.cookies, headers: i2.headers }, u2).value, g = i2.headers instanceof Headers ? i2.headers.get("authorization") : null === (a2 = i2.headers) || void 0 === a2 ? void 0 : a2.authorization;
        if (f2 || (null == g ? void 0 : g.split(" ")[0]) !== "Bearer" || (f2 = decodeURIComponent(g.split(" ")[1])), !f2) return null;
        if (l2) return f2;
        try {
          return await d2({ token: f2, secret: h2 });
        } catch (e3) {
          return null;
        }
      }
      async function f(e2, t2) {
        return await (0, o.default)("sha256", e2, t2, `NextAuth.js Generated Encryption Key${t2 ? ` (${t2})` : ""}`, 32);
      }
    }, 555: (e, t) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
    }, 784: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      var n = {};
      Object.defineProperty(t, "default", { enumerable: true, get: function() {
        return a.default;
      } });
      var a = function(e2, t2) {
        if (e2 && e2.__esModule) return e2;
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return { default: e2 };
        var r2 = i(void 0);
        if (r2 && r2.has(e2)) return r2.get(e2);
        var n2 = { __proto__: null }, a2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var o in e2) if ("default" !== o && {}.hasOwnProperty.call(e2, o)) {
          var s = a2 ? Object.getOwnPropertyDescriptor(e2, o) : null;
          s && (s.get || s.set) ? Object.defineProperty(n2, o, s) : n2[o] = e2[o];
        }
        return n2.default = e2, r2 && r2.set(e2, n2), n2;
      }(r(93));
      function i(e2) {
        if ("function" != typeof WeakMap) return null;
        var t2 = /* @__PURE__ */ new WeakMap(), r2 = /* @__PURE__ */ new WeakMap();
        return (i = function(e3) {
          return e3 ? r2 : t2;
        })(e2);
      }
      Object.keys(a).forEach(function(e2) {
        !("default" === e2 || "__esModule" === e2 || Object.prototype.hasOwnProperty.call(n, e2)) && (e2 in t && t[e2] === a[e2] || Object.defineProperty(t, e2, { enumerable: true, get: function() {
          return a[e2];
        } }));
      });
    }, 93: (e, t, r) => {
      "use strict";
      var n = r(476);
      Object.defineProperty(t, "__esModule", { value: true }), t.default = void 0, t.withAuth = c;
      var a = r(635), i = r(859), o = n(r(66));
      async function s(e2, t2, r2) {
        var n2, s2, c2, l, d, u, p, h, f, g, y;
        let { pathname: w, search: m, origin: b, basePath: v } = e2.nextUrl, S = null !== (n2 = null == t2 || null === (s2 = t2.pages) || void 0 === s2 ? void 0 : s2.signIn) && void 0 !== n2 ? n2 : "/api/auth/signin", E = null !== (c2 = null == t2 || null === (l = t2.pages) || void 0 === l ? void 0 : l.error) && void 0 !== c2 ? c2 : "/api/auth/error", _ = (0, o.default)(process.env.NEXTAUTH_URL).path;
        if (`${v}${w}`.startsWith(_) || [S, E].includes(w) || ["/_next", "/favicon.ico"].some((e3) => w.startsWith(e3))) return;
        let A = null !== (d = null !== (u = null == t2 ? void 0 : t2.secret) && void 0 !== u ? u : process.env.NEXTAUTH_SECRET) && void 0 !== d ? d : process.env.AUTH_SECRET;
        if (!A) {
          console.error("[next-auth][error][NO_SECRET]", `
https://next-auth.js.org/errors#no_secret`);
          let e3 = new URL(`${v}${E}`, b);
          return e3.searchParams.append("error", "Configuration"), a.NextResponse.redirect(e3);
        }
        let P = await (0, i.getToken)({ req: e2, decode: null == t2 || null === (p = t2.jwt) || void 0 === p ? void 0 : p.decode, cookieName: null == t2 || null === (h = t2.cookies) || void 0 === h || null === (h = h.sessionToken) || void 0 === h ? void 0 : h.name, secret: A });
        if (null !== (f = await (null == t2 || null === (g = t2.callbacks) || void 0 === g || null === (y = g.authorized) || void 0 === y ? void 0 : y.call(g, { req: e2, token: P }))) && void 0 !== f ? f : !!P) return await (null == r2 ? void 0 : r2(P));
        let C = new URL(`${v}${S}`, b);
        return C.searchParams.append("callbackUrl", `${v}${w}${m}`), a.NextResponse.redirect(C);
      }
      function c(...e2) {
        if (!e2.length || e2[0] instanceof Request) return s(...e2);
        if ("function" == typeof e2[0]) {
          let t3 = e2[0], r2 = e2[1];
          return async (...e3) => await s(e3[0], r2, async (r3) => (e3[0].nextauth = { token: r3 }, await t3(...e3)));
        }
        let t2 = e2[0];
        return async (...e3) => await s(e3[0], t2);
      }
      t.default = c;
    }, 532: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { NIL: () => T, parse: () => y, stringify: () => p, v1: () => g, v3: () => P, v4: () => C, v5: () => R, validate: () => l, version: () => O });
      var n, a, i, o = new Uint8Array(16);
      function s() {
        if (!n && !(n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
        return n(o);
      }
      let c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i, l = function(e2) {
        return "string" == typeof e2 && c.test(e2);
      };
      for (var d = [], u = 0; u < 256; ++u) d.push((u + 256).toString(16).substr(1));
      let p = function(e2) {
        var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r2 = (d[e2[t2 + 0]] + d[e2[t2 + 1]] + d[e2[t2 + 2]] + d[e2[t2 + 3]] + "-" + d[e2[t2 + 4]] + d[e2[t2 + 5]] + "-" + d[e2[t2 + 6]] + d[e2[t2 + 7]] + "-" + d[e2[t2 + 8]] + d[e2[t2 + 9]] + "-" + d[e2[t2 + 10]] + d[e2[t2 + 11]] + d[e2[t2 + 12]] + d[e2[t2 + 13]] + d[e2[t2 + 14]] + d[e2[t2 + 15]]).toLowerCase();
        if (!l(r2)) throw TypeError("Stringified UUID is invalid");
        return r2;
      };
      var h = 0, f = 0;
      let g = function(e2, t2, r2) {
        var n2 = t2 && r2 || 0, o2 = t2 || Array(16), c2 = (e2 = e2 || {}).node || a, l2 = void 0 !== e2.clockseq ? e2.clockseq : i;
        if (null == c2 || null == l2) {
          var d2 = e2.random || (e2.rng || s)();
          null == c2 && (c2 = a = [1 | d2[0], d2[1], d2[2], d2[3], d2[4], d2[5]]), null == l2 && (l2 = i = (d2[6] << 8 | d2[7]) & 16383);
        }
        var u2 = void 0 !== e2.msecs ? e2.msecs : Date.now(), g2 = void 0 !== e2.nsecs ? e2.nsecs : f + 1, y2 = u2 - h + (g2 - f) / 1e4;
        if (y2 < 0 && void 0 === e2.clockseq && (l2 = l2 + 1 & 16383), (y2 < 0 || u2 > h) && void 0 === e2.nsecs && (g2 = 0), g2 >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        h = u2, f = g2, i = l2;
        var w2 = ((268435455 & (u2 += 122192928e5)) * 1e4 + g2) % 4294967296;
        o2[n2++] = w2 >>> 24 & 255, o2[n2++] = w2 >>> 16 & 255, o2[n2++] = w2 >>> 8 & 255, o2[n2++] = 255 & w2;
        var m2 = u2 / 4294967296 * 1e4 & 268435455;
        o2[n2++] = m2 >>> 8 & 255, o2[n2++] = 255 & m2, o2[n2++] = m2 >>> 24 & 15 | 16, o2[n2++] = m2 >>> 16 & 255, o2[n2++] = l2 >>> 8 | 128, o2[n2++] = 255 & l2;
        for (var b2 = 0; b2 < 6; ++b2) o2[n2 + b2] = c2[b2];
        return t2 || p(o2);
      }, y = function(e2) {
        if (!l(e2)) throw TypeError("Invalid UUID");
        var t2, r2 = new Uint8Array(16);
        return r2[0] = (t2 = parseInt(e2.slice(0, 8), 16)) >>> 24, r2[1] = t2 >>> 16 & 255, r2[2] = t2 >>> 8 & 255, r2[3] = 255 & t2, r2[4] = (t2 = parseInt(e2.slice(9, 13), 16)) >>> 8, r2[5] = 255 & t2, r2[6] = (t2 = parseInt(e2.slice(14, 18), 16)) >>> 8, r2[7] = 255 & t2, r2[8] = (t2 = parseInt(e2.slice(19, 23), 16)) >>> 8, r2[9] = 255 & t2, r2[10] = (t2 = parseInt(e2.slice(24, 36), 16)) / 1099511627776 & 255, r2[11] = t2 / 4294967296 & 255, r2[12] = t2 >>> 24 & 255, r2[13] = t2 >>> 16 & 255, r2[14] = t2 >>> 8 & 255, r2[15] = 255 & t2, r2;
      };
      function w(e2, t2, r2) {
        function n2(e3, n3, a2, i2) {
          if ("string" == typeof e3 && (e3 = function(e4) {
            e4 = unescape(encodeURIComponent(e4));
            for (var t3 = [], r3 = 0; r3 < e4.length; ++r3) t3.push(e4.charCodeAt(r3));
            return t3;
          }(e3)), "string" == typeof n3 && (n3 = y(n3)), 16 !== n3.length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
          var o2 = new Uint8Array(16 + e3.length);
          if (o2.set(n3), o2.set(e3, n3.length), (o2 = r2(o2))[6] = 15 & o2[6] | t2, o2[8] = 63 & o2[8] | 128, a2) {
            i2 = i2 || 0;
            for (var s2 = 0; s2 < 16; ++s2) a2[i2 + s2] = o2[s2];
            return a2;
          }
          return p(o2);
        }
        try {
          n2.name = e2;
        } catch (e3) {
        }
        return n2.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", n2.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", n2;
      }
      function m(e2) {
        return (e2 + 64 >>> 9 << 4) + 14 + 1;
      }
      function b(e2, t2) {
        var r2 = (65535 & e2) + (65535 & t2);
        return (e2 >> 16) + (t2 >> 16) + (r2 >> 16) << 16 | 65535 & r2;
      }
      function v(e2, t2, r2, n2, a2, i2) {
        var o2;
        return b((o2 = b(b(t2, e2), b(n2, i2))) << a2 | o2 >>> 32 - a2, r2);
      }
      function S(e2, t2, r2, n2, a2, i2, o2) {
        return v(t2 & r2 | ~t2 & n2, e2, t2, a2, i2, o2);
      }
      function E(e2, t2, r2, n2, a2, i2, o2) {
        return v(t2 & n2 | r2 & ~n2, e2, t2, a2, i2, o2);
      }
      function _(e2, t2, r2, n2, a2, i2, o2) {
        return v(t2 ^ r2 ^ n2, e2, t2, a2, i2, o2);
      }
      function A(e2, t2, r2, n2, a2, i2, o2) {
        return v(r2 ^ (t2 | ~n2), e2, t2, a2, i2, o2);
      }
      let P = w("v3", 48, function(e2) {
        if ("string" == typeof e2) {
          var t2 = unescape(encodeURIComponent(e2));
          e2 = new Uint8Array(t2.length);
          for (var r2 = 0; r2 < t2.length; ++r2) e2[r2] = t2.charCodeAt(r2);
        }
        return function(e3) {
          for (var t3 = [], r3 = 32 * e3.length, n2 = "0123456789abcdef", a2 = 0; a2 < r3; a2 += 8) {
            var i2 = e3[a2 >> 5] >>> a2 % 32 & 255, o2 = parseInt(n2.charAt(i2 >>> 4 & 15) + n2.charAt(15 & i2), 16);
            t3.push(o2);
          }
          return t3;
        }(function(e3, t3) {
          e3[t3 >> 5] |= 128 << t3 % 32, e3[m(t3) - 1] = t3;
          for (var r3 = 1732584193, n2 = -271733879, a2 = -1732584194, i2 = 271733878, o2 = 0; o2 < e3.length; o2 += 16) {
            var s2 = r3, c2 = n2, l2 = a2, d2 = i2;
            r3 = S(r3, n2, a2, i2, e3[o2], 7, -680876936), i2 = S(i2, r3, n2, a2, e3[o2 + 1], 12, -389564586), a2 = S(a2, i2, r3, n2, e3[o2 + 2], 17, 606105819), n2 = S(n2, a2, i2, r3, e3[o2 + 3], 22, -1044525330), r3 = S(r3, n2, a2, i2, e3[o2 + 4], 7, -176418897), i2 = S(i2, r3, n2, a2, e3[o2 + 5], 12, 1200080426), a2 = S(a2, i2, r3, n2, e3[o2 + 6], 17, -1473231341), n2 = S(n2, a2, i2, r3, e3[o2 + 7], 22, -45705983), r3 = S(r3, n2, a2, i2, e3[o2 + 8], 7, 1770035416), i2 = S(i2, r3, n2, a2, e3[o2 + 9], 12, -1958414417), a2 = S(a2, i2, r3, n2, e3[o2 + 10], 17, -42063), n2 = S(n2, a2, i2, r3, e3[o2 + 11], 22, -1990404162), r3 = S(r3, n2, a2, i2, e3[o2 + 12], 7, 1804603682), i2 = S(i2, r3, n2, a2, e3[o2 + 13], 12, -40341101), a2 = S(a2, i2, r3, n2, e3[o2 + 14], 17, -1502002290), n2 = S(n2, a2, i2, r3, e3[o2 + 15], 22, 1236535329), r3 = E(r3, n2, a2, i2, e3[o2 + 1], 5, -165796510), i2 = E(i2, r3, n2, a2, e3[o2 + 6], 9, -1069501632), a2 = E(a2, i2, r3, n2, e3[o2 + 11], 14, 643717713), n2 = E(n2, a2, i2, r3, e3[o2], 20, -373897302), r3 = E(r3, n2, a2, i2, e3[o2 + 5], 5, -701558691), i2 = E(i2, r3, n2, a2, e3[o2 + 10], 9, 38016083), a2 = E(a2, i2, r3, n2, e3[o2 + 15], 14, -660478335), n2 = E(n2, a2, i2, r3, e3[o2 + 4], 20, -405537848), r3 = E(r3, n2, a2, i2, e3[o2 + 9], 5, 568446438), i2 = E(i2, r3, n2, a2, e3[o2 + 14], 9, -1019803690), a2 = E(a2, i2, r3, n2, e3[o2 + 3], 14, -187363961), n2 = E(n2, a2, i2, r3, e3[o2 + 8], 20, 1163531501), r3 = E(r3, n2, a2, i2, e3[o2 + 13], 5, -1444681467), i2 = E(i2, r3, n2, a2, e3[o2 + 2], 9, -51403784), a2 = E(a2, i2, r3, n2, e3[o2 + 7], 14, 1735328473), n2 = E(n2, a2, i2, r3, e3[o2 + 12], 20, -1926607734), r3 = _(r3, n2, a2, i2, e3[o2 + 5], 4, -378558), i2 = _(i2, r3, n2, a2, e3[o2 + 8], 11, -2022574463), a2 = _(a2, i2, r3, n2, e3[o2 + 11], 16, 1839030562), n2 = _(n2, a2, i2, r3, e3[o2 + 14], 23, -35309556), r3 = _(r3, n2, a2, i2, e3[o2 + 1], 4, -1530992060), i2 = _(i2, r3, n2, a2, e3[o2 + 4], 11, 1272893353), a2 = _(a2, i2, r3, n2, e3[o2 + 7], 16, -155497632), n2 = _(n2, a2, i2, r3, e3[o2 + 10], 23, -1094730640), r3 = _(r3, n2, a2, i2, e3[o2 + 13], 4, 681279174), i2 = _(i2, r3, n2, a2, e3[o2], 11, -358537222), a2 = _(a2, i2, r3, n2, e3[o2 + 3], 16, -722521979), n2 = _(n2, a2, i2, r3, e3[o2 + 6], 23, 76029189), r3 = _(r3, n2, a2, i2, e3[o2 + 9], 4, -640364487), i2 = _(i2, r3, n2, a2, e3[o2 + 12], 11, -421815835), a2 = _(a2, i2, r3, n2, e3[o2 + 15], 16, 530742520), n2 = _(n2, a2, i2, r3, e3[o2 + 2], 23, -995338651), r3 = A(r3, n2, a2, i2, e3[o2], 6, -198630844), i2 = A(i2, r3, n2, a2, e3[o2 + 7], 10, 1126891415), a2 = A(a2, i2, r3, n2, e3[o2 + 14], 15, -1416354905), n2 = A(n2, a2, i2, r3, e3[o2 + 5], 21, -57434055), r3 = A(r3, n2, a2, i2, e3[o2 + 12], 6, 1700485571), i2 = A(i2, r3, n2, a2, e3[o2 + 3], 10, -1894986606), a2 = A(a2, i2, r3, n2, e3[o2 + 10], 15, -1051523), n2 = A(n2, a2, i2, r3, e3[o2 + 1], 21, -2054922799), r3 = A(r3, n2, a2, i2, e3[o2 + 8], 6, 1873313359), i2 = A(i2, r3, n2, a2, e3[o2 + 15], 10, -30611744), a2 = A(a2, i2, r3, n2, e3[o2 + 6], 15, -1560198380), n2 = A(n2, a2, i2, r3, e3[o2 + 13], 21, 1309151649), r3 = A(r3, n2, a2, i2, e3[o2 + 4], 6, -145523070), i2 = A(i2, r3, n2, a2, e3[o2 + 11], 10, -1120210379), a2 = A(a2, i2, r3, n2, e3[o2 + 2], 15, 718787259), n2 = A(n2, a2, i2, r3, e3[o2 + 9], 21, -343485551), r3 = b(r3, s2), n2 = b(n2, c2), a2 = b(a2, l2), i2 = b(i2, d2);
          }
          return [r3, n2, a2, i2];
        }(function(e3) {
          if (0 === e3.length) return [];
          for (var t3 = 8 * e3.length, r3 = new Uint32Array(m(t3)), n2 = 0; n2 < t3; n2 += 8) r3[n2 >> 5] |= (255 & e3[n2 / 8]) << n2 % 32;
          return r3;
        }(e2), 8 * e2.length));
      }), C = function(e2, t2, r2) {
        var n2 = (e2 = e2 || {}).random || (e2.rng || s)();
        if (n2[6] = 15 & n2[6] | 64, n2[8] = 63 & n2[8] | 128, t2) {
          r2 = r2 || 0;
          for (var a2 = 0; a2 < 16; ++a2) t2[r2 + a2] = n2[a2];
          return t2;
        }
        return p(n2);
      };
      function x(e2, t2) {
        return e2 << t2 | e2 >>> 32 - t2;
      }
      let R = w("v5", 80, function(e2) {
        var t2 = [1518500249, 1859775393, 2400959708, 3395469782], r2 = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        if ("string" == typeof e2) {
          var n2 = unescape(encodeURIComponent(e2));
          e2 = [];
          for (var a2 = 0; a2 < n2.length; ++a2) e2.push(n2.charCodeAt(a2));
        } else Array.isArray(e2) || (e2 = Array.prototype.slice.call(e2));
        e2.push(128);
        for (var i2 = Math.ceil((e2.length / 4 + 2) / 16), o2 = Array(i2), s2 = 0; s2 < i2; ++s2) {
          for (var c2 = new Uint32Array(16), l2 = 0; l2 < 16; ++l2) c2[l2] = e2[64 * s2 + 4 * l2] << 24 | e2[64 * s2 + 4 * l2 + 1] << 16 | e2[64 * s2 + 4 * l2 + 2] << 8 | e2[64 * s2 + 4 * l2 + 3];
          o2[s2] = c2;
        }
        o2[i2 - 1][14] = (e2.length - 1) * 8 / 4294967296, o2[i2 - 1][14] = Math.floor(o2[i2 - 1][14]), o2[i2 - 1][15] = (e2.length - 1) * 8 & 4294967295;
        for (var d2 = 0; d2 < i2; ++d2) {
          for (var u2 = new Uint32Array(80), p2 = 0; p2 < 16; ++p2) u2[p2] = o2[d2][p2];
          for (var h2 = 16; h2 < 80; ++h2) u2[h2] = x(u2[h2 - 3] ^ u2[h2 - 8] ^ u2[h2 - 14] ^ u2[h2 - 16], 1);
          for (var f2 = r2[0], g2 = r2[1], y2 = r2[2], w2 = r2[3], m2 = r2[4], b2 = 0; b2 < 80; ++b2) {
            var v2 = Math.floor(b2 / 20), S2 = x(f2, 5) + function(e3, t3, r3, n3) {
              switch (e3) {
                case 0:
                  return t3 & r3 ^ ~t3 & n3;
                case 1:
                case 3:
                  return t3 ^ r3 ^ n3;
                case 2:
                  return t3 & r3 ^ t3 & n3 ^ r3 & n3;
              }
            }(v2, g2, y2, w2) + m2 + t2[v2] + u2[b2] >>> 0;
            m2 = w2, w2 = y2, y2 = x(g2, 30) >>> 0, g2 = f2, f2 = S2;
          }
          r2[0] = r2[0] + f2 >>> 0, r2[1] = r2[1] + g2 >>> 0, r2[2] = r2[2] + y2 >>> 0, r2[3] = r2[3] + w2 >>> 0, r2[4] = r2[4] + m2 >>> 0;
        }
        return [r2[0] >> 24 & 255, r2[0] >> 16 & 255, r2[0] >> 8 & 255, 255 & r2[0], r2[1] >> 24 & 255, r2[1] >> 16 & 255, r2[1] >> 8 & 255, 255 & r2[1], r2[2] >> 24 & 255, r2[2] >> 16 & 255, r2[2] >> 8 & 255, 255 & r2[2], r2[3] >> 24 & 255, r2[3] >> 16 & 255, r2[3] >> 8 & 255, 255 & r2[3], r2[4] >> 24 & 255, r2[4] >> 16 & 255, r2[4] >> 8 & 255, 255 & r2[4]];
      }), T = "00000000-0000-0000-0000-000000000000", O = function(e2) {
        if (!l(e2)) throw TypeError("Invalid UUID");
        return parseInt(e2.substr(14, 1), 16);
      };
    }, 66: (e, t) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), t.default = function(e2) {
        var t2;
        let r = new URL("http://localhost:3000/api/auth");
        e2 && !e2.startsWith("http") && (e2 = `https://${e2}`);
        let n = new URL(null !== (t2 = e2) && void 0 !== t2 ? t2 : r), a = ("/" === n.pathname ? r.pathname : n.pathname).replace(/\/$/, ""), i = `${n.origin}${a}`;
        return { origin: n.origin, host: n.host, path: a, base: i, toString: () => i };
      };
    }, 945: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, i = {};
      function o(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function s(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, a2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != a2 ? a2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function c(e2) {
        var t2, r2;
        if (!e2) return;
        let [[n2, a2], ...i2] = s(e2), { domain: o2, expires: c2, httponly: u2, maxage: p2, path: h, samesite: f, secure: g, partitioned: y, priority: w } = Object.fromEntries(i2.map(([e3, t3]) => [e3.toLowerCase(), t3]));
        return function(e3) {
          let t3 = {};
          for (let r3 in e3) e3[r3] && (t3[r3] = e3[r3]);
          return t3;
        }({ name: n2, value: decodeURIComponent(a2), domain: o2, ...c2 && { expires: new Date(c2) }, ...u2 && { httpOnly: true }, ..."string" == typeof p2 && { maxAge: Number(p2) }, path: h, ...f && { sameSite: l.includes(t2 = (t2 = f).toLowerCase()) ? t2 : void 0 }, ...g && { secure: true }, ...w && { priority: d.includes(r2 = (r2 = w).toLowerCase()) ? r2 : void 0 }, ...y && { partitioned: true } });
      }
      ((e2, r2) => {
        for (var n2 in r2) t(e2, n2, { get: r2[n2], enumerable: true });
      })(i, { RequestCookies: () => u, ResponseCookies: () => p, parseCookie: () => s, parseSetCookie: () => c, stringifyCookie: () => o }), e.exports = ((e2, i2, o2, s2) => {
        if (i2 && "object" == typeof i2 || "function" == typeof i2) for (let c2 of n(i2)) a.call(e2, c2) || c2 === o2 || t(e2, c2, { get: () => i2[c2], enumerable: !(s2 = r(i2, c2)) || s2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), i);
      var l = ["strict", "lax", "none"], d = ["low", "medium", "high"], u = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of s(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => o(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => o(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, p = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let a2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(a2) ? a2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, a3, i2, o2 = [], s2 = 0;
            function c2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, i2 = false; c2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, c2(), a3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (i2 = true, s2 = a3, o2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!i2 || s2 >= e4.length) && o2.push(e4.substring(t3, e4.length));
            }
            return o2;
          }(a2)) {
            let t3 = c(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, a2 = this._parsed;
          return a2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = o(r3);
              t3.append("set-cookie", e4);
            }
          }(a2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2, n2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0].path, e2[0].domain];
          return this.set({ name: t2, path: r2, domain: n2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(o).join("; ");
        }
      };
    }, 439: (e, t, r) => {
      (() => {
        "use strict";
        var t2 = { 491: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ContextAPI = void 0;
          let n2 = r2(223), a2 = r2(172), i2 = r2(930), o = "context", s = new n2.NoopContextManager();
          class c {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new c()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, a2.registerGlobal)(o, e3, i2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t4, r3, ...n3) {
              return this._getContextManager().with(e3, t4, r3, ...n3);
            }
            bind(e3, t4) {
              return this._getContextManager().bind(e3, t4);
            }
            _getContextManager() {
              return (0, a2.getGlobal)(o) || s;
            }
            disable() {
              this._getContextManager().disable(), (0, a2.unregisterGlobal)(o, i2.DiagAPI.instance());
            }
          }
          t3.ContextAPI = c;
        }, 930: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagAPI = void 0;
          let n2 = r2(56), a2 = r2(912), i2 = r2(957), o = r2(172);
          class s {
            constructor() {
              function e3(e4) {
                return function(...t5) {
                  let r3 = (0, o.getGlobal)("diag");
                  if (r3) return r3[e4](...t5);
                };
              }
              let t4 = this;
              t4.setLogger = (e4, r3 = { logLevel: i2.DiagLogLevel.INFO }) => {
                var n3, s2, c;
                if (e4 === t4) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t4.error(null !== (n3 = e5.stack) && void 0 !== n3 ? n3 : e5.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let l = (0, o.getGlobal)("diag"), d = (0, a2.createLogLevelDiagLogger)(null !== (s2 = r3.logLevel) && void 0 !== s2 ? s2 : i2.DiagLogLevel.INFO, e4);
                if (l && !r3.suppressOverrideMessage) {
                  let e5 = null !== (c = Error().stack) && void 0 !== c ? c : "<failed to generate stacktrace>";
                  l.warn(`Current logger will be overwritten from ${e5}`), d.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, o.registerGlobal)("diag", d, t4, true);
              }, t4.disable = () => {
                (0, o.unregisterGlobal)("diag", t4);
              }, t4.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t4.verbose = e3("verbose"), t4.debug = e3("debug"), t4.info = e3("info"), t4.warn = e3("warn"), t4.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new s()), this._instance;
            }
          }
          t3.DiagAPI = s;
        }, 653: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.MetricsAPI = void 0;
          let n2 = r2(660), a2 = r2(172), i2 = r2(930), o = "metrics";
          class s {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new s()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, a2.registerGlobal)(o, e3, i2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, a2.getGlobal)(o) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t4, r3) {
              return this.getMeterProvider().getMeter(e3, t4, r3);
            }
            disable() {
              (0, a2.unregisterGlobal)(o, i2.DiagAPI.instance());
            }
          }
          t3.MetricsAPI = s;
        }, 181: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.PropagationAPI = void 0;
          let n2 = r2(172), a2 = r2(874), i2 = r2(194), o = r2(277), s = r2(369), c = r2(930), l = "propagation", d = new a2.NoopTextMapPropagator();
          class u {
            constructor() {
              this.createBaggage = s.createBaggage, this.getBaggage = o.getBaggage, this.getActiveBaggage = o.getActiveBaggage, this.setBaggage = o.setBaggage, this.deleteBaggage = o.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(l, e3, c.DiagAPI.instance());
            }
            inject(e3, t4, r3 = i2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t4, r3);
            }
            extract(e3, t4, r3 = i2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t4, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(l, c.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(l) || d;
            }
          }
          t3.PropagationAPI = u;
        }, 997: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceAPI = void 0;
          let n2 = r2(172), a2 = r2(846), i2 = r2(139), o = r2(607), s = r2(930), c = "trace";
          class l {
            constructor() {
              this._proxyTracerProvider = new a2.ProxyTracerProvider(), this.wrapSpanContext = i2.wrapSpanContext, this.isSpanContextValid = i2.isSpanContextValid, this.deleteSpan = o.deleteSpan, this.getSpan = o.getSpan, this.getActiveSpan = o.getActiveSpan, this.getSpanContext = o.getSpanContext, this.setSpan = o.setSpan, this.setSpanContext = o.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t4 = (0, n2.registerGlobal)(c, this._proxyTracerProvider, s.DiagAPI.instance());
              return t4 && this._proxyTracerProvider.setDelegate(e3), t4;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(c) || this._proxyTracerProvider;
            }
            getTracer(e3, t4) {
              return this.getTracerProvider().getTracer(e3, t4);
            }
            disable() {
              (0, n2.unregisterGlobal)(c, s.DiagAPI.instance()), this._proxyTracerProvider = new a2.ProxyTracerProvider();
            }
          }
          t3.TraceAPI = l;
        }, 277: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.deleteBaggage = t3.setBaggage = t3.getActiveBaggage = t3.getBaggage = void 0;
          let n2 = r2(491), a2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function i2(e3) {
            return e3.getValue(a2) || void 0;
          }
          t3.getBaggage = i2, t3.getActiveBaggage = function() {
            return i2(n2.ContextAPI.getInstance().active());
          }, t3.setBaggage = function(e3, t4) {
            return e3.setValue(a2, t4);
          }, t3.deleteBaggage = function(e3) {
            return e3.deleteValue(a2);
          };
        }, 993: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.BaggageImpl = void 0;
          class r2 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t4 = this._entries.get(e3);
              if (t4) return Object.assign({}, t4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t4]) => [e3, t4]);
            }
            setEntry(e3, t4) {
              let n2 = new r2(this._entries);
              return n2._entries.set(e3, t4), n2;
            }
            removeEntry(e3) {
              let t4 = new r2(this._entries);
              return t4._entries.delete(e3), t4;
            }
            removeEntries(...e3) {
              let t4 = new r2(this._entries);
              for (let r3 of e3) t4._entries.delete(r3);
              return t4;
            }
            clear() {
              return new r2();
            }
          }
          t3.BaggageImpl = r2;
        }, 830: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataSymbol = void 0, t3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataFromString = t3.createBaggage = void 0;
          let n2 = r2(930), a2 = r2(993), i2 = r2(830), o = n2.DiagAPI.instance();
          t3.createBaggage = function(e3 = {}) {
            return new a2.BaggageImpl(new Map(Object.entries(e3)));
          }, t3.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (o.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: i2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.context = void 0;
          let n2 = r2(491);
          t3.context = n2.ContextAPI.getInstance();
        }, 223: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopContextManager = void 0;
          let n2 = r2(780);
          class a2 {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t4, r3, ...n3) {
              return t4.call(r3, ...n3);
            }
            bind(e3, t4) {
              return t4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t3.NoopContextManager = a2;
        }, 780: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ROOT_CONTEXT = t3.createContextKey = void 0, t3.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r2 {
            constructor(e3) {
              let t4 = this;
              t4._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t4.getValue = (e4) => t4._currentContext.get(e4), t4.setValue = (e4, n2) => {
                let a2 = new r2(t4._currentContext);
                return a2._currentContext.set(e4, n2), a2;
              }, t4.deleteValue = (e4) => {
                let n2 = new r2(t4._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t3.ROOT_CONTEXT = new r2();
        }, 506: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.diag = void 0;
          let n2 = r2(930);
          t3.diag = n2.DiagAPI.instance();
        }, 56: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagComponentLogger = void 0;
          let n2 = r2(172);
          class a2 {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          }
          function i2(e3, t4, r3) {
            let a3 = (0, n2.getGlobal)("diag");
            if (a3) return r3.unshift(t4), a3[e3](...r3);
          }
          t3.DiagComponentLogger = a2;
        }, 972: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class n2 {
            constructor() {
              for (let e3 = 0; e3 < r2.length; e3++) this[r2[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t4) {
                  if (console) {
                    let r3 = console[e4];
                    if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3) return r3.apply(console, t4);
                  }
                };
              }(r2[e3].c);
            }
          }
          t3.DiagConsoleLogger = n2;
        }, 912: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createLogLevelDiagLogger = void 0;
          let n2 = r2(957);
          t3.createLogLevelDiagLogger = function(e3, t4) {
            function r3(r4, n3) {
              let a2 = t4[r4];
              return "function" == typeof a2 && e3 >= n3 ? a2.bind(t4) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t4 = t4 || {}, { error: r3("error", n2.DiagLogLevel.ERROR), warn: r3("warn", n2.DiagLogLevel.WARN), info: r3("info", n2.DiagLogLevel.INFO), debug: r3("debug", n2.DiagLogLevel.DEBUG), verbose: r3("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t3.DiagLogLevel || (t3.DiagLogLevel = {}));
        }, 172: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.unregisterGlobal = t3.getGlobal = t3.registerGlobal = void 0;
          let n2 = r2(200), a2 = r2(521), i2 = r2(130), o = a2.VERSION.split(".")[0], s = Symbol.for(`opentelemetry.js.api.${o}`), c = n2._globalThis;
          t3.registerGlobal = function(e3, t4, r3, n3 = false) {
            var i3;
            let o2 = c[s] = null !== (i3 = c[s]) && void 0 !== i3 ? i3 : { version: a2.VERSION };
            if (!n3 && o2[e3]) {
              let t5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t5.stack || t5.message), false;
            }
            if (o2.version !== a2.VERSION) {
              let t5 = Error(`@opentelemetry/api: Registration of version v${o2.version} for ${e3} does not match previously registered API v${a2.VERSION}`);
              return r3.error(t5.stack || t5.message), false;
            }
            return o2[e3] = t4, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${a2.VERSION}.`), true;
          }, t3.getGlobal = function(e3) {
            var t4, r3;
            let n3 = null === (t4 = c[s]) || void 0 === t4 ? void 0 : t4.version;
            if (n3 && (0, i2.isCompatible)(n3)) return null === (r3 = c[s]) || void 0 === r3 ? void 0 : r3[e3];
          }, t3.unregisterGlobal = function(e3, t4) {
            t4.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${a2.VERSION}.`);
            let r3 = c[s];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.isCompatible = t3._makeCompatibilityCheck = void 0;
          let n2 = r2(521), a2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function i2(e3) {
            let t4 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), n3 = e3.match(a2);
            if (!n3) return () => false;
            let i3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != i3.prerelease) return function(t5) {
              return t5 === e3;
            };
            function o(e4) {
              return r3.add(e4), false;
            }
            return function(e4) {
              if (t4.has(e4)) return true;
              if (r3.has(e4)) return false;
              let n4 = e4.match(a2);
              if (!n4) return o(e4);
              let s = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              return null != s.prerelease || i3.major !== s.major ? o(e4) : 0 === i3.major ? i3.minor === s.minor && i3.patch <= s.patch ? (t4.add(e4), true) : o(e4) : i3.minor <= s.minor ? (t4.add(e4), true) : o(e4);
            };
          }
          t3._makeCompatibilityCheck = i2, t3.isCompatible = i2(n2.VERSION);
        }, 886: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.metrics = void 0;
          let n2 = r2(653);
          t3.metrics = n2.MetricsAPI.getInstance();
        }, 901: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t3.ValueType || (t3.ValueType = {}));
        }, 102: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createNoopMeter = t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t3.NOOP_OBSERVABLE_GAUGE_METRIC = t3.NOOP_OBSERVABLE_COUNTER_METRIC = t3.NOOP_UP_DOWN_COUNTER_METRIC = t3.NOOP_HISTOGRAM_METRIC = t3.NOOP_COUNTER_METRIC = t3.NOOP_METER = t3.NoopObservableUpDownCounterMetric = t3.NoopObservableGaugeMetric = t3.NoopObservableCounterMetric = t3.NoopObservableMetric = t3.NoopHistogramMetric = t3.NoopUpDownCounterMetric = t3.NoopCounterMetric = t3.NoopMetric = t3.NoopMeter = void 0;
          class r2 {
            constructor() {
            }
            createHistogram(e3, r3) {
              return t3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r3) {
              return t3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r3) {
              return t3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r3) {
              return t3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t4) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t3.NoopMeter = r2;
          class n2 {
          }
          t3.NoopMetric = n2;
          class a2 extends n2 {
            add(e3, t4) {
            }
          }
          t3.NoopCounterMetric = a2;
          class i2 extends n2 {
            add(e3, t4) {
            }
          }
          t3.NoopUpDownCounterMetric = i2;
          class o extends n2 {
            record(e3, t4) {
            }
          }
          t3.NoopHistogramMetric = o;
          class s {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t3.NoopObservableMetric = s;
          class c extends s {
          }
          t3.NoopObservableCounterMetric = c;
          class l extends s {
          }
          t3.NoopObservableGaugeMetric = l;
          class d extends s {
          }
          t3.NoopObservableUpDownCounterMetric = d, t3.NOOP_METER = new r2(), t3.NOOP_COUNTER_METRIC = new a2(), t3.NOOP_HISTOGRAM_METRIC = new o(), t3.NOOP_UP_DOWN_COUNTER_METRIC = new i2(), t3.NOOP_OBSERVABLE_COUNTER_METRIC = new c(), t3.NOOP_OBSERVABLE_GAUGE_METRIC = new l(), t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new d(), t3.createNoopMeter = function() {
            return t3.NOOP_METER;
          };
        }, 660: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NOOP_METER_PROVIDER = t3.NoopMeterProvider = void 0;
          let n2 = r2(102);
          class a2 {
            getMeter(e3, t4, r3) {
              return n2.NOOP_METER;
            }
          }
          t3.NoopMeterProvider = a2, t3.NOOP_METER_PROVIDER = new a2();
        }, 200: function(e2, t3, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t4[r3];
          }), a2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || n2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), a2(r2(46), t3);
        }, 651: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3._globalThis = void 0, t3._globalThis = "object" == typeof globalThis ? globalThis : r.g;
        }, 46: function(e2, t3, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t4[r3];
          }), a2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || n2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), a2(r2(651), t3);
        }, 939: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.propagation = void 0;
          let n2 = r2(181);
          t3.propagation = n2.PropagationAPI.getInstance();
        }, 874: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTextMapPropagator = void 0;
          class r2 {
            inject(e3, t4) {
            }
            extract(e3, t4) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t3.NoopTextMapPropagator = r2;
        }, 194: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.defaultTextMapSetter = t3.defaultTextMapGetter = void 0, t3.defaultTextMapGetter = { get(e3, t4) {
            if (null != e3) return e3[t4];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t3.defaultTextMapSetter = { set(e3, t4, r2) {
            null != e3 && (e3[t4] = r2);
          } };
        }, 845: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.trace = void 0;
          let n2 = r2(997);
          t3.trace = n2.TraceAPI.getInstance();
        }, 403: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NonRecordingSpan = void 0;
          let n2 = r2(476);
          class a2 {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t4) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t4) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t4) {
            }
          }
          t3.NonRecordingSpan = a2;
        }, 614: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracer = void 0;
          let n2 = r2(491), a2 = r2(607), i2 = r2(403), o = r2(139), s = n2.ContextAPI.getInstance();
          class c {
            startSpan(e3, t4, r3 = s.active()) {
              if (null == t4 ? void 0 : t4.root) return new i2.NonRecordingSpan();
              let n3 = r3 && (0, a2.getSpanContext)(r3);
              return "object" == typeof n3 && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, o.isSpanContextValid)(n3) ? new i2.NonRecordingSpan(n3) : new i2.NonRecordingSpan();
            }
            startActiveSpan(e3, t4, r3, n3) {
              let i3, o2, c2;
              if (arguments.length < 2) return;
              2 == arguments.length ? c2 = t4 : 3 == arguments.length ? (i3 = t4, c2 = r3) : (i3 = t4, o2 = r3, c2 = n3);
              let l = null != o2 ? o2 : s.active(), d = this.startSpan(e3, i3, l), u = (0, a2.setSpan)(l, d);
              return s.with(u, c2, void 0, d);
            }
          }
          t3.NoopTracer = c;
        }, 124: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracerProvider = void 0;
          let n2 = r2(614);
          class a2 {
            getTracer(e3, t4, r3) {
              return new n2.NoopTracer();
            }
          }
          t3.NoopTracerProvider = a2;
        }, 125: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracer = void 0;
          let n2 = new (r2(614)).NoopTracer();
          class a2 {
            constructor(e3, t4, r3, n3) {
              this._provider = e3, this.name = t4, this.version = r3, this.options = n3;
            }
            startSpan(e3, t4, r3) {
              return this._getTracer().startSpan(e3, t4, r3);
            }
            startActiveSpan(e3, t4, r3, n3) {
              let a3 = this._getTracer();
              return Reflect.apply(a3.startActiveSpan, a3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          }
          t3.ProxyTracer = a2;
        }, 846: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracerProvider = void 0;
          let n2 = r2(125), a2 = new (r2(124)).NoopTracerProvider();
          class i2 {
            getTracer(e3, t4, r3) {
              var a3;
              return null !== (a3 = this.getDelegateTracer(e3, t4, r3)) && void 0 !== a3 ? a3 : new n2.ProxyTracer(this, e3, t4, r3);
            }
            getDelegate() {
              var e3;
              return null !== (e3 = this._delegate) && void 0 !== e3 ? e3 : a2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t4, r3) {
              var n3;
              return null === (n3 = this._delegate) || void 0 === n3 ? void 0 : n3.getTracer(e3, t4, r3);
            }
          }
          t3.ProxyTracerProvider = i2;
        }, 996: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t3.SamplingDecision || (t3.SamplingDecision = {}));
        }, 607: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.getSpanContext = t3.setSpanContext = t3.deleteSpan = t3.setSpan = t3.getActiveSpan = t3.getSpan = void 0;
          let n2 = r2(780), a2 = r2(403), i2 = r2(491), o = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function s(e3) {
            return e3.getValue(o) || void 0;
          }
          function c(e3, t4) {
            return e3.setValue(o, t4);
          }
          t3.getSpan = s, t3.getActiveSpan = function() {
            return s(i2.ContextAPI.getInstance().active());
          }, t3.setSpan = c, t3.deleteSpan = function(e3) {
            return e3.deleteValue(o);
          }, t3.setSpanContext = function(e3, t4) {
            return c(e3, new a2.NonRecordingSpan(t4));
          }, t3.getSpanContext = function(e3) {
            var t4;
            return null === (t4 = s(e3)) || void 0 === t4 ? void 0 : t4.spanContext();
          };
        }, 325: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceStateImpl = void 0;
          let n2 = r2(564);
          class a2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t4) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t4), r3;
            }
            unset(e3) {
              let t4 = this._clone();
              return t4._internalState.delete(e3), t4;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t4) => (e3.push(t4 + "=" + this.get(t4)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t4) => {
                let r3 = t4.trim(), a3 = r3.indexOf("=");
                if (-1 !== a3) {
                  let i2 = r3.slice(0, a3), o = r3.slice(a3 + 1, t4.length);
                  (0, n2.validateKey)(i2) && (0, n2.validateValue)(o) && e4.set(i2, o);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new a2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t3.TraceStateImpl = a2;
        }, 564: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.validateValue = t3.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", n2 = `[a-z]${r2}{0,255}`, a2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, i2 = RegExp(`^(?:${n2}|${a2})$`), o = /^[ -~]{0,255}[!-~]$/, s = /,|=/;
          t3.validateKey = function(e3) {
            return i2.test(e3);
          }, t3.validateValue = function(e3) {
            return o.test(e3) && !s.test(e3);
          };
        }, 98: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createTraceState = void 0;
          let n2 = r2(325);
          t3.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.INVALID_SPAN_CONTEXT = t3.INVALID_TRACEID = t3.INVALID_SPANID = void 0;
          let n2 = r2(475);
          t3.INVALID_SPANID = "0000000000000000", t3.INVALID_TRACEID = "00000000000000000000000000000000", t3.INVALID_SPAN_CONTEXT = { traceId: t3.INVALID_TRACEID, spanId: t3.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t3.SpanKind || (t3.SpanKind = {}));
        }, 139: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.wrapSpanContext = t3.isSpanContextValid = t3.isValidSpanId = t3.isValidTraceId = void 0;
          let n2 = r2(476), a2 = r2(403), i2 = /^([0-9a-f]{32})$/i, o = /^[0-9a-f]{16}$/i;
          function s(e3) {
            return i2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function c(e3) {
            return o.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t3.isValidTraceId = s, t3.isValidSpanId = c, t3.isSpanContextValid = function(e3) {
            return s(e3.traceId) && c(e3.spanId);
          }, t3.wrapSpanContext = function(e3) {
            return new a2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t3.SpanStatusCode || (t3.SpanStatusCode = {}));
        }, 475: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t3.TraceFlags || (t3.TraceFlags = {}));
        }, 521: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.VERSION = void 0, t3.VERSION = "1.6.0";
        } }, n = {};
        function a(e2) {
          var r2 = n[e2];
          if (void 0 !== r2) return r2.exports;
          var i2 = n[e2] = { exports: {} }, o = true;
          try {
            t2[e2].call(i2.exports, i2, i2.exports, a), o = false;
          } finally {
            o && delete n[e2];
          }
          return i2.exports;
        }
        a.ab = "//";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true }), i.trace = i.propagation = i.metrics = i.diag = i.context = i.INVALID_SPAN_CONTEXT = i.INVALID_TRACEID = i.INVALID_SPANID = i.isValidSpanId = i.isValidTraceId = i.isSpanContextValid = i.createTraceState = i.TraceFlags = i.SpanStatusCode = i.SpanKind = i.SamplingDecision = i.ProxyTracerProvider = i.ProxyTracer = i.defaultTextMapSetter = i.defaultTextMapGetter = i.ValueType = i.createNoopMeter = i.DiagLogLevel = i.DiagConsoleLogger = i.ROOT_CONTEXT = i.createContextKey = i.baggageEntryMetadataFromString = void 0;
          var e2 = a(369);
          Object.defineProperty(i, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t3 = a(780);
          Object.defineProperty(i, "createContextKey", { enumerable: true, get: function() {
            return t3.createContextKey;
          } }), Object.defineProperty(i, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t3.ROOT_CONTEXT;
          } });
          var r2 = a(972);
          Object.defineProperty(i, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r2.DiagConsoleLogger;
          } });
          var n2 = a(957);
          Object.defineProperty(i, "DiagLogLevel", { enumerable: true, get: function() {
            return n2.DiagLogLevel;
          } });
          var o = a(102);
          Object.defineProperty(i, "createNoopMeter", { enumerable: true, get: function() {
            return o.createNoopMeter;
          } });
          var s = a(901);
          Object.defineProperty(i, "ValueType", { enumerable: true, get: function() {
            return s.ValueType;
          } });
          var c = a(194);
          Object.defineProperty(i, "defaultTextMapGetter", { enumerable: true, get: function() {
            return c.defaultTextMapGetter;
          } }), Object.defineProperty(i, "defaultTextMapSetter", { enumerable: true, get: function() {
            return c.defaultTextMapSetter;
          } });
          var l = a(125);
          Object.defineProperty(i, "ProxyTracer", { enumerable: true, get: function() {
            return l.ProxyTracer;
          } });
          var d = a(846);
          Object.defineProperty(i, "ProxyTracerProvider", { enumerable: true, get: function() {
            return d.ProxyTracerProvider;
          } });
          var u = a(996);
          Object.defineProperty(i, "SamplingDecision", { enumerable: true, get: function() {
            return u.SamplingDecision;
          } });
          var p = a(357);
          Object.defineProperty(i, "SpanKind", { enumerable: true, get: function() {
            return p.SpanKind;
          } });
          var h = a(847);
          Object.defineProperty(i, "SpanStatusCode", { enumerable: true, get: function() {
            return h.SpanStatusCode;
          } });
          var f = a(475);
          Object.defineProperty(i, "TraceFlags", { enumerable: true, get: function() {
            return f.TraceFlags;
          } });
          var g = a(98);
          Object.defineProperty(i, "createTraceState", { enumerable: true, get: function() {
            return g.createTraceState;
          } });
          var y = a(139);
          Object.defineProperty(i, "isSpanContextValid", { enumerable: true, get: function() {
            return y.isSpanContextValid;
          } }), Object.defineProperty(i, "isValidTraceId", { enumerable: true, get: function() {
            return y.isValidTraceId;
          } }), Object.defineProperty(i, "isValidSpanId", { enumerable: true, get: function() {
            return y.isValidSpanId;
          } });
          var w = a(476);
          Object.defineProperty(i, "INVALID_SPANID", { enumerable: true, get: function() {
            return w.INVALID_SPANID;
          } }), Object.defineProperty(i, "INVALID_TRACEID", { enumerable: true, get: function() {
            return w.INVALID_TRACEID;
          } }), Object.defineProperty(i, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return w.INVALID_SPAN_CONTEXT;
          } });
          let m = a(67);
          Object.defineProperty(i, "context", { enumerable: true, get: function() {
            return m.context;
          } });
          let b = a(506);
          Object.defineProperty(i, "diag", { enumerable: true, get: function() {
            return b.diag;
          } });
          let v = a(886);
          Object.defineProperty(i, "metrics", { enumerable: true, get: function() {
            return v.metrics;
          } });
          let S = a(939);
          Object.defineProperty(i, "propagation", { enumerable: true, get: function() {
            return S.propagation;
          } });
          let E = a(845);
          Object.defineProperty(i, "trace", { enumerable: true, get: function() {
            return E.trace;
          } }), i.default = { context: m.context, diag: b.diag, metrics: v.metrics, propagation: S.propagation, trace: E.trace };
        })(), e.exports = i;
      })();
    }, 133: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var a2 = {}, i = t2.split(n), o = (r2 || {}).decode || e2, s = 0; s < i.length; s++) {
              var c = i[s], l = c.indexOf("=");
              if (!(l < 0)) {
                var d = c.substr(0, l).trim(), u = c.substr(++l, c.length).trim();
                '"' == u[0] && (u = u.slice(1, -1)), void 0 == a2[d] && (a2[d] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(u, o));
              }
            }
            return a2;
          }, t.serialize = function(e3, t2, n2) {
            var i = n2 || {}, o = i.encode || r;
            if ("function" != typeof o) throw TypeError("option encode is invalid");
            if (!a.test(e3)) throw TypeError("argument name is invalid");
            var s = o(t2);
            if (s && !a.test(s)) throw TypeError("argument val is invalid");
            var c = e3 + "=" + s;
            if (null != i.maxAge) {
              var l = i.maxAge - 0;
              if (isNaN(l) || !isFinite(l)) throw TypeError("option maxAge is invalid");
              c += "; Max-Age=" + Math.floor(l);
            }
            if (i.domain) {
              if (!a.test(i.domain)) throw TypeError("option domain is invalid");
              c += "; Domain=" + i.domain;
            }
            if (i.path) {
              if (!a.test(i.path)) throw TypeError("option path is invalid");
              c += "; Path=" + i.path;
            }
            if (i.expires) {
              if ("function" != typeof i.expires.toUTCString) throw TypeError("option expires is invalid");
              c += "; Expires=" + i.expires.toUTCString();
            }
            if (i.httpOnly && (c += "; HttpOnly"), i.secure && (c += "; Secure"), i.sameSite) switch ("string" == typeof i.sameSite ? i.sameSite.toLowerCase() : i.sameSite) {
              case true:
              case "strict":
                c += "; SameSite=Strict";
                break;
              case "lax":
                c += "; SameSite=Lax";
                break;
              case "none":
                c += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return c;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, n = /; */, a = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 340: (e, t, r) => {
      var n;
      (() => {
        var a = { 226: function(a2, i2) {
          !function(o2, s2) {
            "use strict";
            var c = "function", l = "undefined", d = "object", u = "string", p = "major", h = "model", f = "name", g = "type", y = "vendor", w = "version", m = "architecture", b = "console", v = "mobile", S = "tablet", E = "smarttv", _ = "wearable", A = "embedded", P = "Amazon", C = "Apple", x = "ASUS", R = "BlackBerry", T = "Browser", O = "Chrome", k = "Firefox", I = "Google", N = "Huawei", H = "Microsoft", M = "Motorola", D = "Opera", U = "Samsung", W = "Sharp", L = "Sony", K = "Xiaomi", j = "Zebra", J = "Facebook", B = "Chromium OS", $ = "Mac OS", V = function(e2, t2) {
              var r2 = {};
              for (var n2 in e2) t2[n2] && t2[n2].length % 2 == 0 ? r2[n2] = t2[n2].concat(e2[n2]) : r2[n2] = e2[n2];
              return r2;
            }, G = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, q = function(e2, t2) {
              return typeof e2 === u && -1 !== F(t2).indexOf(F(e2));
            }, F = function(e2) {
              return e2.toLowerCase();
            }, z = function(e2, t2) {
              if (typeof e2 === u) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === l ? e2 : e2.substring(0, 350);
            }, X = function(e2, t2) {
              for (var r2, n2, a3, i3, o3, l2, u2 = 0; u2 < t2.length && !o3; ) {
                var p2 = t2[u2], h2 = t2[u2 + 1];
                for (r2 = n2 = 0; r2 < p2.length && !o3 && p2[r2]; ) if (o3 = p2[r2++].exec(e2)) for (a3 = 0; a3 < h2.length; a3++) l2 = o3[++n2], typeof (i3 = h2[a3]) === d && i3.length > 0 ? 2 === i3.length ? typeof i3[1] == c ? this[i3[0]] = i3[1].call(this, l2) : this[i3[0]] = i3[1] : 3 === i3.length ? typeof i3[1] !== c || i3[1].exec && i3[1].test ? this[i3[0]] = l2 ? l2.replace(i3[1], i3[2]) : void 0 : this[i3[0]] = l2 ? i3[1].call(this, l2, i3[2]) : void 0 : 4 === i3.length && (this[i3[0]] = l2 ? i3[3].call(this, l2.replace(i3[1], i3[2])) : void 0) : this[i3] = l2 || s2;
                u2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === d && t2[r2].length > 0) {
                for (var n2 = 0; n2 < t2[r2].length; n2++) if (q(t2[r2][n2], e2)) return "?" === r2 ? s2 : r2;
              } else if (q(t2[r2], e2)) return "?" === r2 ? s2 : r2;
              return e2;
            }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [w, [f, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [w, [f, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [f, w], [/opios[\/ ]+([\w\.]+)/i], [w, [f, D + " Mini"]], [/\bopr\/([\w\.]+)/i], [w, [f, D]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [f, w], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [w, [f, "UC" + T]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [w, [f, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [w, [f, "WeChat"]], [/konqueror\/([\w\.]+)/i], [w, [f, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [w, [f, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [w, [f, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[f, /(.+)/, "$1 Secure " + T], w], [/\bfocus\/([\w\.]+)/i], [w, [f, k + " Focus"]], [/\bopt\/([\w\.]+)/i], [w, [f, D + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [w, [f, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [w, [f, "Dolphin"]], [/coast\/([\w\.]+)/i], [w, [f, D + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [w, [f, "MIUI " + T]], [/fxios\/([-\w\.]+)/i], [w, [f, k]], [/\bqihu|(qi?ho?o?|360)browser/i], [[f, "360 " + T]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[f, /(.+)/, "$1 " + T], w], [/(comodo_dragon)\/([\w\.]+)/i], [[f, /_/g, " "], w], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [f, w], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [f], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[f, J], w], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [f, w], [/\bgsa\/([\w\.]+) .*safari\//i], [w, [f, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [w, [f, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [w, [f, O + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[f, O + " WebView"], w], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [w, [f, "Android " + T]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [f, w], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [w, [f, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [w, f], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [f, [w, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [f, w], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[f, "Netscape"], w], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [w, [f, k + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [f, w], [/(cobalt)\/([\w\.]+)/i], [f, [w, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[m, "amd64"]], [/(ia32(?=;))/i], [[m, F]], [/((?:i[346]|x)86)[;\)]/i], [[m, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[m, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[m, "armhf"]], [/windows (ce|mobile); ppc;/i], [[m, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[m, /ower/, "", F]], [/(sun4\w)[;\)]/i], [[m, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[m, F]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [h, [y, U], [g, S]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [h, [y, U], [g, v]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [h, [y, C], [g, v]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [h, [y, C], [g, S]], [/(macintosh);/i], [h, [y, C]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [h, [y, W], [g, v]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [h, [y, N], [g, S]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [h, [y, N], [g, v]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[h, /_/g, " "], [y, K], [g, v]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[h, /_/g, " "], [y, K], [g, S]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [h, [y, "OPPO"], [g, v]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [h, [y, "Vivo"], [g, v]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [h, [y, "Realme"], [g, v]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [h, [y, M], [g, v]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [h, [y, M], [g, S]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [h, [y, "LG"], [g, S]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [h, [y, "LG"], [g, v]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [h, [y, "Lenovo"], [g, S]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[h, /_/g, " "], [y, "Nokia"], [g, v]], [/(pixel c)\b/i], [h, [y, I], [g, S]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [h, [y, I], [g, v]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [h, [y, L], [g, v]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[h, "Xperia Tablet"], [y, L], [g, S]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [h, [y, "OnePlus"], [g, v]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [h, [y, P], [g, S]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[h, /(.+)/g, "Fire Phone $1"], [y, P], [g, v]], [/(playbook);[-\w\),; ]+(rim)/i], [h, y, [g, S]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [h, [y, R], [g, v]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [h, [y, x], [g, S]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [h, [y, x], [g, v]], [/(nexus 9)/i], [h, [y, "HTC"], [g, S]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [y, [h, /_/g, " "], [g, v]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [h, [y, "Acer"], [g, S]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [h, [y, "Meizu"], [g, v]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [y, h, [g, v]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [y, h, [g, S]], [/(surface duo)/i], [h, [y, H], [g, S]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [h, [y, "Fairphone"], [g, v]], [/(u304aa)/i], [h, [y, "AT&T"], [g, v]], [/\bsie-(\w*)/i], [h, [y, "Siemens"], [g, v]], [/\b(rct\w+) b/i], [h, [y, "RCA"], [g, S]], [/\b(venue[\d ]{2,7}) b/i], [h, [y, "Dell"], [g, S]], [/\b(q(?:mv|ta)\w+) b/i], [h, [y, "Verizon"], [g, S]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [h, [y, "Barnes & Noble"], [g, S]], [/\b(tm\d{3}\w+) b/i], [h, [y, "NuVision"], [g, S]], [/\b(k88) b/i], [h, [y, "ZTE"], [g, S]], [/\b(nx\d{3}j) b/i], [h, [y, "ZTE"], [g, v]], [/\b(gen\d{3}) b.+49h/i], [h, [y, "Swiss"], [g, v]], [/\b(zur\d{3}) b/i], [h, [y, "Swiss"], [g, S]], [/\b((zeki)?tb.*\b) b/i], [h, [y, "Zeki"], [g, S]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[y, "Dragon Touch"], h, [g, S]], [/\b(ns-?\w{0,9}) b/i], [h, [y, "Insignia"], [g, S]], [/\b((nxa|next)-?\w{0,9}) b/i], [h, [y, "NextBook"], [g, S]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[y, "Voice"], h, [g, v]], [/\b(lvtel\-)?(v1[12]) b/i], [[y, "LvTel"], h, [g, v]], [/\b(ph-1) /i], [h, [y, "Essential"], [g, v]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [h, [y, "Envizen"], [g, S]], [/\b(trio[-\w\. ]+) b/i], [h, [y, "MachSpeed"], [g, S]], [/\btu_(1491) b/i], [h, [y, "Rotor"], [g, S]], [/(shield[\w ]+) b/i], [h, [y, "Nvidia"], [g, S]], [/(sprint) (\w+)/i], [y, h, [g, v]], [/(kin\.[onetw]{3})/i], [[h, /\./g, " "], [y, H], [g, v]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [h, [y, j], [g, S]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [h, [y, j], [g, v]], [/smart-tv.+(samsung)/i], [y, [g, E]], [/hbbtv.+maple;(\d+)/i], [[h, /^/, "SmartTV"], [y, U], [g, E]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[y, "LG"], [g, E]], [/(apple) ?tv/i], [y, [h, C + " TV"], [g, E]], [/crkey/i], [[h, O + "cast"], [y, I], [g, E]], [/droid.+aft(\w)( bui|\))/i], [h, [y, P], [g, E]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [h, [y, W], [g, E]], [/(bravia[\w ]+)( bui|\))/i], [h, [y, L], [g, E]], [/(mitv-\w{5}) bui/i], [h, [y, K], [g, E]], [/Hbbtv.*(technisat) (.*);/i], [y, h, [g, E]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[y, z], [h, z], [g, E]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[g, E]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [y, h, [g, b]], [/droid.+; (shield) bui/i], [h, [y, "Nvidia"], [g, b]], [/(playstation [345portablevi]+)/i], [h, [y, L], [g, b]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [h, [y, H], [g, b]], [/((pebble))app/i], [y, h, [g, _]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [h, [y, C], [g, _]], [/droid.+; (glass) \d/i], [h, [y, I], [g, _]], [/droid.+; (wt63?0{2,3})\)/i], [h, [y, j], [g, _]], [/(quest( 2| pro)?)/i], [h, [y, J], [g, _]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [y, [g, A]], [/(aeobc)\b/i], [h, [y, P], [g, A]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [h, [g, v]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [h, [g, S]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[g, S]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[g, v]], [/(android[-\w\. ]{0,9});.+buil/i], [h, [y, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [w, [f, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [w, [f, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [f, w], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [w, f]], os: [[/microsoft (windows) (vista|xp)/i], [f, w], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [f, [w, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[f, "Windows"], [w, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[w, /_/g, "."], [f, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[f, $], [w, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [w, f], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [f, w], [/\(bb(10);/i], [w, [f, R]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [w, [f, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [w, [f, k + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [w, [f, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [w, [f, "watchOS"]], [/crkey\/([\d\.]+)/i], [w, [f, O + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[f, B], w], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [f, w], [/(sunos) ?([\w\.\d]*)/i], [[f, "Solaris"], w], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [f, w]] }, ee = function(e2, t2) {
              if (typeof e2 === d && (t2 = e2, e2 = s2), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof o2 !== l && o2.navigator ? o2.navigator : s2, n2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), a3 = r2 && r2.userAgentData ? r2.userAgentData : s2, i3 = t2 ? V(Q, t2) : Q, b2 = r2 && r2.userAgent == n2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[f] = s2, t3[w] = s2, X.call(t3, n2, i3.browser), t3[p] = typeof (e3 = t3[w]) === u ? e3.replace(/[^\d\.]/g, "").split(".")[0] : s2, b2 && r2 && r2.brave && typeof r2.brave.isBrave == c && (t3[f] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[m] = s2, X.call(e3, n2, i3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[y] = s2, e3[h] = s2, e3[g] = s2, X.call(e3, n2, i3.device), b2 && !e3[g] && a3 && a3.mobile && (e3[g] = v), b2 && "Macintosh" == e3[h] && r2 && typeof r2.standalone !== l && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[h] = "iPad", e3[g] = S), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[f] = s2, e3[w] = s2, X.call(e3, n2, i3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[f] = s2, e3[w] = s2, X.call(e3, n2, i3.os), b2 && !e3[f] && a3 && "Unknown" != a3.platform && (e3[f] = a3.platform.replace(/chrome os/i, B).replace(/macos/i, $)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return n2;
              }, this.setUA = function(e3) {
                return n2 = typeof e3 === u && e3.length > 350 ? z(e3, 350) : e3, this;
              }, this.setUA(n2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = G([f, w, p]), ee.CPU = G([m]), ee.DEVICE = G([h, y, g, b, v, E, S, _, A]), ee.ENGINE = ee.OS = G([f, w]), typeof i2 !== l ? (a2.exports && (i2 = a2.exports = ee), i2.UAParser = ee) : r.amdO ? void 0 !== (n = function() {
              return ee;
            }.call(t, r, t, e)) && (e.exports = n) : typeof o2 !== l && (o2.UAParser = ee);
            var et = typeof o2 !== l && (o2.jQuery || o2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, i = {};
        function o(e2) {
          var t2 = i[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = i[e2] = { exports: {} }, n2 = true;
          try {
            a[e2].call(r2.exports, r2, r2.exports, o), n2 = false;
          } finally {
            n2 && delete i[e2];
          }
          return r2.exports;
        }
        o.ab = "//";
        var s = o(226);
        e.exports = s;
      })();
    }, 635: (e, t, r) => {
      "use strict";
      function n() {
        throw Error('ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead');
      }
      r.r(t), r.d(t, { ImageResponse: () => n, NextRequest: () => a.I, NextResponse: () => i.x, URLPattern: () => d, userAgent: () => l, userAgentFromString: () => c });
      var a = r(669), i = r(241), o = r(340), s = r.n(o);
      function c(e2) {
        return { ...s()(e2), isBot: void 0 !== e2 && /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(e2) };
      }
      function l({ headers: e2 }) {
        return c(e2.get("user-agent") || void 0);
      }
      let d = "undefined" == typeof URLPattern ? void 0 : URLPattern;
    }, 416: (e, t, r) => {
      "use strict";
      r.d(t, { Y5: () => i, cR: () => a, qJ: () => n });
      class n extends Error {
        constructor({ page: e2 }) {
          super(`The middleware "${e2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class a extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class i extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
    }, 718: (e, t, r) => {
      "use strict";
      function n(e2) {
        return e2.replace(/\/$/, "") || "/";
      }
      function a(e2) {
        let t2 = e2.indexOf("#"), r2 = e2.indexOf("?"), n2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return n2 || t2 > -1 ? { pathname: e2.substring(0, n2 ? r2 : t2), query: n2 ? e2.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e2.slice(t2) : "" } : { pathname: e2, query: "", hash: "" };
      }
      function i(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: n2, hash: i2 } = a(e2);
        return "" + t2 + r2 + n2 + i2;
      }
      function o(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: n2, hash: i2 } = a(e2);
        return "" + r2 + t2 + n2 + i2;
      }
      function s(e2, t2) {
        if ("string" != typeof e2) return false;
        let { pathname: r2 } = a(e2);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      function c(e2, t2) {
        let r2;
        let n2 = e2.split("/");
        return (t2 || []).some((t3) => !!n2[1] && n2[1].toLowerCase() === t3.toLowerCase() && (r2 = t3, n2.splice(1, 1), e2 = n2.join("/") || "/", true)), { pathname: e2, detectedLocale: r2 };
      }
      r.d(t, { c: () => p });
      let l = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function d(e2, t2) {
        return new URL(String(e2).replace(l, "localhost"), t2 && String(t2).replace(l, "localhost"));
      }
      let u = Symbol("NextURLInternal");
      class p {
        constructor(e2, t2, r2) {
          let n2, a2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (n2 = t2, a2 = r2 || {}) : a2 = r2 || t2 || {}, this[u] = { url: d(e2, n2 ?? a2.base), options: a2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e2, t2, r2, n2, a2;
          let i2 = function(e3, t3) {
            var r3, n3;
            let { basePath: a3, i18n: i3, trailingSlash: o3 } = null != (r3 = t3.nextConfig) ? r3 : {}, l3 = { pathname: e3, trailingSlash: "/" !== e3 ? e3.endsWith("/") : o3 };
            a3 && s(l3.pathname, a3) && (l3.pathname = function(e4, t4) {
              if (!s(e4, t4)) return e4;
              let r4 = e4.slice(t4.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(l3.pathname, a3), l3.basePath = a3);
            let d2 = l3.pathname;
            if (l3.pathname.startsWith("/_next/data/") && l3.pathname.endsWith(".json")) {
              let e4 = l3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), r4 = e4[0];
              l3.buildId = r4, d2 = "index" !== e4[1] ? "/" + e4.slice(1).join("/") : "/", true === t3.parseData && (l3.pathname = d2);
            }
            if (i3) {
              let e4 = t3.i18nProvider ? t3.i18nProvider.analyze(l3.pathname) : c(l3.pathname, i3.locales);
              l3.locale = e4.detectedLocale, l3.pathname = null != (n3 = e4.pathname) ? n3 : l3.pathname, !e4.detectedLocale && l3.buildId && (e4 = t3.i18nProvider ? t3.i18nProvider.analyze(d2) : c(d2, i3.locales)).detectedLocale && (l3.locale = e4.detectedLocale);
            }
            return l3;
          }(this[u].url.pathname, { nextConfig: this[u].options.nextConfig, parseData: true, i18nProvider: this[u].options.i18nProvider }), o2 = function(e3, t3) {
            let r3;
            if ((null == t3 ? void 0 : t3.host) && !Array.isArray(t3.host)) r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e3.hostname) return;
              r3 = e3.hostname;
            }
            return r3.toLowerCase();
          }(this[u].url, this[u].options.headers);
          this[u].domainLocale = this[u].options.i18nProvider ? this[u].options.i18nProvider.detectDomainLocale(o2) : function(e3, t3, r3) {
            if (e3) for (let i3 of (r3 && (r3 = r3.toLowerCase()), e3)) {
              var n3, a3;
              if (t3 === (null == (n3 = i3.domain) ? void 0 : n3.split(":", 1)[0].toLowerCase()) || r3 === i3.defaultLocale.toLowerCase() || (null == (a3 = i3.locales) ? void 0 : a3.some((e4) => e4.toLowerCase() === r3))) return i3;
            }
          }(null == (t2 = this[u].options.nextConfig) ? void 0 : null == (e2 = t2.i18n) ? void 0 : e2.domains, o2);
          let l2 = (null == (r2 = this[u].domainLocale) ? void 0 : r2.defaultLocale) || (null == (a2 = this[u].options.nextConfig) ? void 0 : null == (n2 = a2.i18n) ? void 0 : n2.defaultLocale);
          this[u].url.pathname = i2.pathname, this[u].defaultLocale = l2, this[u].basePath = i2.basePath ?? "", this[u].buildId = i2.buildId, this[u].locale = i2.locale ?? l2, this[u].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e2;
          let t2;
          return t2 = function(e3, t3, r2, n2) {
            if (!t3 || t3 === r2) return e3;
            let a2 = e3.toLowerCase();
            return !n2 && (s(a2, "/api") || s(a2, "/" + t3.toLowerCase())) ? e3 : i(e3, "/" + t3);
          }((e2 = { basePath: this[u].basePath, buildId: this[u].buildId, defaultLocale: this[u].options.forceLocale ? void 0 : this[u].defaultLocale, locale: this[u].locale, pathname: this[u].url.pathname, trailingSlash: this[u].trailingSlash }).pathname, e2.locale, e2.buildId ? void 0 : e2.defaultLocale, e2.ignorePrefix), (e2.buildId || !e2.trailingSlash) && (t2 = n(t2)), e2.buildId && (t2 = o(i(t2, "/_next/data/" + e2.buildId), "/" === e2.pathname ? "index.json" : ".json")), t2 = i(t2, e2.basePath), !e2.buildId && e2.trailingSlash ? t2.endsWith("/") ? t2 : o(t2, "/") : n(t2);
        }
        formatSearch() {
          return this[u].url.search;
        }
        get buildId() {
          return this[u].buildId;
        }
        set buildId(e2) {
          this[u].buildId = e2;
        }
        get locale() {
          return this[u].locale ?? "";
        }
        set locale(e2) {
          var t2, r2;
          if (!this[u].locale || !(null == (r2 = this[u].options.nextConfig) ? void 0 : null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e2))) throw TypeError(`The NextURL configuration includes no locale "${e2}"`);
          this[u].locale = e2;
        }
        get defaultLocale() {
          return this[u].defaultLocale;
        }
        get domainLocale() {
          return this[u].domainLocale;
        }
        get searchParams() {
          return this[u].url.searchParams;
        }
        get host() {
          return this[u].url.host;
        }
        set host(e2) {
          this[u].url.host = e2;
        }
        get hostname() {
          return this[u].url.hostname;
        }
        set hostname(e2) {
          this[u].url.hostname = e2;
        }
        get port() {
          return this[u].url.port;
        }
        set port(e2) {
          this[u].url.port = e2;
        }
        get protocol() {
          return this[u].url.protocol;
        }
        set protocol(e2) {
          this[u].url.protocol = e2;
        }
        get href() {
          let e2 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e2}${t2}${this.hash}`;
        }
        set href(e2) {
          this[u].url = d(e2), this.analyze();
        }
        get origin() {
          return this[u].url.origin;
        }
        get pathname() {
          return this[u].url.pathname;
        }
        set pathname(e2) {
          this[u].url.pathname = e2;
        }
        get hash() {
          return this[u].url.hash;
        }
        set hash(e2) {
          this[u].url.hash = e2;
        }
        get search() {
          return this[u].url.search;
        }
        set search(e2) {
          this[u].url.search = e2;
        }
        get password() {
          return this[u].url.password;
        }
        set password(e2) {
          this[u].url.password = e2;
        }
        get username() {
          return this[u].url.username;
        }
        set username(e2) {
          this[u].url.username = e2;
        }
        get basePath() {
          return this[u].basePath;
        }
        set basePath(e2) {
          this[u].basePath = e2.startsWith("/") ? e2 : `/${e2}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new p(String(this), this[u].options);
        }
      }
    }, 217: (e, t, r) => {
      "use strict";
      r.d(t, { g: () => n });
      class n {
        static get(e2, t2, r2) {
          let n2 = Reflect.get(e2, t2, r2);
          return "function" == typeof n2 ? n2.bind(e2) : n2;
        }
        static set(e2, t2, r2, n2) {
          return Reflect.set(e2, t2, r2, n2);
        }
        static has(e2, t2) {
          return Reflect.has(e2, t2);
        }
        static deleteProperty(e2, t2) {
          return Reflect.deleteProperty(e2, t2);
        }
      }
    }, 938: (e, t, r) => {
      "use strict";
      r.d(t, { Q7: () => n.stringifyCookie, nV: () => n.ResponseCookies, qC: () => n.RequestCookies });
      var n = r(945);
    }, 669: (e, t, r) => {
      "use strict";
      r.d(t, { I: () => c });
      var n = r(718), a = r(329), i = r(416), o = r(938);
      let s = Symbol("internal request");
      class c extends Request {
        constructor(e2, t2 = {}) {
          let r2 = "string" != typeof e2 && "url" in e2 ? e2.url : String(e2);
          (0, a.r4)(r2), e2 instanceof Request ? super(e2, t2) : super(r2, t2);
          let i2 = new n.c(r2, { headers: (0, a.lb)(this.headers), nextConfig: t2.nextConfig });
          this[s] = { cookies: new o.qC(this.headers), geo: t2.geo || {}, ip: t2.ip, nextUrl: i2, url: i2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, geo: this.geo, ip: this.ip, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[s].cookies;
        }
        get geo() {
          return this[s].geo;
        }
        get ip() {
          return this[s].ip;
        }
        get nextUrl() {
          return this[s].nextUrl;
        }
        get page() {
          throw new i.cR();
        }
        get ua() {
          throw new i.Y5();
        }
        get url() {
          return this[s].url;
        }
      }
    }, 241: (e, t, r) => {
      "use strict";
      r.d(t, { x: () => d });
      var n = r(938), a = r(718), i = r(329), o = r(217);
      let s = Symbol("internal response"), c = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function l(e2, t2) {
        var r2;
        if (null == e2 ? void 0 : null == (r2 = e2.request) ? void 0 : r2.headers) {
          if (!(e2.request.headers instanceof Headers)) throw Error("request.headers must be an instance of Headers");
          let r3 = [];
          for (let [n2, a2] of e2.request.headers) t2.set("x-middleware-request-" + n2, a2), r3.push(n2);
          t2.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class d extends Response {
        constructor(e2, t2 = {}) {
          super(e2, t2);
          let r2 = this.headers, c2 = new Proxy(new n.nV(r2), { get(e3, a2, i2) {
            switch (a2) {
              case "delete":
              case "set":
                return (...i3) => {
                  let o2 = Reflect.apply(e3[a2], e3, i3), s2 = new Headers(r2);
                  return o2 instanceof n.nV && r2.set("x-middleware-set-cookie", o2.getAll().map((e4) => (0, n.Q7)(e4)).join(",")), l(t2, s2), o2;
                };
              default:
                return o.g.get(e3, a2, i2);
            }
          } });
          this[s] = { cookies: c2, url: t2.url ? new a.c(t2.url, { headers: (0, i.lb)(r2), nextConfig: t2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[s].cookies;
        }
        static json(e2, t2) {
          let r2 = Response.json(e2, t2);
          return new d(r2.body, r2);
        }
        static redirect(e2, t2) {
          let r2 = "number" == typeof t2 ? t2 : (null == t2 ? void 0 : t2.status) ?? 307;
          if (!c.has(r2)) throw RangeError('Failed to execute "redirect" on "response": Invalid status code');
          let n2 = "object" == typeof t2 ? t2 : {}, a2 = new Headers(null == n2 ? void 0 : n2.headers);
          return a2.set("Location", (0, i.r4)(e2)), new d(null, { ...n2, headers: a2, status: r2 });
        }
        static rewrite(e2, t2) {
          let r2 = new Headers(null == t2 ? void 0 : t2.headers);
          return r2.set("x-middleware-rewrite", (0, i.r4)(e2)), l(t2, r2), new d(null, { ...t2, headers: r2 });
        }
        static next(e2) {
          let t2 = new Headers(null == e2 ? void 0 : e2.headers);
          return t2.set("x-middleware-next", "1"), l(e2, t2), new d(null, { ...e2, headers: t2 });
        }
      }
    }, 329: (e, t, r) => {
      "use strict";
      function n(e2) {
        let t2 = new Headers();
        for (let [r2, n2] of Object.entries(e2)) for (let e3 of Array.isArray(n2) ? n2 : [n2]) void 0 !== e3 && ("number" == typeof e3 && (e3 = e3.toString()), t2.append(r2, e3));
        return t2;
      }
      function a(e2) {
        var t2, r2, n2, a2, i2, o2 = [], s = 0;
        function c() {
          for (; s < e2.length && /\s/.test(e2.charAt(s)); ) s += 1;
          return s < e2.length;
        }
        for (; s < e2.length; ) {
          for (t2 = s, i2 = false; c(); ) if ("," === (r2 = e2.charAt(s))) {
            for (n2 = s, s += 1, c(), a2 = s; s < e2.length && "=" !== (r2 = e2.charAt(s)) && ";" !== r2 && "," !== r2; ) s += 1;
            s < e2.length && "=" === e2.charAt(s) ? (i2 = true, s = a2, o2.push(e2.substring(t2, n2)), t2 = s) : s = n2 + 1;
          } else s += 1;
          (!i2 || s >= e2.length) && o2.push(e2.substring(t2, e2.length));
        }
        return o2;
      }
      function i(e2) {
        let t2 = {}, r2 = [];
        if (e2) for (let [n2, i2] of e2.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...a(i2)), t2[n2] = 1 === r2.length ? r2[0] : r2) : t2[n2] = i2;
        return t2;
      }
      function o(e2) {
        try {
          return String(new URL(String(e2)));
        } catch (t2) {
          throw Error(`URL is malformed "${String(e2)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 });
        }
      }
      r.d(t, { EK: () => n, l$: () => a, lb: () => i, r4: () => o });
    }, 488: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return o;
      }, withRequest: function() {
        return i;
      } });
      let n = new (r(67)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (r2) return { url: t2.url(e2), proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function i(e2, t2, r2) {
        let i2 = a(e2, t2);
        return i2 ? n.run(i2, r2) : r2();
      }
      function o(e2, t2) {
        return n.getStore() || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 375: (e, t, r) => {
      "use strict";
      var n = r(195).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return s;
      }, interceptFetch: function() {
        return c;
      }, reader: function() {
        return i;
      } });
      let a = r(488), i = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function o(e2, t2) {
        let { url: r2, method: a2, headers: i2, body: o2, cache: s2, credentials: c2, integrity: l, mode: d, redirect: u, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: a2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: o2 ? n.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: c2, integrity: l, mode: d, redirect: u, referrer: p, referrerPolicy: h } };
      }
      async function s(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, i);
        if (!r2) return e2(t2);
        let { testData: s2, proxyPort: c2 } = r2, l = await o(s2, t2), d = await e2(`http://localhost:${c2}`, { method: "POST", body: JSON.stringify(l), next: { internal: true } });
        if (!d.ok) throw Error(`Proxy request failed: ${d.status}`);
        let u = await d.json(), { api: p } = u;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Error(`Proxy request aborted [${t2.method} ${t2.url}]`);
        }
        return function(e3) {
          let { status: t3, headers: r3, body: a2 } = e3.response;
          return new Response(a2 ? n.from(a2, "base64") : null, { status: t3, headers: new Headers(r3) });
        }(u);
      }
      function c(e2) {
        return r.g.fetch = function(t2, r2) {
          var n2;
          return (null == r2 ? void 0 : null == (n2 = r2.next) ? void 0 : n2.internal) ? e2(t2, r2) : s(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 177: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return i;
      }, wrapRequestHandler: function() {
        return o;
      } });
      let n = r(488), a = r(375);
      function i() {
        return (0, a.interceptFetch)(r.g.fetch);
      }
      function o(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    }, 476: (e) => {
      e.exports = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }, e.exports.__esModule = true, e.exports.default = e.exports;
    }, 728: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { default: () => o, hkdf: () => o });
      let n = () => {
        if ("undefined" != typeof globalThis) return globalThis;
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        throw Error("unable to locate global object");
      }, a = async (e2, t2, r2, a2, i2) => {
        let { crypto: { subtle: o2 } } = n();
        return new Uint8Array(await o2.deriveBits({ name: "HKDF", hash: `SHA-${e2.substr(3)}`, salt: r2, info: a2 }, await o2.importKey("raw", t2, "HKDF", false, ["deriveBits"]), i2 << 3));
      };
      function i(e2, t2) {
        if ("string" == typeof e2) return new TextEncoder().encode(e2);
        if (!(e2 instanceof Uint8Array)) throw TypeError(`"${t2}"" must be an instance of Uint8Array or a string`);
        return e2;
      }
      async function o(e2, t2, r2, n2, o2) {
        return a(function(e3) {
          switch (e3) {
            case "sha256":
            case "sha384":
            case "sha512":
            case "sha1":
              return e3;
            default:
              throw TypeError('unsupported "digest" value');
          }
        }(e2), function(e3) {
          let t3 = i(e3, "ikm");
          if (!t3.byteLength) throw TypeError('"ikm" must be at least one byte in length');
          return t3;
        }(t2), i(r2, "salt"), function(e3) {
          let t3 = i(e3, "info");
          if (t3.byteLength > 1024) throw TypeError('"info" must not contain more than 1024 bytes');
          return t3;
        }(n2), function(e3, t3) {
          if ("number" != typeof e3 || !Number.isInteger(e3) || e3 < 1) throw TypeError('"keylen" must be a positive integer');
          if (e3 > 255 * (parseInt(t3.substr(3), 10) >> 3 || 20)) throw TypeError('"keylen" too large');
          return e3;
        }(o2, e2));
      }
    }, 507: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { CompactEncrypt: () => tp, CompactSign: () => tg, EmbeddedJWK: () => tA, EncryptJWT: () => tv, FlattenedEncrypt: () => e3, FlattenedSign: () => tf, GeneralEncrypt: () => e8, GeneralSign: () => tw, SignJWT: () => tb, UnsecuredJWT: () => tN, base64url: () => a, calculateJwkThumbprint: () => tE, calculateJwkThumbprintUri: () => t_, compactDecrypt: () => eY, compactVerify: () => tr, createLocalJWKSet: () => tT, createRemoteJWKSet: () => tI, cryptoRuntime: () => tB, decodeJwt: () => tU, decodeProtectedHeader: () => tD, errors: () => n, exportJWK: () => e2, exportPKCS8: () => e1, exportSPKI: () => e0, flattenedDecrypt: () => eX, flattenedVerify: () => tt, generalDecrypt: () => eZ, generalVerify: () => tn, generateKeyPair: () => tj, generateSecret: () => tJ, importJWK: () => eW, importPKCS8: () => eU, importSPKI: () => eM, importX509: () => eD, jwtDecrypt: () => tu, jwtVerify: () => td });
      var n = {};
      r.r(n), r.d(n, { JOSEAlgNotAllowed: () => _, JOSEError: () => v, JOSENotSupported: () => A, JWEDecompressionFailed: () => C, JWEDecryptionFailed: () => P, JWEInvalid: () => x, JWKInvalid: () => O, JWKSInvalid: () => k, JWKSMultipleMatchingKeys: () => N, JWKSNoMatchingKey: () => I, JWKSTimeout: () => H, JWSInvalid: () => R, JWSSignatureVerificationFailed: () => M, JWTClaimValidationFailed: () => S, JWTExpired: () => E, JWTInvalid: () => T });
      var a = {};
      r.r(a), r.d(a, { decode: () => tM, encode: () => tH });
      let i = crypto, o = (e10) => e10 instanceof CryptoKey, s = async (e10, t2) => {
        let r2 = `SHA-${e10.slice(-3)}`;
        return new Uint8Array(await i.subtle.digest(r2, t2));
      }, c = new TextEncoder(), l = new TextDecoder();
      function d(...e10) {
        let t2 = new Uint8Array(e10.reduce((e11, { length: t3 }) => e11 + t3, 0)), r2 = 0;
        return e10.forEach((e11) => {
          t2.set(e11, r2), r2 += e11.length;
        }), t2;
      }
      function u(e10, t2, r2) {
        if (t2 < 0 || t2 >= 4294967296) throw RangeError(`value must be >= 0 and <= ${4294967296 - 1}. Received ${t2}`);
        e10.set([t2 >>> 24, t2 >>> 16, t2 >>> 8, 255 & t2], r2);
      }
      function p(e10) {
        let t2 = new Uint8Array(8);
        return u(t2, Math.floor(e10 / 4294967296), 0), u(t2, e10 % 4294967296, 4), t2;
      }
      function h(e10) {
        let t2 = new Uint8Array(4);
        return u(t2, e10), t2;
      }
      function f(e10) {
        return d(h(e10.length), e10);
      }
      async function g(e10, t2, r2) {
        let n2 = Math.ceil((t2 >> 3) / 32), a2 = new Uint8Array(32 * n2);
        for (let t3 = 0; t3 < n2; t3++) {
          let n3 = new Uint8Array(4 + e10.length + r2.length);
          n3.set(h(t3 + 1)), n3.set(e10, 4), n3.set(r2, 4 + e10.length), a2.set(await s("sha256", n3), 32 * t3);
        }
        return a2.slice(0, t2 >> 3);
      }
      let y = (e10) => {
        let t2 = e10;
        "string" == typeof t2 && (t2 = c.encode(t2));
        let r2 = [];
        for (let e11 = 0; e11 < t2.length; e11 += 32768) r2.push(String.fromCharCode.apply(null, t2.subarray(e11, e11 + 32768)));
        return btoa(r2.join(""));
      }, w = (e10) => y(e10).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), m = (e10) => {
        let t2 = atob(e10), r2 = new Uint8Array(t2.length);
        for (let e11 = 0; e11 < t2.length; e11++) r2[e11] = t2.charCodeAt(e11);
        return r2;
      }, b = (e10) => {
        let t2 = e10;
        t2 instanceof Uint8Array && (t2 = l.decode(t2)), t2 = t2.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
        try {
          return m(t2);
        } catch (e11) {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      };
      class v extends Error {
        static get code() {
          return "ERR_JOSE_GENERIC";
        }
        constructor(e10) {
          var t2;
          super(e10), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, null === (t2 = Error.captureStackTrace) || void 0 === t2 || t2.call(Error, this, this.constructor);
        }
      }
      class S extends v {
        static get code() {
          return "ERR_JWT_CLAIM_VALIDATION_FAILED";
        }
        constructor(e10, t2 = "unspecified", r2 = "unspecified") {
          super(e10), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = t2, this.reason = r2;
        }
      }
      class E extends v {
        static get code() {
          return "ERR_JWT_EXPIRED";
        }
        constructor(e10, t2 = "unspecified", r2 = "unspecified") {
          super(e10), this.code = "ERR_JWT_EXPIRED", this.claim = t2, this.reason = r2;
        }
      }
      class _ extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
        }
        static get code() {
          return "ERR_JOSE_ALG_NOT_ALLOWED";
        }
      }
      class A extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
        }
        static get code() {
          return "ERR_JOSE_NOT_SUPPORTED";
        }
      }
      class P extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_DECRYPTION_FAILED", this.message = "decryption operation failed";
        }
        static get code() {
          return "ERR_JWE_DECRYPTION_FAILED";
        }
      }
      class C extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_DECOMPRESSION_FAILED", this.message = "decompression operation failed";
        }
        static get code() {
          return "ERR_JWE_DECOMPRESSION_FAILED";
        }
      }
      class x extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_INVALID";
        }
        static get code() {
          return "ERR_JWE_INVALID";
        }
      }
      class R extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWS_INVALID";
        }
        static get code() {
          return "ERR_JWS_INVALID";
        }
      }
      class T extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWT_INVALID";
        }
        static get code() {
          return "ERR_JWT_INVALID";
        }
      }
      class O extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWK_INVALID";
        }
        static get code() {
          return "ERR_JWK_INVALID";
        }
      }
      class k extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_INVALID";
        }
        static get code() {
          return "ERR_JWKS_INVALID";
        }
      }
      class I extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_NO_MATCHING_KEY", this.message = "no applicable key found in the JSON Web Key Set";
        }
        static get code() {
          return "ERR_JWKS_NO_MATCHING_KEY";
        }
      }
      class N extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS", this.message = "multiple matching keys found in the JSON Web Key Set";
        }
        static get code() {
          return "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        }
      }
      Symbol.asyncIterator;
      class H extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_TIMEOUT", this.message = "request timed out";
        }
        static get code() {
          return "ERR_JWKS_TIMEOUT";
        }
      }
      class M extends v {
        constructor() {
          super(...arguments), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED", this.message = "signature verification failed";
        }
        static get code() {
          return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        }
      }
      let D = i.getRandomValues.bind(i);
      function U(e10) {
        switch (e10) {
          case "A128GCM":
          case "A128GCMKW":
          case "A192GCM":
          case "A192GCMKW":
          case "A256GCM":
          case "A256GCMKW":
            return 96;
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return 128;
          default:
            throw new A(`Unsupported JWE Algorithm: ${e10}`);
        }
      }
      let W = (e10) => D(new Uint8Array(U(e10) >> 3)), L = (e10, t2) => {
        if (t2.length << 3 !== U(e10)) throw new x("Invalid Initialization Vector length");
      }, K = (e10, t2) => {
        let r2 = e10.byteLength << 3;
        if (r2 !== t2) throw new x(`Invalid Content Encryption Key length. Expected ${t2} bits, got ${r2} bits`);
      }, j = (e10, t2) => {
        if (!(e10 instanceof Uint8Array)) throw TypeError("First argument must be a buffer");
        if (!(t2 instanceof Uint8Array)) throw TypeError("Second argument must be a buffer");
        if (e10.length !== t2.length) throw TypeError("Input buffers must have the same length");
        let r2 = e10.length, n2 = 0, a2 = -1;
        for (; ++a2 < r2; ) n2 |= e10[a2] ^ t2[a2];
        return 0 === n2;
      };
      function J(e10, t2 = "algorithm.name") {
        return TypeError(`CryptoKey does not support this operation, its ${t2} must be ${e10}`);
      }
      function B(e10, t2) {
        return e10.name === t2;
      }
      function $(e10) {
        return parseInt(e10.name.slice(4), 10);
      }
      function V(e10, t2) {
        if (t2.length && !t2.some((t3) => e10.usages.includes(t3))) {
          let e11 = "CryptoKey does not support this operation, its usages must include ";
          if (t2.length > 2) {
            let r2 = t2.pop();
            e11 += `one of ${t2.join(", ")}, or ${r2}.`;
          } else 2 === t2.length ? e11 += `one of ${t2[0]} or ${t2[1]}.` : e11 += `${t2[0]}.`;
          throw TypeError(e11);
        }
      }
      function G(e10, t2, ...r2) {
        switch (t2) {
          case "A128GCM":
          case "A192GCM":
          case "A256GCM": {
            if (!B(e10.algorithm, "AES-GCM")) throw J("AES-GCM");
            let r3 = parseInt(t2.slice(1, 4), 10);
            if (e10.algorithm.length !== r3) throw J(r3, "algorithm.length");
            break;
          }
          case "A128KW":
          case "A192KW":
          case "A256KW": {
            if (!B(e10.algorithm, "AES-KW")) throw J("AES-KW");
            let r3 = parseInt(t2.slice(1, 4), 10);
            if (e10.algorithm.length !== r3) throw J(r3, "algorithm.length");
            break;
          }
          case "ECDH":
            switch (e10.algorithm.name) {
              case "ECDH":
              case "X25519":
              case "X448":
                break;
              default:
                throw J("ECDH, X25519, or X448");
            }
            break;
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW":
            if (!B(e10.algorithm, "PBKDF2")) throw J("PBKDF2");
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512": {
            if (!B(e10.algorithm, "RSA-OAEP")) throw J("RSA-OAEP");
            let r3 = parseInt(t2.slice(9), 10) || 1;
            if ($(e10.algorithm.hash) !== r3) throw J(`SHA-${r3}`, "algorithm.hash");
            break;
          }
          default:
            throw TypeError("CryptoKey does not support this operation");
        }
        V(e10, r2);
      }
      function q(e10, t2, ...r2) {
        if (r2.length > 2) {
          let t3 = r2.pop();
          e10 += `one of type ${r2.join(", ")}, or ${t3}.`;
        } else 2 === r2.length ? e10 += `one of type ${r2[0]} or ${r2[1]}.` : e10 += `of type ${r2[0]}.`;
        return null == t2 ? e10 += ` Received ${t2}` : "function" == typeof t2 && t2.name ? e10 += ` Received function ${t2.name}` : "object" == typeof t2 && null != t2 && t2.constructor && t2.constructor.name && (e10 += ` Received an instance of ${t2.constructor.name}`), e10;
      }
      let F = (e10, ...t2) => q("Key must be ", e10, ...t2);
      function z(e10, t2, ...r2) {
        return q(`Key for the ${e10} algorithm must be `, t2, ...r2);
      }
      let X = (e10) => o(e10), Y = ["CryptoKey"];
      async function Z(e10, t2, r2, n2, a2, o2) {
        let s2, c2;
        if (!(t2 instanceof Uint8Array)) throw TypeError(F(t2, "Uint8Array"));
        let l2 = parseInt(e10.slice(1, 4), 10), u2 = await i.subtle.importKey("raw", t2.subarray(l2 >> 3), "AES-CBC", false, ["decrypt"]), h2 = await i.subtle.importKey("raw", t2.subarray(0, l2 >> 3), { hash: `SHA-${l2 << 1}`, name: "HMAC" }, false, ["sign"]), f2 = d(o2, n2, r2, p(o2.length << 3)), g2 = new Uint8Array((await i.subtle.sign("HMAC", h2, f2)).slice(0, l2 >> 3));
        try {
          s2 = j(a2, g2);
        } catch (e11) {
        }
        if (!s2) throw new P();
        try {
          c2 = new Uint8Array(await i.subtle.decrypt({ iv: n2, name: "AES-CBC" }, u2, r2));
        } catch (e11) {
        }
        if (!c2) throw new P();
        return c2;
      }
      async function Q(e10, t2, r2, n2, a2, o2) {
        let s2;
        t2 instanceof Uint8Array ? s2 = await i.subtle.importKey("raw", t2, "AES-GCM", false, ["decrypt"]) : (G(t2, e10, "decrypt"), s2 = t2);
        try {
          return new Uint8Array(await i.subtle.decrypt({ additionalData: o2, iv: n2, name: "AES-GCM", tagLength: 128 }, s2, d(r2, a2)));
        } catch (e11) {
          throw new P();
        }
      }
      let ee = async (e10, t2, r2, n2, a2, i2) => {
        if (!o(t2) && !(t2 instanceof Uint8Array)) throw TypeError(F(t2, ...Y, "Uint8Array"));
        switch (L(e10, n2), e10) {
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return t2 instanceof Uint8Array && K(t2, parseInt(e10.slice(-3), 10)), Z(e10, t2, r2, n2, a2, i2);
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            return t2 instanceof Uint8Array && K(t2, parseInt(e10.slice(1, 4), 10)), Q(e10, t2, r2, n2, a2, i2);
          default:
            throw new A("Unsupported JWE Content Encryption Algorithm");
        }
      }, et = async () => {
        throw new A('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation.');
      }, er = async () => {
        throw new A('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `deflateRaw` encrypt option to provide Deflate Raw implementation.');
      }, en = (...e10) => {
        let t2;
        let r2 = e10.filter(Boolean);
        if (0 === r2.length || 1 === r2.length) return true;
        for (let e11 of r2) {
          let r3 = Object.keys(e11);
          if (!t2 || 0 === t2.size) {
            t2 = new Set(r3);
            continue;
          }
          for (let e12 of r3) {
            if (t2.has(e12)) return false;
            t2.add(e12);
          }
        }
        return true;
      };
      function ea(e10) {
        if (!("object" == typeof e10 && null !== e10) || "[object Object]" !== Object.prototype.toString.call(e10)) return false;
        if (null === Object.getPrototypeOf(e10)) return true;
        let t2 = e10;
        for (; null !== Object.getPrototypeOf(t2); ) t2 = Object.getPrototypeOf(t2);
        return Object.getPrototypeOf(e10) === t2;
      }
      let ei = [{ hash: "SHA-256", name: "HMAC" }, true, ["sign"]];
      function eo(e10, t2) {
        if (e10.algorithm.length !== parseInt(t2.slice(1, 4), 10)) throw TypeError(`Invalid key size for alg: ${t2}`);
      }
      function es(e10, t2, r2) {
        if (o(e10)) return G(e10, t2, r2), e10;
        if (e10 instanceof Uint8Array) return i.subtle.importKey("raw", e10, "AES-KW", true, [r2]);
        throw TypeError(F(e10, ...Y, "Uint8Array"));
      }
      let ec = async (e10, t2, r2) => {
        let n2 = await es(t2, e10, "wrapKey");
        eo(n2, e10);
        let a2 = await i.subtle.importKey("raw", r2, ...ei);
        return new Uint8Array(await i.subtle.wrapKey("raw", a2, n2, "AES-KW"));
      }, el = async (e10, t2, r2) => {
        let n2 = await es(t2, e10, "unwrapKey");
        eo(n2, e10);
        let a2 = await i.subtle.unwrapKey("raw", r2, n2, "AES-KW", ...ei);
        return new Uint8Array(await i.subtle.exportKey("raw", a2));
      };
      async function ed(e10, t2, r2, n2, a2 = new Uint8Array(0), s2 = new Uint8Array(0)) {
        let l2;
        if (!o(e10)) throw TypeError(F(e10, ...Y));
        if (G(e10, "ECDH"), !o(t2)) throw TypeError(F(t2, ...Y));
        G(t2, "ECDH", "deriveBits");
        let u2 = d(f(c.encode(r2)), f(a2), f(s2), h(n2));
        return l2 = "X25519" === e10.algorithm.name ? 256 : "X448" === e10.algorithm.name ? 448 : Math.ceil(parseInt(e10.algorithm.namedCurve.substr(-3), 10) / 8) << 3, g(new Uint8Array(await i.subtle.deriveBits({ name: e10.algorithm.name, public: e10 }, t2, l2)), n2, u2);
      }
      async function eu(e10) {
        if (!o(e10)) throw TypeError(F(e10, ...Y));
        return i.subtle.generateKey(e10.algorithm, true, ["deriveBits"]);
      }
      function ep(e10) {
        if (!o(e10)) throw TypeError(F(e10, ...Y));
        return ["P-256", "P-384", "P-521"].includes(e10.algorithm.namedCurve) || "X25519" === e10.algorithm.name || "X448" === e10.algorithm.name;
      }
      async function eh(e10, t2, r2, n2) {
        !function(e11) {
          if (!(e11 instanceof Uint8Array) || e11.length < 8) throw new x("PBES2 Salt Input must be 8 or more octets");
        }(e10);
        let a2 = d(c.encode(t2), new Uint8Array([0]), e10), s2 = parseInt(t2.slice(13, 16), 10), l2 = { hash: `SHA-${t2.slice(8, 11)}`, iterations: r2, name: "PBKDF2", salt: a2 }, u2 = await function(e11, t3) {
          if (e11 instanceof Uint8Array) return i.subtle.importKey("raw", e11, "PBKDF2", false, ["deriveBits"]);
          if (o(e11)) return G(e11, t3, "deriveBits", "deriveKey"), e11;
          throw TypeError(F(e11, ...Y, "Uint8Array"));
        }(n2, t2);
        if (u2.usages.includes("deriveBits")) return new Uint8Array(await i.subtle.deriveBits(l2, u2, s2));
        if (u2.usages.includes("deriveKey")) return i.subtle.deriveKey(l2, u2, { length: s2, name: "AES-KW" }, false, ["wrapKey", "unwrapKey"]);
        throw TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');
      }
      let ef = async (e10, t2, r2, n2 = 2048, a2 = D(new Uint8Array(16))) => {
        let i2 = await eh(a2, e10, n2, t2);
        return { encryptedKey: await ec(e10.slice(-6), i2, r2), p2c: n2, p2s: w(a2) };
      }, eg = async (e10, t2, r2, n2, a2) => {
        let i2 = await eh(a2, e10, n2, t2);
        return el(e10.slice(-6), i2, r2);
      };
      function ey(e10) {
        switch (e10) {
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            return "RSA-OAEP";
          default:
            throw new A(`alg ${e10} is not supported either by JOSE or your javascript runtime`);
        }
      }
      let ew = (e10, t2) => {
        if (e10.startsWith("RS") || e10.startsWith("PS")) {
          let { modulusLength: r2 } = t2.algorithm;
          if ("number" != typeof r2 || r2 < 2048) throw TypeError(`${e10} requires key modulusLength to be 2048 bits or larger`);
        }
      }, em = async (e10, t2, r2) => {
        if (!o(t2)) throw TypeError(F(t2, ...Y));
        if (G(t2, e10, "encrypt", "wrapKey"), ew(e10, t2), t2.usages.includes("encrypt")) return new Uint8Array(await i.subtle.encrypt(ey(e10), t2, r2));
        if (t2.usages.includes("wrapKey")) {
          let n2 = await i.subtle.importKey("raw", r2, ...ei);
          return new Uint8Array(await i.subtle.wrapKey("raw", n2, t2, ey(e10)));
        }
        throw TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation');
      }, eb = async (e10, t2, r2) => {
        if (!o(t2)) throw TypeError(F(t2, ...Y));
        if (G(t2, e10, "decrypt", "unwrapKey"), ew(e10, t2), t2.usages.includes("decrypt")) return new Uint8Array(await i.subtle.decrypt(ey(e10), t2, r2));
        if (t2.usages.includes("unwrapKey")) {
          let n2 = await i.subtle.unwrapKey("raw", r2, t2, ey(e10), ...ei);
          return new Uint8Array(await i.subtle.exportKey("raw", n2));
        }
        throw TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation');
      };
      function ev(e10) {
        switch (e10) {
          case "A128GCM":
            return 128;
          case "A192GCM":
            return 192;
          case "A256GCM":
          case "A128CBC-HS256":
            return 256;
          case "A192CBC-HS384":
            return 384;
          case "A256CBC-HS512":
            return 512;
          default:
            throw new A(`Unsupported JWE Algorithm: ${e10}`);
        }
      }
      let eS = (e10) => D(new Uint8Array(ev(e10) >> 3)), eE = (e10, t2) => {
        let r2 = (e10.match(/.{1,64}/g) || []).join("\n");
        return `-----BEGIN ${t2}-----
${r2}
-----END ${t2}-----`;
      }, e_ = async (e10, t2, r2) => {
        if (!o(r2)) throw TypeError(F(r2, ...Y));
        if (!r2.extractable) throw TypeError("CryptoKey is not extractable");
        if (r2.type !== e10) throw TypeError(`key is not a ${e10} key`);
        return eE(y(new Uint8Array(await i.subtle.exportKey(t2, r2))), `${e10.toUpperCase()} KEY`);
      }, eA = (e10) => e_("public", "spki", e10), eP = (e10) => e_("private", "pkcs8", e10), eC = (e10, t2, r2 = 0) => {
        0 === r2 && (t2.unshift(t2.length), t2.unshift(6));
        let n2 = e10.indexOf(t2[0], r2);
        if (-1 === n2) return false;
        let a2 = e10.subarray(n2, n2 + t2.length);
        return a2.length === t2.length && (a2.every((e11, r3) => e11 === t2[r3]) || eC(e10, t2, n2 + 1));
      }, ex = (e10) => {
        switch (true) {
          case eC(e10, [42, 134, 72, 206, 61, 3, 1, 7]):
            return "P-256";
          case eC(e10, [43, 129, 4, 0, 34]):
            return "P-384";
          case eC(e10, [43, 129, 4, 0, 35]):
            return "P-521";
          case eC(e10, [43, 101, 110]):
            return "X25519";
          case eC(e10, [43, 101, 111]):
            return "X448";
          case eC(e10, [43, 101, 112]):
            return "Ed25519";
          case eC(e10, [43, 101, 113]):
            return "Ed448";
          default:
            throw new A("Invalid or unsupported EC Key Curve or OKP Key Sub Type");
        }
      }, eR = async (e10, t2, r2, n2, a2) => {
        var o2;
        let s2, c2;
        let l2 = new Uint8Array(atob(r2.replace(e10, "")).split("").map((e11) => e11.charCodeAt(0))), d2 = "spki" === t2;
        switch (n2) {
          case "PS256":
          case "PS384":
          case "PS512":
            s2 = { name: "RSA-PSS", hash: `SHA-${n2.slice(-3)}` }, c2 = d2 ? ["verify"] : ["sign"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            s2 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${n2.slice(-3)}` }, c2 = d2 ? ["verify"] : ["sign"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            s2 = { name: "RSA-OAEP", hash: `SHA-${parseInt(n2.slice(-3), 10) || 1}` }, c2 = d2 ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
            break;
          case "ES256":
            s2 = { name: "ECDSA", namedCurve: "P-256" }, c2 = d2 ? ["verify"] : ["sign"];
            break;
          case "ES384":
            s2 = { name: "ECDSA", namedCurve: "P-384" }, c2 = d2 ? ["verify"] : ["sign"];
            break;
          case "ES512":
            s2 = { name: "ECDSA", namedCurve: "P-521" }, c2 = d2 ? ["verify"] : ["sign"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            let e11 = ex(l2);
            s2 = e11.startsWith("P-") ? { name: "ECDH", namedCurve: e11 } : { name: e11 }, c2 = d2 ? [] : ["deriveBits"];
            break;
          }
          case "EdDSA":
            s2 = { name: ex(l2) }, c2 = d2 ? ["verify"] : ["sign"];
            break;
          default:
            throw new A('Invalid or unsupported "alg" (Algorithm) value');
        }
        return i.subtle.importKey(t2, l2, s2, null !== (o2 = null == a2 ? void 0 : a2.extractable) && void 0 !== o2 && o2, c2);
      }, eT = (e10, t2, r2) => eR(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, "pkcs8", e10, t2, r2), eO = (e10, t2, r2) => eR(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", e10, t2, r2);
      function ek(e10) {
        let t2 = [], r2 = 0;
        for (; r2 < e10.length; ) {
          let n2 = eI(e10.subarray(r2));
          t2.push(n2), r2 += n2.byteLength;
        }
        return t2;
      }
      function eI(e10) {
        let t2 = 0, r2 = 31 & e10[0];
        if (t2++, 31 === r2) {
          for (r2 = 0; e10[t2] >= 128; ) r2 = 128 * r2 + e10[t2] - 128, t2++;
          r2 = 128 * r2 + e10[t2] - 128, t2++;
        }
        let n2 = 0;
        if (e10[t2] < 128) n2 = e10[t2], t2++;
        else if (128 === n2) {
          for (n2 = 0; 0 !== e10[t2 + n2] || 0 !== e10[t2 + n2 + 1]; ) {
            if (n2 > e10.byteLength) throw TypeError("invalid indefinite form length");
            n2++;
          }
          let r3 = t2 + n2 + 2;
          return { byteLength: r3, contents: e10.subarray(t2, t2 + n2), raw: e10.subarray(0, r3) };
        } else {
          let r3 = 127 & e10[t2];
          t2++, n2 = 0;
          for (let a3 = 0; a3 < r3; a3++) n2 = 256 * n2 + e10[t2], t2++;
        }
        let a2 = t2 + n2;
        return { byteLength: a2, contents: e10.subarray(t2, a2), raw: e10.subarray(0, a2) };
      }
      let eN = (e10, t2, r2) => {
        let n2;
        try {
          n2 = eE(function(e11) {
            let t3 = ek(ek(eI(e11).contents)[0].contents);
            return y(t3[160 === t3[0].raw[0] ? 6 : 5].raw);
          }(m(e10.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, ""))), "PUBLIC KEY");
        } catch (e11) {
          throw TypeError("Failed to parse the X.509 certificate", { cause: e11 });
        }
        return eO(n2, t2, r2);
      }, eH = async (e10) => {
        var t2, r2;
        if (!e10.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: n2, keyUsages: a2 } = function(e11) {
          let t3, r3;
          switch (e11.kty) {
            case "oct":
              switch (e11.alg) {
                case "HS256":
                case "HS384":
                case "HS512":
                  t3 = { name: "HMAC", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = ["sign", "verify"];
                  break;
                case "A128CBC-HS256":
                case "A192CBC-HS384":
                case "A256CBC-HS512":
                  throw new A(`${e11.alg} keys cannot be imported as CryptoKey instances`);
                case "A128GCM":
                case "A192GCM":
                case "A256GCM":
                case "A128GCMKW":
                case "A192GCMKW":
                case "A256GCMKW":
                  t3 = { name: "AES-GCM" }, r3 = ["encrypt", "decrypt"];
                  break;
                case "A128KW":
                case "A192KW":
                case "A256KW":
                  t3 = { name: "AES-KW" }, r3 = ["wrapKey", "unwrapKey"];
                  break;
                case "PBES2-HS256+A128KW":
                case "PBES2-HS384+A192KW":
                case "PBES2-HS512+A256KW":
                  t3 = { name: "PBKDF2" }, r3 = ["deriveBits"];
                  break;
                default:
                  throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "RSA":
              switch (e11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  t3 = { name: "RSA-PSS", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  t3 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  t3 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e11.alg.slice(-3), 10) || 1}` }, r3 = e11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "EC":
              switch (e11.alg) {
                case "ES256":
                  t3 = { name: "ECDSA", namedCurve: "P-256" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES384":
                  t3 = { name: "ECDSA", namedCurve: "P-384" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES512":
                  t3 = { name: "ECDSA", namedCurve: "P-521" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t3 = { name: "ECDH", namedCurve: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "OKP":
              switch (e11.alg) {
                case "EdDSA":
                  t3 = { name: e11.crv }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t3 = { name: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            default:
              throw new A('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: t3, keyUsages: r3 };
        }(e10), o2 = [n2, null !== (t2 = e10.ext) && void 0 !== t2 && t2, null !== (r2 = e10.key_ops) && void 0 !== r2 ? r2 : a2];
        if ("PBKDF2" === n2.name) return i.subtle.importKey("raw", b(e10.k), ...o2);
        let s2 = { ...e10 };
        return delete s2.alg, delete s2.use, i.subtle.importKey("jwk", s2, ...o2);
      };
      async function eM(e10, t2, r2) {
        if ("string" != typeof e10 || 0 !== e10.indexOf("-----BEGIN PUBLIC KEY-----")) throw TypeError('"spki" must be SPKI formatted string');
        return eO(e10, t2, r2);
      }
      async function eD(e10, t2, r2) {
        if ("string" != typeof e10 || 0 !== e10.indexOf("-----BEGIN CERTIFICATE-----")) throw TypeError('"x509" must be X.509 formatted string');
        return eN(e10, t2, r2);
      }
      async function eU(e10, t2, r2) {
        if ("string" != typeof e10 || 0 !== e10.indexOf("-----BEGIN PRIVATE KEY-----")) throw TypeError('"pkcs8" must be PKCS#8 formatted string');
        return eT(e10, t2, r2);
      }
      async function eW(e10, t2, r2) {
        var n2;
        if (!ea(e10)) throw TypeError("JWK must be an object");
        switch (t2 || (t2 = e10.alg), e10.kty) {
          case "oct":
            if ("string" != typeof e10.k || !e10.k) throw TypeError('missing "k" (Key Value) Parameter value');
            if (null != r2 || (r2 = true !== e10.ext), r2) return eH({ ...e10, alg: t2, ext: null !== (n2 = e10.ext) && void 0 !== n2 && n2 });
            return b(e10.k);
          case "RSA":
            if (void 0 !== e10.oth) throw new A('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
          case "EC":
          case "OKP":
            return eH({ ...e10, alg: t2 });
          default:
            throw new A('Unsupported "kty" (Key Type) Parameter value');
        }
      }
      let eL = (e10, t2) => {
        if (!(t2 instanceof Uint8Array)) {
          if (!X(t2)) throw TypeError(z(e10, t2, ...Y, "Uint8Array"));
          if ("secret" !== t2.type) throw TypeError(`${Y.join(" or ")} instances for symmetric algorithms must be of type "secret"`);
        }
      }, eK = (e10, t2, r2) => {
        if (!X(t2)) throw TypeError(z(e10, t2, ...Y));
        if ("secret" === t2.type) throw TypeError(`${Y.join(" or ")} instances for asymmetric algorithms must not be of type "secret"`);
        if ("sign" === r2 && "public" === t2.type) throw TypeError(`${Y.join(" or ")} instances for asymmetric algorithm signing must be of type "private"`);
        if ("decrypt" === r2 && "public" === t2.type) throw TypeError(`${Y.join(" or ")} instances for asymmetric algorithm decryption must be of type "private"`);
        if (t2.algorithm && "verify" === r2 && "private" === t2.type) throw TypeError(`${Y.join(" or ")} instances for asymmetric algorithm verifying must be of type "public"`);
        if (t2.algorithm && "encrypt" === r2 && "private" === t2.type) throw TypeError(`${Y.join(" or ")} instances for asymmetric algorithm encryption must be of type "public"`);
      }, ej = (e10, t2, r2) => {
        e10.startsWith("HS") || "dir" === e10 || e10.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(e10) ? eL(e10, t2) : eK(e10, t2, r2);
      };
      async function eJ(e10, t2, r2, n2, a2) {
        if (!(r2 instanceof Uint8Array)) throw TypeError(F(r2, "Uint8Array"));
        let o2 = parseInt(e10.slice(1, 4), 10), s2 = await i.subtle.importKey("raw", r2.subarray(o2 >> 3), "AES-CBC", false, ["encrypt"]), c2 = await i.subtle.importKey("raw", r2.subarray(0, o2 >> 3), { hash: `SHA-${o2 << 1}`, name: "HMAC" }, false, ["sign"]), l2 = new Uint8Array(await i.subtle.encrypt({ iv: n2, name: "AES-CBC" }, s2, t2)), u2 = d(a2, n2, l2, p(a2.length << 3));
        return { ciphertext: l2, tag: new Uint8Array((await i.subtle.sign("HMAC", c2, u2)).slice(0, o2 >> 3)) };
      }
      async function eB(e10, t2, r2, n2, a2) {
        let o2;
        r2 instanceof Uint8Array ? o2 = await i.subtle.importKey("raw", r2, "AES-GCM", false, ["encrypt"]) : (G(r2, e10, "encrypt"), o2 = r2);
        let s2 = new Uint8Array(await i.subtle.encrypt({ additionalData: a2, iv: n2, name: "AES-GCM", tagLength: 128 }, o2, t2)), c2 = s2.slice(-16);
        return { ciphertext: s2.slice(0, -16), tag: c2 };
      }
      let e$ = async (e10, t2, r2, n2, a2) => {
        if (!o(r2) && !(r2 instanceof Uint8Array)) throw TypeError(F(r2, ...Y, "Uint8Array"));
        switch (L(e10, n2), e10) {
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return r2 instanceof Uint8Array && K(r2, parseInt(e10.slice(-3), 10)), eJ(e10, t2, r2, n2, a2);
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            return r2 instanceof Uint8Array && K(r2, parseInt(e10.slice(1, 4), 10)), eB(e10, t2, r2, n2, a2);
          default:
            throw new A("Unsupported JWE Content Encryption Algorithm");
        }
      };
      async function eV(e10, t2, r2, n2) {
        let a2 = e10.slice(0, 7);
        n2 || (n2 = W(a2));
        let { ciphertext: i2, tag: o2 } = await e$(a2, r2, t2, n2, new Uint8Array(0));
        return { encryptedKey: i2, iv: w(n2), tag: w(o2) };
      }
      async function eG(e10, t2, r2, n2, a2) {
        return ee(e10.slice(0, 7), t2, r2, n2, a2, new Uint8Array(0));
      }
      async function eq(e10, t2, r2, n2, a2) {
        switch (ej(e10, t2, "decrypt"), e10) {
          case "dir":
            if (void 0 !== r2) throw new x("Encountered unexpected JWE Encrypted Key");
            return t2;
          case "ECDH-ES":
            if (void 0 !== r2) throw new x("Encountered unexpected JWE Encrypted Key");
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            let a3, i2;
            if (!ea(n2.epk)) throw new x('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
            if (!ep(t2)) throw new A("ECDH with the provided key is not allowed or not supported by your javascript runtime");
            let o2 = await eW(n2.epk, e10);
            if (void 0 !== n2.apu) {
              if ("string" != typeof n2.apu) throw new x('JOSE Header "apu" (Agreement PartyUInfo) invalid');
              try {
                a3 = b(n2.apu);
              } catch (e11) {
                throw new x("Failed to base64url decode the apu");
              }
            }
            if (void 0 !== n2.apv) {
              if ("string" != typeof n2.apv) throw new x('JOSE Header "apv" (Agreement PartyVInfo) invalid');
              try {
                i2 = b(n2.apv);
              } catch (e11) {
                throw new x("Failed to base64url decode the apv");
              }
            }
            let s2 = await ed(o2, t2, "ECDH-ES" === e10 ? n2.enc : e10, "ECDH-ES" === e10 ? ev(n2.enc) : parseInt(e10.slice(-5, -2), 10), a3, i2);
            if ("ECDH-ES" === e10) return s2;
            if (void 0 === r2) throw new x("JWE Encrypted Key missing");
            return el(e10.slice(-6), s2, r2);
          }
          case "RSA1_5":
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            if (void 0 === r2) throw new x("JWE Encrypted Key missing");
            return eb(e10, t2, r2);
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW": {
            let i2;
            if (void 0 === r2) throw new x("JWE Encrypted Key missing");
            if ("number" != typeof n2.p2c) throw new x('JOSE Header "p2c" (PBES2 Count) missing or invalid');
            let o2 = (null == a2 ? void 0 : a2.maxPBES2Count) || 1e4;
            if (n2.p2c > o2) throw new x('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
            if ("string" != typeof n2.p2s) throw new x('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
            try {
              i2 = b(n2.p2s);
            } catch (e11) {
              throw new x("Failed to base64url decode the p2s");
            }
            return eg(e10, t2, r2, n2.p2c, i2);
          }
          case "A128KW":
          case "A192KW":
          case "A256KW":
            if (void 0 === r2) throw new x("JWE Encrypted Key missing");
            return el(e10, t2, r2);
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW": {
            let a3, i2;
            if (void 0 === r2) throw new x("JWE Encrypted Key missing");
            if ("string" != typeof n2.iv) throw new x('JOSE Header "iv" (Initialization Vector) missing or invalid');
            if ("string" != typeof n2.tag) throw new x('JOSE Header "tag" (Authentication Tag) missing or invalid');
            try {
              a3 = b(n2.iv);
            } catch (e11) {
              throw new x("Failed to base64url decode the iv");
            }
            try {
              i2 = b(n2.tag);
            } catch (e11) {
              throw new x("Failed to base64url decode the tag");
            }
            return eG(e10, t2, r2, a3, i2);
          }
          default:
            throw new A('Invalid or unsupported "alg" (JWE Algorithm) header value');
        }
      }
      let eF = function(e10, t2, r2, n2, a2) {
        let i2;
        if (void 0 !== a2.crit && void 0 === n2.crit) throw new e10('"crit" (Critical) Header Parameter MUST be integrity protected');
        if (!n2 || void 0 === n2.crit) return /* @__PURE__ */ new Set();
        if (!Array.isArray(n2.crit) || 0 === n2.crit.length || n2.crit.some((e11) => "string" != typeof e11 || 0 === e11.length)) throw new e10('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
        for (let o2 of (i2 = void 0 !== r2 ? new Map([...Object.entries(r2), ...t2.entries()]) : t2, n2.crit)) {
          if (!i2.has(o2)) throw new A(`Extension Header Parameter "${o2}" is not recognized`);
          if (void 0 === a2[o2]) throw new e10(`Extension Header Parameter "${o2}" is missing`);
          if (i2.get(o2) && void 0 === n2[o2]) throw new e10(`Extension Header Parameter "${o2}" MUST be integrity protected`);
        }
        return new Set(n2.crit);
      }, ez = (e10, t2) => {
        if (void 0 !== t2 && (!Array.isArray(t2) || t2.some((e11) => "string" != typeof e11))) throw TypeError(`"${e10}" option must be an array of strings`);
        if (t2) return new Set(t2);
      };
      async function eX(e10, t2, r2) {
        var n2;
        let a2, i2, o2, s2, u2, p2, h2;
        if (!ea(e10)) throw new x("Flattened JWE must be an object");
        if (void 0 === e10.protected && void 0 === e10.header && void 0 === e10.unprotected) throw new x("JOSE Header missing");
        if ("string" != typeof e10.iv) throw new x("JWE Initialization Vector missing or incorrect type");
        if ("string" != typeof e10.ciphertext) throw new x("JWE Ciphertext missing or incorrect type");
        if ("string" != typeof e10.tag) throw new x("JWE Authentication Tag missing or incorrect type");
        if (void 0 !== e10.protected && "string" != typeof e10.protected) throw new x("JWE Protected Header incorrect type");
        if (void 0 !== e10.encrypted_key && "string" != typeof e10.encrypted_key) throw new x("JWE Encrypted Key incorrect type");
        if (void 0 !== e10.aad && "string" != typeof e10.aad) throw new x("JWE AAD incorrect type");
        if (void 0 !== e10.header && !ea(e10.header)) throw new x("JWE Shared Unprotected Header incorrect type");
        if (void 0 !== e10.unprotected && !ea(e10.unprotected)) throw new x("JWE Per-Recipient Unprotected Header incorrect type");
        if (e10.protected) try {
          let t3 = b(e10.protected);
          a2 = JSON.parse(l.decode(t3));
        } catch (e11) {
          throw new x("JWE Protected Header is invalid");
        }
        if (!en(a2, e10.header, e10.unprotected)) throw new x("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
        let f2 = { ...a2, ...e10.header, ...e10.unprotected };
        if (eF(x, /* @__PURE__ */ new Map(), null == r2 ? void 0 : r2.crit, a2, f2), void 0 !== f2.zip) {
          if (!a2 || !a2.zip) throw new x('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
          if ("DEF" !== f2.zip) throw new A('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
        }
        let { alg: g2, enc: y2 } = f2;
        if ("string" != typeof g2 || !g2) throw new x("missing JWE Algorithm (alg) in JWE Header");
        if ("string" != typeof y2 || !y2) throw new x("missing JWE Encryption Algorithm (enc) in JWE Header");
        let w2 = r2 && ez("keyManagementAlgorithms", r2.keyManagementAlgorithms), m2 = r2 && ez("contentEncryptionAlgorithms", r2.contentEncryptionAlgorithms);
        if (w2 && !w2.has(g2)) throw new _('"alg" (Algorithm) Header Parameter not allowed');
        if (m2 && !m2.has(y2)) throw new _('"enc" (Encryption Algorithm) Header Parameter not allowed');
        if (void 0 !== e10.encrypted_key) try {
          i2 = b(e10.encrypted_key);
        } catch (e11) {
          throw new x("Failed to base64url decode the encrypted_key");
        }
        let v2 = false;
        "function" == typeof t2 && (t2 = await t2(a2, e10), v2 = true);
        try {
          o2 = await eq(g2, t2, i2, f2, r2);
        } catch (e11) {
          if (e11 instanceof TypeError || e11 instanceof x || e11 instanceof A) throw e11;
          o2 = eS(y2);
        }
        try {
          s2 = b(e10.iv);
        } catch (e11) {
          throw new x("Failed to base64url decode the iv");
        }
        try {
          u2 = b(e10.tag);
        } catch (e11) {
          throw new x("Failed to base64url decode the tag");
        }
        let S2 = c.encode(null !== (n2 = e10.protected) && void 0 !== n2 ? n2 : "");
        p2 = void 0 !== e10.aad ? d(S2, c.encode("."), c.encode(e10.aad)) : S2;
        try {
          h2 = b(e10.ciphertext);
        } catch (e11) {
          throw new x("Failed to base64url decode the ciphertext");
        }
        let E2 = await ee(y2, o2, h2, s2, u2, p2);
        "DEF" === f2.zip && (E2 = await ((null == r2 ? void 0 : r2.inflateRaw) || et)(E2));
        let P2 = { plaintext: E2 };
        if (void 0 !== e10.protected && (P2.protectedHeader = a2), void 0 !== e10.aad) try {
          P2.additionalAuthenticatedData = b(e10.aad);
        } catch (e11) {
          throw new x("Failed to base64url decode the aad");
        }
        return (void 0 !== e10.unprotected && (P2.sharedUnprotectedHeader = e10.unprotected), void 0 !== e10.header && (P2.unprotectedHeader = e10.header), v2) ? { ...P2, key: t2 } : P2;
      }
      async function eY(e10, t2, r2) {
        if (e10 instanceof Uint8Array && (e10 = l.decode(e10)), "string" != typeof e10) throw new x("Compact JWE must be a string or Uint8Array");
        let { 0: n2, 1: a2, 2: i2, 3: o2, 4: s2, length: c2 } = e10.split(".");
        if (5 !== c2) throw new x("Invalid Compact JWE");
        let d2 = await eX({ ciphertext: o2, iv: i2 || void 0, protected: n2 || void 0, tag: s2 || void 0, encrypted_key: a2 || void 0 }, t2, r2), u2 = { plaintext: d2.plaintext, protectedHeader: d2.protectedHeader };
        return "function" == typeof t2 ? { ...u2, key: d2.key } : u2;
      }
      async function eZ(e10, t2, r2) {
        if (!ea(e10)) throw new x("General JWE must be an object");
        if (!Array.isArray(e10.recipients) || !e10.recipients.every(ea)) throw new x("JWE Recipients missing or incorrect type");
        if (!e10.recipients.length) throw new x("JWE Recipients has no members");
        for (let n2 of e10.recipients) try {
          return await eX({ aad: e10.aad, ciphertext: e10.ciphertext, encrypted_key: n2.encrypted_key, header: n2.header, iv: e10.iv, protected: e10.protected, tag: e10.tag, unprotected: e10.unprotected }, t2, r2);
        } catch (e11) {
        }
        throw new P();
      }
      let eQ = async (e10) => {
        if (e10 instanceof Uint8Array) return { kty: "oct", k: w(e10) };
        if (!o(e10)) throw TypeError(F(e10, ...Y, "Uint8Array"));
        if (!e10.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
        let { ext: t2, key_ops: r2, alg: n2, use: a2, ...s2 } = await i.subtle.exportKey("jwk", e10);
        return s2;
      };
      async function e0(e10) {
        return eA(e10);
      }
      async function e1(e10) {
        return eP(e10);
      }
      async function e2(e10) {
        return eQ(e10);
      }
      async function e5(e10, t2, r2, n2, a2 = {}) {
        let i2, o2, s2;
        switch (ej(e10, r2, "encrypt"), e10) {
          case "dir":
            s2 = r2;
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            if (!ep(r2)) throw new A("ECDH with the provided key is not allowed or not supported by your javascript runtime");
            let { apu: c2, apv: l2 } = a2, { epk: d2 } = a2;
            d2 || (d2 = (await eu(r2)).privateKey);
            let { x: u2, y: p2, crv: h2, kty: f2 } = await e2(d2), g2 = await ed(r2, d2, "ECDH-ES" === e10 ? t2 : e10, "ECDH-ES" === e10 ? ev(t2) : parseInt(e10.slice(-5, -2), 10), c2, l2);
            if (o2 = { epk: { x: u2, crv: h2, kty: f2 } }, "EC" === f2 && (o2.epk.y = p2), c2 && (o2.apu = w(c2)), l2 && (o2.apv = w(l2)), "ECDH-ES" === e10) {
              s2 = g2;
              break;
            }
            s2 = n2 || eS(t2);
            let y2 = e10.slice(-6);
            i2 = await ec(y2, g2, s2);
            break;
          }
          case "RSA1_5":
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            s2 = n2 || eS(t2), i2 = await em(e10, r2, s2);
            break;
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW": {
            s2 = n2 || eS(t2);
            let { p2c: c2, p2s: l2 } = a2;
            ({ encryptedKey: i2, ...o2 } = await ef(e10, r2, s2, c2, l2));
            break;
          }
          case "A128KW":
          case "A192KW":
          case "A256KW":
            s2 = n2 || eS(t2), i2 = await ec(e10, r2, s2);
            break;
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW": {
            s2 = n2 || eS(t2);
            let { iv: c2 } = a2;
            ({ encryptedKey: i2, ...o2 } = await eV(e10, r2, s2, c2));
            break;
          }
          default:
            throw new A('Invalid or unsupported "alg" (JWE Algorithm) header value');
        }
        return { cek: s2, encryptedKey: i2, parameters: o2 };
      }
      let e4 = Symbol();
      class e3 {
        constructor(e10) {
          if (!(e10 instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
          this._plaintext = e10;
        }
        setKeyManagementParameters(e10) {
          if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
          return this._keyManagementParameters = e10, this;
        }
        setProtectedHeader(e10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = e10, this;
        }
        setSharedUnprotectedHeader(e10) {
          if (this._sharedUnprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
          return this._sharedUnprotectedHeader = e10, this;
        }
        setUnprotectedHeader(e10) {
          if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this._unprotectedHeader = e10, this;
        }
        setAdditionalAuthenticatedData(e10) {
          return this._aad = e10, this;
        }
        setContentEncryptionKey(e10) {
          if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
          return this._cek = e10, this;
        }
        setInitializationVector(e10) {
          if (this._iv) throw TypeError("setInitializationVector can only be called once");
          return this._iv = e10, this;
        }
        async encrypt(e10, t2) {
          let r2, n2, a2, i2, o2, s2, u2;
          if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) throw new x("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
          if (!en(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) throw new x("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
          let p2 = { ...this._protectedHeader, ...this._unprotectedHeader, ...this._sharedUnprotectedHeader };
          if (eF(x, /* @__PURE__ */ new Map(), null == t2 ? void 0 : t2.crit, this._protectedHeader, p2), void 0 !== p2.zip) {
            if (!this._protectedHeader || !this._protectedHeader.zip) throw new x('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
            if ("DEF" !== p2.zip) throw new A('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
          }
          let { alg: h2, enc: f2 } = p2;
          if ("string" != typeof h2 || !h2) throw new x('JWE "alg" (Algorithm) Header Parameter missing or invalid');
          if ("string" != typeof f2 || !f2) throw new x('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
          if ("dir" === h2) {
            if (this._cek) throw TypeError("setContentEncryptionKey cannot be called when using Direct Encryption");
          } else if ("ECDH-ES" === h2 && this._cek) throw TypeError("setContentEncryptionKey cannot be called when using Direct Key Agreement");
          {
            let a3;
            ({ cek: n2, encryptedKey: r2, parameters: a3 } = await e5(h2, f2, e10, this._cek, this._keyManagementParameters)), a3 && (t2 && e4 in t2 ? this._unprotectedHeader ? this._unprotectedHeader = { ...this._unprotectedHeader, ...a3 } : this.setUnprotectedHeader(a3) : this._protectedHeader ? this._protectedHeader = { ...this._protectedHeader, ...a3 } : this.setProtectedHeader(a3));
          }
          if (this._iv || (this._iv = W(f2)), i2 = this._protectedHeader ? c.encode(w(JSON.stringify(this._protectedHeader))) : c.encode(""), this._aad ? (o2 = w(this._aad), a2 = d(i2, c.encode("."), c.encode(o2))) : a2 = i2, "DEF" === p2.zip) {
            let e11 = await ((null == t2 ? void 0 : t2.deflateRaw) || er)(this._plaintext);
            ({ ciphertext: s2, tag: u2 } = await e$(f2, e11, n2, this._iv, a2));
          } else ({ ciphertext: s2, tag: u2 } = await e$(f2, this._plaintext, n2, this._iv, a2));
          let g2 = { ciphertext: w(s2), iv: w(this._iv), tag: w(u2) };
          return r2 && (g2.encrypted_key = w(r2)), o2 && (g2.aad = o2), this._protectedHeader && (g2.protected = l.decode(i2)), this._sharedUnprotectedHeader && (g2.unprotected = this._sharedUnprotectedHeader), this._unprotectedHeader && (g2.header = this._unprotectedHeader), g2;
        }
      }
      class e6 {
        constructor(e10, t2, r2) {
          this.parent = e10, this.key = t2, this.options = r2;
        }
        setUnprotectedHeader(e10) {
          if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this.unprotectedHeader = e10, this;
        }
        addRecipient(...e10) {
          return this.parent.addRecipient(...e10);
        }
        encrypt(...e10) {
          return this.parent.encrypt(...e10);
        }
        done() {
          return this.parent;
        }
      }
      class e8 {
        constructor(e10) {
          this._recipients = [], this._plaintext = e10;
        }
        addRecipient(e10, t2) {
          let r2 = new e6(this, e10, { crit: null == t2 ? void 0 : t2.crit });
          return this._recipients.push(r2), r2;
        }
        setProtectedHeader(e10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = e10, this;
        }
        setSharedUnprotectedHeader(e10) {
          if (this._unprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
          return this._unprotectedHeader = e10, this;
        }
        setAdditionalAuthenticatedData(e10) {
          return this._aad = e10, this;
        }
        async encrypt(e10) {
          var t2, r2, n2;
          let a2;
          if (!this._recipients.length) throw new x("at least one recipient must be added");
          if (e10 = { deflateRaw: null == e10 ? void 0 : e10.deflateRaw }, 1 === this._recipients.length) {
            let [t3] = this._recipients, r3 = await new e3(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(t3.unprotectedHeader).encrypt(t3.key, { ...t3.options, ...e10 }), n3 = { ciphertext: r3.ciphertext, iv: r3.iv, recipients: [{}], tag: r3.tag };
            return r3.aad && (n3.aad = r3.aad), r3.protected && (n3.protected = r3.protected), r3.unprotected && (n3.unprotected = r3.unprotected), r3.encrypted_key && (n3.recipients[0].encrypted_key = r3.encrypted_key), r3.header && (n3.recipients[0].header = r3.header), n3;
          }
          for (let e11 = 0; e11 < this._recipients.length; e11++) {
            let t3 = this._recipients[e11];
            if (!en(this._protectedHeader, this._unprotectedHeader, t3.unprotectedHeader)) throw new x("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
            let r3 = { ...this._protectedHeader, ...this._unprotectedHeader, ...t3.unprotectedHeader }, { alg: n3 } = r3;
            if ("string" != typeof n3 || !n3) throw new x('JWE "alg" (Algorithm) Header Parameter missing or invalid');
            if ("dir" === n3 || "ECDH-ES" === n3) throw new x('"dir" and "ECDH-ES" alg may only be used with a single recipient');
            if ("string" != typeof r3.enc || !r3.enc) throw new x('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
            if (a2) {
              if (a2 !== r3.enc) throw new x('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            } else a2 = r3.enc;
            if (eF(x, /* @__PURE__ */ new Map(), t3.options.crit, this._protectedHeader, r3), void 0 !== r3.zip && (!this._protectedHeader || !this._protectedHeader.zip)) throw new x('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
          }
          let i2 = eS(a2), o2 = { ciphertext: "", iv: "", recipients: [], tag: "" };
          for (let s2 = 0; s2 < this._recipients.length; s2++) {
            let c2 = this._recipients[s2], l2 = {};
            o2.recipients.push(l2);
            let d2 = { ...this._protectedHeader, ...this._unprotectedHeader, ...c2.unprotectedHeader }.alg.startsWith("PBES2") ? 2048 + s2 : void 0;
            if (0 === s2) {
              let t3 = await new e3(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(i2).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(c2.unprotectedHeader).setKeyManagementParameters({ p2c: d2 }).encrypt(c2.key, { ...c2.options, ...e10, [e4]: true });
              o2.ciphertext = t3.ciphertext, o2.iv = t3.iv, o2.tag = t3.tag, t3.aad && (o2.aad = t3.aad), t3.protected && (o2.protected = t3.protected), t3.unprotected && (o2.unprotected = t3.unprotected), l2.encrypted_key = t3.encrypted_key, t3.header && (l2.header = t3.header);
              continue;
            }
            let { encryptedKey: u2, parameters: p2 } = await e5((null === (t2 = c2.unprotectedHeader) || void 0 === t2 ? void 0 : t2.alg) || (null === (r2 = this._protectedHeader) || void 0 === r2 ? void 0 : r2.alg) || (null === (n2 = this._unprotectedHeader) || void 0 === n2 ? void 0 : n2.alg), a2, c2.key, i2, { p2c: d2 });
            l2.encrypted_key = w(u2), (c2.unprotectedHeader || p2) && (l2.header = { ...c2.unprotectedHeader, ...p2 });
          }
          return o2;
        }
      }
      function e9(e10, t2) {
        let r2 = `SHA-${e10.slice(-3)}`;
        switch (e10) {
          case "HS256":
          case "HS384":
          case "HS512":
            return { hash: r2, name: "HMAC" };
          case "PS256":
          case "PS384":
          case "PS512":
            return { hash: r2, name: "RSA-PSS", saltLength: e10.slice(-3) >> 3 };
          case "RS256":
          case "RS384":
          case "RS512":
            return { hash: r2, name: "RSASSA-PKCS1-v1_5" };
          case "ES256":
          case "ES384":
          case "ES512":
            return { hash: r2, name: "ECDSA", namedCurve: t2.namedCurve };
          case "EdDSA":
            return { name: t2.name };
          default:
            throw new A(`alg ${e10} is not supported either by JOSE or your javascript runtime`);
        }
      }
      function e7(e10, t2, r2) {
        if (o(t2)) return !function(e11, t3, ...r3) {
          switch (t3) {
            case "HS256":
            case "HS384":
            case "HS512": {
              if (!B(e11.algorithm, "HMAC")) throw J("HMAC");
              let r4 = parseInt(t3.slice(2), 10);
              if ($(e11.algorithm.hash) !== r4) throw J(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "RS256":
            case "RS384":
            case "RS512": {
              if (!B(e11.algorithm, "RSASSA-PKCS1-v1_5")) throw J("RSASSA-PKCS1-v1_5");
              let r4 = parseInt(t3.slice(2), 10);
              if ($(e11.algorithm.hash) !== r4) throw J(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "PS256":
            case "PS384":
            case "PS512": {
              if (!B(e11.algorithm, "RSA-PSS")) throw J("RSA-PSS");
              let r4 = parseInt(t3.slice(2), 10);
              if ($(e11.algorithm.hash) !== r4) throw J(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "EdDSA":
              if ("Ed25519" !== e11.algorithm.name && "Ed448" !== e11.algorithm.name) throw J("Ed25519 or Ed448");
              break;
            case "ES256":
            case "ES384":
            case "ES512": {
              if (!B(e11.algorithm, "ECDSA")) throw J("ECDSA");
              let r4 = function(e12) {
                switch (e12) {
                  case "ES256":
                    return "P-256";
                  case "ES384":
                    return "P-384";
                  case "ES512":
                    return "P-521";
                  default:
                    throw Error("unreachable");
                }
              }(t3);
              if (e11.algorithm.namedCurve !== r4) throw J(r4, "algorithm.namedCurve");
              break;
            }
            default:
              throw TypeError("CryptoKey does not support this operation");
          }
          V(e11, r3);
        }(t2, e10, r2), t2;
        if (t2 instanceof Uint8Array) {
          if (!e10.startsWith("HS")) throw TypeError(F(t2, ...Y));
          return i.subtle.importKey("raw", t2, { hash: `SHA-${e10.slice(-3)}`, name: "HMAC" }, false, [r2]);
        }
        throw TypeError(F(t2, ...Y, "Uint8Array"));
      }
      let te = async (e10, t2, r2, n2) => {
        let a2 = await e7(e10, t2, "verify");
        ew(e10, a2);
        let o2 = e9(e10, a2.algorithm);
        try {
          return await i.subtle.verify(o2, a2, r2, n2);
        } catch (e11) {
          return false;
        }
      };
      async function tt(e10, t2, r2) {
        var n2;
        let a2, i2;
        if (!ea(e10)) throw new R("Flattened JWS must be an object");
        if (void 0 === e10.protected && void 0 === e10.header) throw new R('Flattened JWS must have either of the "protected" or "header" members');
        if (void 0 !== e10.protected && "string" != typeof e10.protected) throw new R("JWS Protected Header incorrect type");
        if (void 0 === e10.payload) throw new R("JWS Payload missing");
        if ("string" != typeof e10.signature) throw new R("JWS Signature missing or incorrect type");
        if (void 0 !== e10.header && !ea(e10.header)) throw new R("JWS Unprotected Header incorrect type");
        let o2 = {};
        if (e10.protected) try {
          let t3 = b(e10.protected);
          o2 = JSON.parse(l.decode(t3));
        } catch (e11) {
          throw new R("JWS Protected Header is invalid");
        }
        if (!en(o2, e10.header)) throw new R("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        let s2 = { ...o2, ...e10.header }, u2 = eF(R, /* @__PURE__ */ new Map([["b64", true]]), null == r2 ? void 0 : r2.crit, o2, s2), p2 = true;
        if (u2.has("b64") && "boolean" != typeof (p2 = o2.b64)) throw new R('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        let { alg: h2 } = s2;
        if ("string" != typeof h2 || !h2) throw new R('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        let f2 = r2 && ez("algorithms", r2.algorithms);
        if (f2 && !f2.has(h2)) throw new _('"alg" (Algorithm) Header Parameter not allowed');
        if (p2) {
          if ("string" != typeof e10.payload) throw new R("JWS Payload must be a string");
        } else if ("string" != typeof e10.payload && !(e10.payload instanceof Uint8Array)) throw new R("JWS Payload must be a string or an Uint8Array instance");
        let g2 = false;
        "function" == typeof t2 && (t2 = await t2(o2, e10), g2 = true), ej(h2, t2, "verify");
        let y2 = d(c.encode(null !== (n2 = e10.protected) && void 0 !== n2 ? n2 : ""), c.encode("."), "string" == typeof e10.payload ? c.encode(e10.payload) : e10.payload);
        try {
          a2 = b(e10.signature);
        } catch (e11) {
          throw new R("Failed to base64url decode the signature");
        }
        if (!await te(h2, t2, a2, y2)) throw new M();
        if (p2) try {
          i2 = b(e10.payload);
        } catch (e11) {
          throw new R("Failed to base64url decode the payload");
        }
        else i2 = "string" == typeof e10.payload ? c.encode(e10.payload) : e10.payload;
        let w2 = { payload: i2 };
        return (void 0 !== e10.protected && (w2.protectedHeader = o2), void 0 !== e10.header && (w2.unprotectedHeader = e10.header), g2) ? { ...w2, key: t2 } : w2;
      }
      async function tr(e10, t2, r2) {
        if (e10 instanceof Uint8Array && (e10 = l.decode(e10)), "string" != typeof e10) throw new R("Compact JWS must be a string or Uint8Array");
        let { 0: n2, 1: a2, 2: i2, length: o2 } = e10.split(".");
        if (3 !== o2) throw new R("Invalid Compact JWS");
        let s2 = await tt({ payload: a2, protected: n2, signature: i2 }, t2, r2), c2 = { payload: s2.payload, protectedHeader: s2.protectedHeader };
        return "function" == typeof t2 ? { ...c2, key: s2.key } : c2;
      }
      async function tn(e10, t2, r2) {
        if (!ea(e10)) throw new R("General JWS must be an object");
        if (!Array.isArray(e10.signatures) || !e10.signatures.every(ea)) throw new R("JWS Signatures missing or incorrect type");
        for (let n2 of e10.signatures) try {
          return await tt({ header: n2.header, payload: e10.payload, protected: n2.protected, signature: n2.signature }, t2, r2);
        } catch (e11) {
        }
        throw new M();
      }
      let ta = (e10) => Math.floor(e10.getTime() / 1e3), ti = /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i, to = (e10) => {
        let t2 = ti.exec(e10);
        if (!t2) throw TypeError("Invalid time period format");
        let r2 = parseFloat(t2[1]);
        switch (t2[2].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            return Math.round(r2);
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            return Math.round(60 * r2);
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            return Math.round(3600 * r2);
          case "day":
          case "days":
          case "d":
            return Math.round(86400 * r2);
          case "week":
          case "weeks":
          case "w":
            return Math.round(604800 * r2);
          default:
            return Math.round(31557600 * r2);
        }
      }, ts = (e10) => e10.toLowerCase().replace(/^application\//, ""), tc = (e10, t2) => "string" == typeof e10 ? t2.includes(e10) : !!Array.isArray(e10) && t2.some(Set.prototype.has.bind(new Set(e10))), tl = (e10, t2, r2 = {}) => {
        let n2, a2;
        let { typ: i2 } = r2;
        if (i2 && ("string" != typeof e10.typ || ts(e10.typ) !== ts(i2))) throw new S('unexpected "typ" JWT header value', "typ", "check_failed");
        try {
          n2 = JSON.parse(l.decode(t2));
        } catch (e11) {
        }
        if (!ea(n2)) throw new T("JWT Claims Set must be a top-level JSON object");
        let { requiredClaims: o2 = [], issuer: s2, subject: c2, audience: d2, maxTokenAge: u2 } = r2;
        for (let e11 of (void 0 !== u2 && o2.push("iat"), void 0 !== d2 && o2.push("aud"), void 0 !== c2 && o2.push("sub"), void 0 !== s2 && o2.push("iss"), new Set(o2.reverse()))) if (!(e11 in n2)) throw new S(`missing required "${e11}" claim`, e11, "missing");
        if (s2 && !(Array.isArray(s2) ? s2 : [s2]).includes(n2.iss)) throw new S('unexpected "iss" claim value', "iss", "check_failed");
        if (c2 && n2.sub !== c2) throw new S('unexpected "sub" claim value', "sub", "check_failed");
        if (d2 && !tc(n2.aud, "string" == typeof d2 ? [d2] : d2)) throw new S('unexpected "aud" claim value', "aud", "check_failed");
        switch (typeof r2.clockTolerance) {
          case "string":
            a2 = to(r2.clockTolerance);
            break;
          case "number":
            a2 = r2.clockTolerance;
            break;
          case "undefined":
            a2 = 0;
            break;
          default:
            throw TypeError("Invalid clockTolerance option type");
        }
        let { currentDate: p2 } = r2, h2 = ta(p2 || /* @__PURE__ */ new Date());
        if ((void 0 !== n2.iat || u2) && "number" != typeof n2.iat) throw new S('"iat" claim must be a number', "iat", "invalid");
        if (void 0 !== n2.nbf) {
          if ("number" != typeof n2.nbf) throw new S('"nbf" claim must be a number', "nbf", "invalid");
          if (n2.nbf > h2 + a2) throw new S('"nbf" claim timestamp check failed', "nbf", "check_failed");
        }
        if (void 0 !== n2.exp) {
          if ("number" != typeof n2.exp) throw new S('"exp" claim must be a number', "exp", "invalid");
          if (n2.exp <= h2 - a2) throw new E('"exp" claim timestamp check failed', "exp", "check_failed");
        }
        if (u2) {
          let e11 = h2 - n2.iat;
          if (e11 - a2 > ("number" == typeof u2 ? u2 : to(u2))) throw new E('"iat" claim timestamp check failed (too far in the past)', "iat", "check_failed");
          if (e11 < 0 - a2) throw new S('"iat" claim timestamp check failed (it should be in the past)', "iat", "check_failed");
        }
        return n2;
      };
      async function td(e10, t2, r2) {
        var n2;
        let a2 = await tr(e10, t2, r2);
        if ((null === (n2 = a2.protectedHeader.crit) || void 0 === n2 ? void 0 : n2.includes("b64")) && false === a2.protectedHeader.b64) throw new T("JWTs MUST NOT use unencoded payload");
        let i2 = { payload: tl(a2.protectedHeader, a2.payload, r2), protectedHeader: a2.protectedHeader };
        return "function" == typeof t2 ? { ...i2, key: a2.key } : i2;
      }
      async function tu(e10, t2, r2) {
        let n2 = await eY(e10, t2, r2), a2 = tl(n2.protectedHeader, n2.plaintext, r2), { protectedHeader: i2 } = n2;
        if (void 0 !== i2.iss && i2.iss !== a2.iss) throw new S('replicated "iss" claim header parameter mismatch', "iss", "mismatch");
        if (void 0 !== i2.sub && i2.sub !== a2.sub) throw new S('replicated "sub" claim header parameter mismatch', "sub", "mismatch");
        if (void 0 !== i2.aud && JSON.stringify(i2.aud) !== JSON.stringify(a2.aud)) throw new S('replicated "aud" claim header parameter mismatch', "aud", "mismatch");
        let o2 = { payload: a2, protectedHeader: i2 };
        return "function" == typeof t2 ? { ...o2, key: n2.key } : o2;
      }
      class tp {
        constructor(e10) {
          this._flattened = new e3(e10);
        }
        setContentEncryptionKey(e10) {
          return this._flattened.setContentEncryptionKey(e10), this;
        }
        setInitializationVector(e10) {
          return this._flattened.setInitializationVector(e10), this;
        }
        setProtectedHeader(e10) {
          return this._flattened.setProtectedHeader(e10), this;
        }
        setKeyManagementParameters(e10) {
          return this._flattened.setKeyManagementParameters(e10), this;
        }
        async encrypt(e10, t2) {
          let r2 = await this._flattened.encrypt(e10, t2);
          return [r2.protected, r2.encrypted_key, r2.iv, r2.ciphertext, r2.tag].join(".");
        }
      }
      let th = async (e10, t2, r2) => {
        let n2 = await e7(e10, t2, "sign");
        return ew(e10, n2), new Uint8Array(await i.subtle.sign(e9(e10, n2.algorithm), n2, r2));
      };
      class tf {
        constructor(e10) {
          if (!(e10 instanceof Uint8Array)) throw TypeError("payload must be an instance of Uint8Array");
          this._payload = e10;
        }
        setProtectedHeader(e10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = e10, this;
        }
        setUnprotectedHeader(e10) {
          if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this._unprotectedHeader = e10, this;
        }
        async sign(e10, t2) {
          let r2;
          if (!this._protectedHeader && !this._unprotectedHeader) throw new R("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
          if (!en(this._protectedHeader, this._unprotectedHeader)) throw new R("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
          let n2 = { ...this._protectedHeader, ...this._unprotectedHeader }, a2 = eF(R, /* @__PURE__ */ new Map([["b64", true]]), null == t2 ? void 0 : t2.crit, this._protectedHeader, n2), i2 = true;
          if (a2.has("b64") && "boolean" != typeof (i2 = this._protectedHeader.b64)) throw new R('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
          let { alg: o2 } = n2;
          if ("string" != typeof o2 || !o2) throw new R('JWS "alg" (Algorithm) Header Parameter missing or invalid');
          ej(o2, e10, "sign");
          let s2 = this._payload;
          i2 && (s2 = c.encode(w(s2)));
          let u2 = d(r2 = this._protectedHeader ? c.encode(w(JSON.stringify(this._protectedHeader))) : c.encode(""), c.encode("."), s2), p2 = { signature: w(await th(o2, e10, u2)), payload: "" };
          return i2 && (p2.payload = l.decode(s2)), this._unprotectedHeader && (p2.header = this._unprotectedHeader), this._protectedHeader && (p2.protected = l.decode(r2)), p2;
        }
      }
      class tg {
        constructor(e10) {
          this._flattened = new tf(e10);
        }
        setProtectedHeader(e10) {
          return this._flattened.setProtectedHeader(e10), this;
        }
        async sign(e10, t2) {
          let r2 = await this._flattened.sign(e10, t2);
          if (void 0 === r2.payload) throw TypeError("use the flattened module for creating JWS with b64: false");
          return `${r2.protected}.${r2.payload}.${r2.signature}`;
        }
      }
      class ty {
        constructor(e10, t2, r2) {
          this.parent = e10, this.key = t2, this.options = r2;
        }
        setProtectedHeader(e10) {
          if (this.protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this.protectedHeader = e10, this;
        }
        setUnprotectedHeader(e10) {
          if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this.unprotectedHeader = e10, this;
        }
        addSignature(...e10) {
          return this.parent.addSignature(...e10);
        }
        sign(...e10) {
          return this.parent.sign(...e10);
        }
        done() {
          return this.parent;
        }
      }
      class tw {
        constructor(e10) {
          this._signatures = [], this._payload = e10;
        }
        addSignature(e10, t2) {
          let r2 = new ty(this, e10, t2);
          return this._signatures.push(r2), r2;
        }
        async sign() {
          if (!this._signatures.length) throw new R("at least one signature must be added");
          let e10 = { signatures: [], payload: "" };
          for (let t2 = 0; t2 < this._signatures.length; t2++) {
            let r2 = this._signatures[t2], n2 = new tf(this._payload);
            n2.setProtectedHeader(r2.protectedHeader), n2.setUnprotectedHeader(r2.unprotectedHeader);
            let { payload: a2, ...i2 } = await n2.sign(r2.key, r2.options);
            if (0 === t2) e10.payload = a2;
            else if (e10.payload !== a2) throw new R("inconsistent use of JWS Unencoded Payload (RFC7797)");
            e10.signatures.push(i2);
          }
          return e10;
        }
      }
      class tm {
        constructor(e10) {
          if (!ea(e10)) throw TypeError("JWT Claims Set MUST be an object");
          this._payload = e10;
        }
        setIssuer(e10) {
          return this._payload = { ...this._payload, iss: e10 }, this;
        }
        setSubject(e10) {
          return this._payload = { ...this._payload, sub: e10 }, this;
        }
        setAudience(e10) {
          return this._payload = { ...this._payload, aud: e10 }, this;
        }
        setJti(e10) {
          return this._payload = { ...this._payload, jti: e10 }, this;
        }
        setNotBefore(e10) {
          return "number" == typeof e10 ? this._payload = { ...this._payload, nbf: e10 } : this._payload = { ...this._payload, nbf: ta(/* @__PURE__ */ new Date()) + to(e10) }, this;
        }
        setExpirationTime(e10) {
          return "number" == typeof e10 ? this._payload = { ...this._payload, exp: e10 } : this._payload = { ...this._payload, exp: ta(/* @__PURE__ */ new Date()) + to(e10) }, this;
        }
        setIssuedAt(e10) {
          return void 0 === e10 ? this._payload = { ...this._payload, iat: ta(/* @__PURE__ */ new Date()) } : this._payload = { ...this._payload, iat: e10 }, this;
        }
      }
      class tb extends tm {
        setProtectedHeader(e10) {
          return this._protectedHeader = e10, this;
        }
        async sign(e10, t2) {
          var r2;
          let n2 = new tg(c.encode(JSON.stringify(this._payload)));
          if (n2.setProtectedHeader(this._protectedHeader), Array.isArray(null === (r2 = this._protectedHeader) || void 0 === r2 ? void 0 : r2.crit) && this._protectedHeader.crit.includes("b64") && false === this._protectedHeader.b64) throw new T("JWTs MUST NOT use unencoded payload");
          return n2.sign(e10, t2);
        }
      }
      class tv extends tm {
        setProtectedHeader(e10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = e10, this;
        }
        setKeyManagementParameters(e10) {
          if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
          return this._keyManagementParameters = e10, this;
        }
        setContentEncryptionKey(e10) {
          if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
          return this._cek = e10, this;
        }
        setInitializationVector(e10) {
          if (this._iv) throw TypeError("setInitializationVector can only be called once");
          return this._iv = e10, this;
        }
        replicateIssuerAsHeader() {
          return this._replicateIssuerAsHeader = true, this;
        }
        replicateSubjectAsHeader() {
          return this._replicateSubjectAsHeader = true, this;
        }
        replicateAudienceAsHeader() {
          return this._replicateAudienceAsHeader = true, this;
        }
        async encrypt(e10, t2) {
          let r2 = new tp(c.encode(JSON.stringify(this._payload)));
          return this._replicateIssuerAsHeader && (this._protectedHeader = { ...this._protectedHeader, iss: this._payload.iss }), this._replicateSubjectAsHeader && (this._protectedHeader = { ...this._protectedHeader, sub: this._payload.sub }), this._replicateAudienceAsHeader && (this._protectedHeader = { ...this._protectedHeader, aud: this._payload.aud }), r2.setProtectedHeader(this._protectedHeader), this._iv && r2.setInitializationVector(this._iv), this._cek && r2.setContentEncryptionKey(this._cek), this._keyManagementParameters && r2.setKeyManagementParameters(this._keyManagementParameters), r2.encrypt(e10, t2);
        }
      }
      let tS = (e10, t2) => {
        if ("string" != typeof e10 || !e10) throw new O(`${t2} missing or invalid`);
      };
      async function tE(e10, t2) {
        let r2;
        if (!ea(e10)) throw TypeError("JWK must be an object");
        if (null != t2 || (t2 = "sha256"), "sha256" !== t2 && "sha384" !== t2 && "sha512" !== t2) throw TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
        switch (e10.kty) {
          case "EC":
            tS(e10.crv, '"crv" (Curve) Parameter'), tS(e10.x, '"x" (X Coordinate) Parameter'), tS(e10.y, '"y" (Y Coordinate) Parameter'), r2 = { crv: e10.crv, kty: e10.kty, x: e10.x, y: e10.y };
            break;
          case "OKP":
            tS(e10.crv, '"crv" (Subtype of Key Pair) Parameter'), tS(e10.x, '"x" (Public Key) Parameter'), r2 = { crv: e10.crv, kty: e10.kty, x: e10.x };
            break;
          case "RSA":
            tS(e10.e, '"e" (Exponent) Parameter'), tS(e10.n, '"n" (Modulus) Parameter'), r2 = { e: e10.e, kty: e10.kty, n: e10.n };
            break;
          case "oct":
            tS(e10.k, '"k" (Key Value) Parameter'), r2 = { k: e10.k, kty: e10.kty };
            break;
          default:
            throw new A('"kty" (Key Type) Parameter missing or unsupported');
        }
        let n2 = c.encode(JSON.stringify(r2));
        return w(await s(t2, n2));
      }
      async function t_(e10, t2) {
        null != t2 || (t2 = "sha256");
        let r2 = await tE(e10, t2);
        return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t2.slice(-3)}:${r2}`;
      }
      async function tA(e10, t2) {
        let r2 = { ...e10, ...null == t2 ? void 0 : t2.header };
        if (!ea(r2.jwk)) throw new R('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
        let n2 = await eW({ ...r2.jwk, ext: true }, r2.alg, true);
        if (n2 instanceof Uint8Array || "public" !== n2.type) throw new R('"jwk" (JSON Web Key) Header Parameter must be a public key');
        return n2;
      }
      function tP(e10) {
        return e10 && "object" == typeof e10 && Array.isArray(e10.keys) && e10.keys.every(tC);
      }
      function tC(e10) {
        return ea(e10);
      }
      class tx {
        constructor(e10) {
          if (this._cached = /* @__PURE__ */ new WeakMap(), !tP(e10)) throw new k("JSON Web Key Set malformed");
          this._jwks = function(e11) {
            return "function" == typeof structuredClone ? structuredClone(e11) : JSON.parse(JSON.stringify(e11));
          }(e10);
        }
        async getKey(e10, t2) {
          let { alg: r2, kid: n2 } = { ...e10, ...null == t2 ? void 0 : t2.header }, a2 = function(e11) {
            switch ("string" == typeof e11 && e11.slice(0, 2)) {
              case "RS":
              case "PS":
                return "RSA";
              case "ES":
                return "EC";
              case "Ed":
                return "OKP";
              default:
                throw new A('Unsupported "alg" value for a JSON Web Key Set');
            }
          }(r2), i2 = this._jwks.keys.filter((e11) => {
            let t3 = a2 === e11.kty;
            if (t3 && "string" == typeof n2 && (t3 = n2 === e11.kid), t3 && "string" == typeof e11.alg && (t3 = r2 === e11.alg), t3 && "string" == typeof e11.use && (t3 = "sig" === e11.use), t3 && Array.isArray(e11.key_ops) && (t3 = e11.key_ops.includes("verify")), t3 && "EdDSA" === r2 && (t3 = "Ed25519" === e11.crv || "Ed448" === e11.crv), t3) switch (r2) {
              case "ES256":
                t3 = "P-256" === e11.crv;
                break;
              case "ES256K":
                t3 = "secp256k1" === e11.crv;
                break;
              case "ES384":
                t3 = "P-384" === e11.crv;
                break;
              case "ES512":
                t3 = "P-521" === e11.crv;
            }
            return t3;
          }), { 0: o2, length: s2 } = i2;
          if (0 === s2) throw new I();
          if (1 !== s2) {
            let e11 = new N(), { _cached: t3 } = this;
            throw e11[Symbol.asyncIterator] = async function* () {
              for (let e12 of i2) try {
                yield await tR(t3, e12, r2);
              } catch (e13) {
                continue;
              }
            }, e11;
          }
          return tR(this._cached, o2, r2);
        }
      }
      async function tR(e10, t2, r2) {
        let n2 = e10.get(t2) || e10.set(t2, {}).get(t2);
        if (void 0 === n2[r2]) {
          let e11 = await eW({ ...t2, ext: true }, r2);
          if (e11 instanceof Uint8Array || "public" !== e11.type) throw new k("JSON Web Key Set members must be public keys");
          n2[r2] = e11;
        }
        return n2[r2];
      }
      function tT(e10) {
        let t2 = new tx(e10);
        return async function(e11, r2) {
          return t2.getKey(e11, r2);
        };
      }
      let tO = async (e10, t2, r2) => {
        let n2, a2;
        let i2 = false;
        "function" == typeof AbortController && (n2 = new AbortController(), a2 = setTimeout(() => {
          i2 = true, n2.abort();
        }, t2));
        let o2 = await fetch(e10.href, { signal: n2 ? n2.signal : void 0, redirect: "manual", headers: r2.headers }).catch((e11) => {
          if (i2) throw new H();
          throw e11;
        });
        if (void 0 !== a2 && clearTimeout(a2), 200 !== o2.status) throw new v("Expected 200 OK from the JSON Web Key Set HTTP response");
        try {
          return await o2.json();
        } catch (e11) {
          throw new v("Failed to parse the JSON Web Key Set HTTP response as JSON");
        }
      };
      class tk extends tx {
        constructor(e10, t2) {
          if (super({ keys: [] }), this._jwks = void 0, !(e10 instanceof URL)) throw TypeError("url must be an instance of URL");
          this._url = new URL(e10.href), this._options = { agent: null == t2 ? void 0 : t2.agent, headers: null == t2 ? void 0 : t2.headers }, this._timeoutDuration = "number" == typeof (null == t2 ? void 0 : t2.timeoutDuration) ? null == t2 ? void 0 : t2.timeoutDuration : 5e3, this._cooldownDuration = "number" == typeof (null == t2 ? void 0 : t2.cooldownDuration) ? null == t2 ? void 0 : t2.cooldownDuration : 3e4, this._cacheMaxAge = "number" == typeof (null == t2 ? void 0 : t2.cacheMaxAge) ? null == t2 ? void 0 : t2.cacheMaxAge : 6e5;
        }
        coolingDown() {
          return "number" == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cooldownDuration;
        }
        fresh() {
          return "number" == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cacheMaxAge;
        }
        async getKey(e10, t2) {
          this._jwks && this.fresh() || await this.reload();
          try {
            return await super.getKey(e10, t2);
          } catch (r2) {
            if (r2 instanceof I && false === this.coolingDown()) return await this.reload(), super.getKey(e10, t2);
            throw r2;
          }
        }
        async reload() {
          this._pendingFetch && ("undefined" != typeof WebSocketPair || "undefined" != typeof navigator && "Cloudflare-Workers" === navigator.userAgent) && (this._pendingFetch = void 0), this._pendingFetch || (this._pendingFetch = tO(this._url, this._timeoutDuration, this._options).then((e10) => {
            if (!tP(e10)) throw new k("JSON Web Key Set malformed");
            this._jwks = { keys: e10.keys }, this._jwksTimestamp = Date.now(), this._pendingFetch = void 0;
          }).catch((e10) => {
            throw this._pendingFetch = void 0, e10;
          })), await this._pendingFetch;
        }
      }
      function tI(e10, t2) {
        let r2 = new tk(e10, t2);
        return async function(e11, t3) {
          return r2.getKey(e11, t3);
        };
      }
      class tN extends tm {
        encode() {
          let e10 = w(JSON.stringify({ alg: "none" })), t2 = w(JSON.stringify(this._payload));
          return `${e10}.${t2}.`;
        }
        static decode(e10, t2) {
          let r2;
          if ("string" != typeof e10) throw new T("Unsecured JWT must be a string");
          let { 0: n2, 1: a2, 2: i2, length: o2 } = e10.split(".");
          if (3 !== o2 || "" !== i2) throw new T("Invalid Unsecured JWT");
          try {
            if (r2 = JSON.parse(l.decode(b(n2))), "none" !== r2.alg) throw Error();
          } catch (e11) {
            throw new T("Invalid Unsecured JWT");
          }
          return { payload: tl(r2, b(a2), t2), header: r2 };
        }
      }
      let tH = w, tM = b;
      function tD(e10) {
        let t2;
        if ("string" == typeof e10) {
          let r2 = e10.split(".");
          (3 === r2.length || 5 === r2.length) && ([t2] = r2);
        } else if ("object" == typeof e10 && e10) {
          if ("protected" in e10) t2 = e10.protected;
          else throw TypeError("Token does not contain a Protected Header");
        }
        try {
          if ("string" != typeof t2 || !t2) throw Error();
          let e11 = JSON.parse(l.decode(tM(t2)));
          if (!ea(e11)) throw Error();
          return e11;
        } catch (e11) {
          throw TypeError("Invalid Token or Protected Header formatting");
        }
      }
      function tU(e10) {
        let t2, r2;
        if ("string" != typeof e10) throw new T("JWTs must use Compact JWS serialization, JWT must be a string");
        let { 1: n2, length: a2 } = e10.split(".");
        if (5 === a2) throw new T("Only JWTs using Compact JWS serialization can be decoded");
        if (3 !== a2) throw new T("Invalid JWT");
        if (!n2) throw new T("JWTs must contain a payload");
        try {
          t2 = tM(n2);
        } catch (e11) {
          throw new T("Failed to base64url decode the payload");
        }
        try {
          r2 = JSON.parse(l.decode(t2));
        } catch (e11) {
          throw new T("Failed to parse the decoded payload as JSON");
        }
        if (!ea(r2)) throw new T("Invalid JWT Claims Set");
        return r2;
      }
      async function tW(e10, t2) {
        var r2;
        let n2, a2, o2;
        switch (e10) {
          case "HS256":
          case "HS384":
          case "HS512":
            n2 = parseInt(e10.slice(-3), 10), a2 = { name: "HMAC", hash: `SHA-${n2}`, length: n2 }, o2 = ["sign", "verify"];
            break;
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return D(new Uint8Array((n2 = parseInt(e10.slice(-3), 10)) >> 3));
          case "A128KW":
          case "A192KW":
          case "A256KW":
            a2 = { name: "AES-KW", length: n2 = parseInt(e10.slice(1, 4), 10) }, o2 = ["wrapKey", "unwrapKey"];
            break;
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW":
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            a2 = { name: "AES-GCM", length: n2 = parseInt(e10.slice(1, 4), 10) }, o2 = ["encrypt", "decrypt"];
            break;
          default:
            throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        return i.subtle.generateKey(a2, null !== (r2 = null == t2 ? void 0 : t2.extractable) && void 0 !== r2 && r2, o2);
      }
      function tL(e10) {
        var t2;
        let r2 = null !== (t2 = null == e10 ? void 0 : e10.modulusLength) && void 0 !== t2 ? t2 : 2048;
        if ("number" != typeof r2 || r2 < 2048) throw new A("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
        return r2;
      }
      async function tK(e10, t2) {
        var r2, n2, a2;
        let o2, s2;
        switch (e10) {
          case "PS256":
          case "PS384":
          case "PS512":
            o2 = { name: "RSA-PSS", hash: `SHA-${e10.slice(-3)}`, publicExponent: new Uint8Array([1, 0, 1]), modulusLength: tL(t2) }, s2 = ["sign", "verify"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            o2 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e10.slice(-3)}`, publicExponent: new Uint8Array([1, 0, 1]), modulusLength: tL(t2) }, s2 = ["sign", "verify"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            o2 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e10.slice(-3), 10) || 1}`, publicExponent: new Uint8Array([1, 0, 1]), modulusLength: tL(t2) }, s2 = ["decrypt", "unwrapKey", "encrypt", "wrapKey"];
            break;
          case "ES256":
            o2 = { name: "ECDSA", namedCurve: "P-256" }, s2 = ["sign", "verify"];
            break;
          case "ES384":
            o2 = { name: "ECDSA", namedCurve: "P-384" }, s2 = ["sign", "verify"];
            break;
          case "ES512":
            o2 = { name: "ECDSA", namedCurve: "P-521" }, s2 = ["sign", "verify"];
            break;
          case "EdDSA":
            s2 = ["sign", "verify"];
            let c2 = null !== (r2 = null == t2 ? void 0 : t2.crv) && void 0 !== r2 ? r2 : "Ed25519";
            switch (c2) {
              case "Ed25519":
              case "Ed448":
                o2 = { name: c2 };
                break;
              default:
                throw new A("Invalid or unsupported crv option provided");
            }
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            s2 = ["deriveKey", "deriveBits"];
            let e11 = null !== (n2 = null == t2 ? void 0 : t2.crv) && void 0 !== n2 ? n2 : "P-256";
            switch (e11) {
              case "P-256":
              case "P-384":
              case "P-521":
                o2 = { name: "ECDH", namedCurve: e11 };
                break;
              case "X25519":
              case "X448":
                o2 = { name: e11 };
                break;
              default:
                throw new A("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
            }
            break;
          }
          default:
            throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        return i.subtle.generateKey(o2, null !== (a2 = null == t2 ? void 0 : t2.extractable) && void 0 !== a2 && a2, s2);
      }
      async function tj(e10, t2) {
        return tK(e10, t2);
      }
      async function tJ(e10, t2) {
        return tW(e10, t2);
      }
      let tB = "WebCryptoAPI";
    } }, (e) => {
      var t = e(e.s = 441);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES).middleware_middleware = t;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*))(.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";
import { Readable as Readable2 } from "node:stream";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": true }, "typescript": { "ignoreBuildErrors": true, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.mjs", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "analyticsId": "", "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "inline", "remotePatterns": [], "unoptimized": true }, "devIndicators": { "buildActivity": true, "buildActivityPosition": "bottom-right" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "optimizeFonts": true, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "httpAgentOptions": { "keepAlive": true }, "outputFileTracing": true, "staticPageGenerationTimeout": 60, "swcMinify": true, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "experimental": { "multiZoneDraftMode": false, "prerenderEarlyExit": false, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "outputFileTracingRoot": "/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo", "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "adjustFontFallbacks": false, "adjustFontFallbacksWithSizeAdjust": false, "typedRoutes": false, "instrumentationHook": false, "bundlePagesExternals": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "missingSuspenseWithCSRBailout": true, "optimizeServerReact": true, "useEarlyImport": false, "staleTimes": { "dynamic": 30, "static": 300 }, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "configFileName": "next.config.mjs" };
var BuildId = "gz8pMJEvUI87moReQg9Aq";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin", "regex": "^/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin(?:/)?$" }, { "page": "/admin/analytics", "regex": "^/admin/analytics(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/analytics(?:/)?$" }, { "page": "/admin/artists", "regex": "^/admin/artists(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/artists(?:/)?$" }, { "page": "/admin/artists/new", "regex": "^/admin/artists/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/artists/new(?:/)?$" }, { "page": "/admin/calendar", "regex": "^/admin/calendar(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/calendar(?:/)?$" }, { "page": "/admin/portfolio", "regex": "^/admin/portfolio(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/portfolio(?:/)?$" }, { "page": "/admin/settings", "regex": "^/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/settings(?:/)?$" }, { "page": "/admin/uploads", "regex": "^/admin/uploads(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/uploads(?:/)?$" }, { "page": "/aftercare", "regex": "^/aftercare(?:/)?$", "routeKeys": {}, "namedRegex": "^/aftercare(?:/)?$" }, { "page": "/artists", "regex": "^/artists(?:/)?$", "routeKeys": {}, "namedRegex": "^/artists(?:/)?$" }, { "page": "/auth/error", "regex": "^/auth/error(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/error(?:/)?$" }, { "page": "/auth/signin", "regex": "^/auth/signin(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/signin(?:/)?$" }, { "page": "/book", "regex": "^/book(?:/)?$", "routeKeys": {}, "namedRegex": "^/book(?:/)?$" }, { "page": "/contact", "regex": "^/contact(?:/)?$", "routeKeys": {}, "namedRegex": "^/contact(?:/)?$" }, { "page": "/deposit", "regex": "^/deposit(?:/)?$", "routeKeys": {}, "namedRegex": "^/deposit(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/gift-cards", "regex": "^/gift\\-cards(?:/)?$", "routeKeys": {}, "namedRegex": "^/gift\\-cards(?:/)?$" }, { "page": "/privacy", "regex": "^/privacy(?:/)?$", "routeKeys": {}, "namedRegex": "^/privacy(?:/)?$" }, { "page": "/specials", "regex": "^/specials(?:/)?$", "routeKeys": {}, "namedRegex": "^/specials(?:/)?$" }, { "page": "/terms", "regex": "^/terms(?:/)?$", "routeKeys": {}, "namedRegex": "^/terms(?:/)?$" }], "dynamic": [{ "page": "/admin/artists/[id]", "regex": "^/admin/artists/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/artists/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/artists/[id]", "regex": "^/api/artists/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/artists/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/auth/[...nextauth]", "regex": "^/api/auth/(.+?)(?:/)?$", "routeKeys": { "nxtPnextauth": "nxtPnextauth" }, "namedRegex": "^/api/auth/(?<nxtPnextauth>.+?)(?:/)?$" }, { "page": "/api/portfolio/[id]", "regex": "^/api/portfolio/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/portfolio/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/artists/[id]", "regex": "^/artists/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/artists/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/artists/[id]/book", "regex": "^/artists/([^/]+?)/book(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/artists/(?<nxtPid>[^/]+?)/book(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "99755ef025160fcf22d0560ccd3bfacb", "previewModeSigningKey": "776739d8eae8268964d6cbfffa1ca408958be3c7505213a17ee4f6f051fdd978", "previewModeEncryptionKey": "c2faa229a10a0bf6b4268feb7296ccadeb0f83a5288cfe5b7585beed732d1445" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/middleware.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*))(.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "gz8pMJEvUI87moReQg9Aq", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "5BkhnreT0UMAbkH2/BNzd06Ch/HTypOl9TrJ2enxxHY=", "__NEXT_PREVIEW_MODE_ID": "99755ef025160fcf22d0560ccd3bfacb", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "c2faa229a10a0bf6b4268feb7296ccadeb0f83a5288cfe5b7585beed732d1445", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "776739d8eae8268964d6cbfffa1ca408958be3c7505213a17ee4f6f051fdd978" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/aftercare/page": "/aftercare", "/api/admin/migrate/route": "/api/admin/migrate", "/api/artists/[id]/route": "/api/artists/[id]", "/api/auth/[...nextauth]/route": "/api/auth/[...nextauth]", "/artists/[id]/page": "/artists/[id]", "/artists/[id]/book/page": "/artists/[id]/book", "/artists/page": "/artists", "/auth/error/page": "/auth/error", "/auth/signin/page": "/auth/signin", "/book/page": "/book", "/contact/page": "/contact", "/deposit/page": "/deposit", "/favicon.ico/route": "/favicon.ico", "/gift-cards/page": "/gift-cards", "/page": "/", "/privacy/page": "/privacy", "/specials/page": "/specials", "/terms/page": "/terms", "/api/admin/stats/route": "/api/admin/stats", "/api/artists/route": "/api/artists", "/api/files/bulk-delete/route": "/api/files/bulk-delete", "/api/files/folder/route": "/api/files/folder", "/api/files/stats/route": "/api/files/stats", "/api/files/route": "/api/files", "/api/portfolio/bulk-delete/route": "/api/portfolio/bulk-delete", "/api/portfolio/[id]/route": "/api/portfolio/[id]", "/api/appointments/route": "/api/appointments", "/api/settings/route": "/api/settings", "/api/upload/route": "/api/upload", "/api/users/route": "/api/users", "/api/portfolio/stats/route": "/api/portfolio/stats", "/api/portfolio/route": "/api/portfolio", "/admin/artists/[id]/page": "/admin/artists/[id]", "/admin/artists/new/page": "/admin/artists/new", "/admin/artists/page": "/admin/artists", "/admin/calendar/page": "/admin/calendar", "/admin/page": "/admin", "/admin/portfolio/page": "/admin/portfolio", "/admin/settings/page": "/admin/settings", "/admin/uploads/page": "/admin/uploads", "/admin/analytics/page": "/admin/analytics" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/api/files/bulk-delete": {}, "/api/admin/stats": {}, "/api/artists": {}, "/api/files/folder": {}, "/api/files": {}, "/api/files/stats": {}, "/api/portfolio/bulk-delete": {}, "/api/portfolio/[id]": {}, "/api/appointments": {}, "/api/portfolio/stats": {}, "/api/portfolio": {}, "/api/users": {}, "/api/upload": {}, "/api/settings": {}, "/admin/portfolio": {}, "/admin/settings": {}, "/admin/uploads": {}, "/admin/analytics": {} } };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js" };
process.env.NEXT_BUILD_ID = BuildId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType?.split(";")[0] ?? "";
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (host) {
    return pattern.test(url) && !url.includes(host);
  }
  return pattern.test(url);
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
  return readable;
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    return value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest.routes).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  switch (cachedValue.type) {
    case "app":
      isDataRequest = Boolean(event.headers.rsc);
      body = isDataRequest ? cachedValue.rsc : cachedValue.html;
      type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
      break;
    case "page":
      isDataRequest = Boolean(event.query.__nextDataReq);
      body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
      type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
      break;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    statusCode: cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest.routes).includes(localizedPath ?? "/") || Object.values(PrerenderManifest.dynamicRoutes).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => route.startsWith("/api/") || route === "/api" && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes, routes } = prerenderManifest;
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest.preview.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: statusCode
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    headers = {
      ...middlewareEventOrResult.responseHeaders,
      ...headers
    };
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
