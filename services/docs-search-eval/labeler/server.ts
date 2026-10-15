import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertGoldSetReadyForRun, GoldQuery, goldQueryIdFor, readGoldSet, writeGoldSet, type GoldSet } from "../gold-set.js";
import type { PoolsFile } from "../pools.js";

function progressFor(goldSet: GoldSet, pools: PoolsFile) {
  const labeled = goldSet.queries.filter((query) => query.status === "labeled").length;
  const skipped = goldSet.queries.filter((query) => query.status === "skipped").length;
  const componentLabeled = goldSet.queries.filter((query) => query.status === "labeled" && query.targetsComponentPage).length;
  const awaitingReview = goldSet.queries.filter((query) => query.isAwaitingReview).length;
  const savedIds = new Set(goldSet.queries.map((query) => query.id));
  const remaining = pools.rows.filter((row) => !savedIds.has(goldQueryIdFor(row.spanUuid))).length;
  let problems: string[] = [];
  try {
    assertGoldSetReadyForRun(goldSet);
  } catch (error) {
    problems = (error as Error).message.split("\n");
  }
  return { labeled, skipped, componentLabeled, awaitingReview, remaining, isReadyForRun: problems.length === 0, problems };
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function createLabelerHandler(pools: PoolsFile, initialGoldSet: GoldSet, goldPath: string, port: number, html: string) {
  let goldSet = initialGoldSet;
  let pendingSave: Promise<void> = Promise.resolve();
  const rowsById = new Map(pools.rows.map((row) => [goldQueryIdFor(row.spanUuid), row]));
  return async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const host = request.headers.host;
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
      sendJson(response, 403, { errors: ["Invalid Host header"] });
      return;
    }
    if (request.method === "POST" && request.headers.origin !== undefined && request.headers.origin !== `http://${host}`) {
      sendJson(response, 403, { errors: ["Invalid Origin header"] });
      return;
    }
    try {
      if (request.method === "GET" && request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
        response.end(html);
        return;
      }
      if (request.method === "GET" && request.url === "/api/state") {
        const goldById = new Map(goldSet.queries.map((query) => [query.id, query]));
        sendJson(response, 200, {
          rows: pools.rows.map((row) => {
            const id = goldQueryIdFor(row.spanUuid);
            return { ...row, id, ...goldById.get(id) };
          }),
          progress: progressFor(goldSet, pools),
        });
        return;
      }
      if (request.method !== "POST" || request.url !== "/api/gold") {
        sendJson(response, 404, { errors: ["Not found"] });
        return;
      }
      const bodyChunks: Buffer[] = [];
      let bodyBytes = 0;
      for await (const chunk of request) {
        bodyBytes += chunk.length;
        if (bodyBytes > 1024 * 1024) {
          sendJson(response, 413, { errors: ["Body exceeds 1 MB"] });
          return;
        }
        bodyChunks.push(Buffer.from(chunk));
      }
      let body: unknown;
      try {
        body = JSON.parse(Buffer.concat(bodyChunks).toString("utf8"));
      } catch {
        sendJson(response, 400, { errors: ["Invalid JSON"] });
        return;
      }
      const entry = GoldQuery.safeParse(body);
      if (!entry.success) {
        sendJson(response, 400, { errors: entry.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) });
        return;
      }
      const poolRow = rowsById.get(entry.data.id);
      if (!poolRow || poolRow.harness !== entry.data.harness) {
        sendJson(response, 400, { errors: ["id and harness must match a pool row"] });
        return;
      }
      const previousSave = pendingSave;
      let releaseSave!: () => void;
      pendingSave = new Promise<void>((resolveSave) => { releaseSave = resolveSave; });
      await previousSave;
      try {
        const goldSetOnDisk = await readGoldSet(goldPath);
        const updatedGoldSet: GoldSet = {
          version: 1,
          queries: [...goldSetOnDisk.queries.filter((query) => query.id !== entry.data.id), entry.data],
        };
        await writeGoldSet(updatedGoldSet, goldPath);
        goldSet = updatedGoldSet;
        sendJson(response, 200, { progress: progressFor(goldSet, pools) });
      } finally {
        releaseSave();
      }
    } catch {
      sendJson(response, 500, { errors: ["Unable to read request or save gold set"] });
    }
  };
}

async function main(): Promise<void> {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes("--help")) {
    console.log("Usage: pnpm docs-eval:label [--port <port>] [--pools <path>] [--gold <path>] [--help]\nLocal docs-search labeler. Defaults: port 4317, data/pools.json, gold-set.json.\nExit codes: 0 success, 2 configuration/file error.");
    return;
  }
  try {
    let port = 4317;
    let poolsPath = fileURLToPath(new URL("../data/pools.json", import.meta.url));
    let goldPath = fileURLToPath(new URL("../gold-set.json", import.meta.url));
    for (let index = 0; index < argumentsList.length; index++) {
      const argument = argumentsList[index];
      if (!["--port", "--pools", "--gold"].includes(argument)) throw new Error("Unknown argument; run --help");
      const value = argumentsList[++index];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      if (argument === "--pools") poolsPath = resolve(value);
      if (argument === "--gold") goldPath = resolve(value);
      if (argument !== "--port") continue;
      port = Number(value);
      if (!/^\d+$/.test(value) || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error("--port requires an integer from 1 to 65535");
    }
    let pools: PoolsFile;
    try {
      pools = JSON.parse(await readFile(poolsPath, "utf8")) as PoolsFile;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new Error("Missing pools.json; run pnpm docs-eval:pools first");
      throw new Error("Unable to read pools.json");
    }
    if (!Array.isArray(pools.rows) || pools.rows.some((row) => typeof row.spanUuid !== "string" || !Array.isArray(row.candidates))) {
      throw new Error("Invalid pools.json");
    }
    const goldSet = await readGoldSet(goldPath);
    const html = await readFile(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
    const server = createServer(createLabelerHandler(pools, goldSet, goldPath, port, html));
    server.on("error", () => {
      console.error("Unable to start local labeler");
      process.exitCode = 2;
    });
    server.listen(port, "127.0.0.1", () => {
      console.log(`http://127.0.0.1:${port}`);
      const progress = progressFor(goldSet, pools);
      console.log(`Rows: ${pools.rows.length}; labeled: ${progress.labeled}; skipped: ${progress.skipped}; component-labeled: ${progress.componentLabeled}; remaining: ${progress.remaining}`);
    });
  } catch (error) {
    console.error(error instanceof Error && !error.name.startsWith("Zod") ? error.message : "Invalid gold-set.json");
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
