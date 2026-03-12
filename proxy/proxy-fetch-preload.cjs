"use strict";

const path = require("path");
const { createRequire } = require("module");

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (!proxy) return;

// Resolve "undici" using the workbench's node_modules (respects pnpm/npm layout).
const workbenchRequire = createRequire(path.join(__dirname, "..", "package.json"));

let undici;
try {
  undici = workbenchRequire("undici");
} catch (err) {
  const msg =
    "Proxy preload: cannot find 'undici'. Run 'pnpm install' in wizard-workbench.";
  throw new Error(msg);
}

const { ProxyAgent, fetch: undiciFetch } = undici;
const agent = new ProxyAgent(proxy);
globalThis.fetch = function (url, init) {
  return undiciFetch(url, { ...init, dispatcher: agent });
};
