import assert from "node:assert/strict";
import test from "node:test";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { redactValue } from "../reporting/redaction.js";

test("redacts secrets, secret fields, and contained absolute paths", () =>
  assert.deepEqual(
    redactValue(
      {
        file: "/tmp/fixture/apps/web/package.json",
        token: "phx_secret",
        text: "Bearer abc.def",
      },
      "/tmp/fixture"
    ),
    { file: "apps/web/package.json", token: "[REDACTED]", text: "[REDACTED]" }
  ));
test("redacts embedded home and temporary paths", () => {
  const value = redactValue(
    {
      home: `failed at ${join(homedir(), "repo", "file.ts")}`,
      temp: `copy ${join(tmpdir(), "fixture", "file.ts")}`,
    },
    "/unrelated"
  );
  assert.equal(JSON.stringify(value).includes(homedir()), false);
  assert.equal(JSON.stringify(value).includes(tmpdir()), false);
});
test("retains numeric token aggregates while redacting token strings", () =>
  assert.deepEqual(
    redactValue({ inputTokens: 12, accessToken: "pha_secret" }, "/tmp/fixture"),
    { inputTokens: 12, accessToken: "[REDACTED]" }
  ));
test("redacts project keys and Basic authorization values", () =>
  assert.deepEqual(
    redactValue(
      {
        projectKey: "phc_project_secret",
        header: "Basic dXNlcjpwYXNz",
      },
      "/tmp/fixture"
    ),
    { projectKey: "[REDACTED]", header: "[REDACTED]" }
  ));
