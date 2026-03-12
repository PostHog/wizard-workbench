# Proxy wrapper for Node (Charles / fetch inspection)

Routes Node’s `fetch` through an HTTP(S) proxy (e.g. Charles) so you can inspect or mock health-check and other requests. Uses the workbench’s `undici` devDependency; no separate package.

**Setup:** `pnpm install` at workbench root (once). Ensure `proxy/run` is executable (`chmod +x proxy/run` if needed).

**Usage**

**With mprocs (recommended):** start mprocs, then press the key for `wizard-run-proxy`. Same as `wizard-run` but the wizard’s requests go through the proxy (default `http://127.0.0.1:8888`).

**Manual:**

```bash
# From wizard-workbench root — run wizard via Charles (default http://127.0.0.1:8888)
./proxy/run node_modules/.bin/tsx node_modules/@posthog/wizard/bin.ts

# Custom proxy
HTTPS_PROXY=http://localhost:9999 ./proxy/run node_modules/.bin/tsx node_modules/@posthog/wizard/bin.ts
```

Requires Charles (or another proxy) to be running and SSL proxying enabled for the relevant hosts (e.g. `*status.claude.com*`, `*posthogstatus.com*`).
