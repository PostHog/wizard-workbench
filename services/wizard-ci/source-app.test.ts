import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { APPS_DIR } from "./e2e.js";
import { loadExpect } from "./warehouse-checks.js";
import { loadSourcePointer, resolveSourceApp } from "./source-app.js";

const appsDir = mkdtempSync(join(tmpdir(), "source-app-test-"));
after(() => rmSync(appsDir, { recursive: true, force: true }));

function writePointer(app: string, contents: string): void {
  mkdirSync(join(appsDir, app, ".wizard-ci"), { recursive: true });
  writeFileSync(join(appsDir, app, ".wizard-ci", "source.json"), contents);
}

describe("resolveSourceApp", () => {
  it("returns the app itself when it has no pointer", () => {
    assert.equal(resolveSourceApp(appsDir, "plain/app", undefined), "plain/app");
  });

  it("follows source.json", () => {
    writePointer("pointer/app", JSON.stringify({ sourceApp: "real/app" }));
    assert.equal(resolveSourceApp(appsDir, "pointer/app", undefined), "real/app");
  });

  it("falls back to the expect.json sourceApp", () => {
    assert.equal(resolveSourceApp(appsDir, "plain/app", "sibling/app"), "sibling/app");
  });

  it("prefers source.json over the expect.json sourceApp", () => {
    writePointer("both/app", JSON.stringify({ sourceApp: "from-pointer" }));
    assert.equal(resolveSourceApp(appsDir, "both/app", "from-expect"), "from-pointer");
  });

  it("rejects a pointer without a sourceApp", () => {
    writePointer("broken/app", JSON.stringify({ source: "real/app" }));
    assert.throws(() => loadSourcePointer(appsDir, "broken/app"), /non-empty "sourceApp"/);
  });
});

describe("feature-flags pointer apps", () => {
  for (const app of [
    "feature-flags/next-js/15-app-router-saas",
    "feature-flags/django/django3-saas",
  ]) {
    it(`${app} points at an existing app and carries no expect.json`, () => {
      const sourceApp = loadSourcePointer(APPS_DIR, app)?.sourceApp;
      assert.ok(sourceApp, "source.json is missing");
      assert.ok(existsSync(join(APPS_DIR, sourceApp, "README.md")), `apps/${sourceApp} is missing`);
      assert.equal(loadExpect(APPS_DIR, sourceApp), null);
      assert.equal(loadExpect(APPS_DIR, app), null);
      assert.equal(loadSourcePointer(APPS_DIR, sourceApp), null);
    });
  }
});
