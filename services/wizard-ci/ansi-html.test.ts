import assert from "node:assert/strict";
import test from "node:test";
import { ansiToHtml } from "./ansi-html.js";

test("renders captured 256-color, bold, dim, inverse, and reset sequences", () => {
  const html = ansiToHtml(
    "\x1b[38;5;58;48;5;178mHeader\x1b[0m " +
    "\x1b[1;7;38;5;178mSelected\x1b[0m " +
    "\x1b[2mMuted\x1b[0m Plain",
  );
  assert.match(html, /color:rgb\(95,95,0\);background-color:rgb\(215,175,0\)/);
  assert.match(html, /color:#010409;background-color:rgb\(215,175,0\);font-weight:700/);
  assert.match(html, /opacity:\.6/);
  assert.match(html, /<\/span> Plain$/);
  assert.doesNotMatch(html, /\x1b|\[38;5;/);
});

test("escapes captured text and preserves newlines without leaking control codes", () => {
  const html = ansiToHtml("\x1b[38;2;1;2;3m<&>\nline\x1b[0m\x1b[2Jdone");
  assert.match(html, /color:rgb\(1,2,3\)/);
  assert.match(html, /&lt;&amp;&gt;\nline/);
  assert.match(html, /<\/span>done$/);
  assert.doesNotMatch(html, /\x1b|\[2J|<&>/);
});
