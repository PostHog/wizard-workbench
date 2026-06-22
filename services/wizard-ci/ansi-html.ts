/**
 * Minimal ANSI (SGR) → HTML converter — no dependency, runs offline in CI.
 * Handles the subset Ink emits: reset, bold/dim/italic/underline (+ resets),
 * 16-color fg/bg, bright fg/bg, 256-color (38;5;n / 48;5;n), and truecolor
 * (38;2;r;g;b / 48;2;r;g;b). Unknown codes are ignored. Output is HTML-escaped.
 */

const BASE16 = [
  "#000000", "#cd3131", "#0dbc79", "#e5e510", "#2472c8", "#bc3fbc", "#11a8cd", "#e5e5e5",
  "#666666", "#f14c4c", "#23d18b", "#f5f543", "#3b8eea", "#d670d6", "#29b8db", "#ffffff",
];

/** xterm 256-color index → #rrggbb. */
function xterm256(n: number): string {
  if (n < 16) return BASE16[n];
  if (n < 232) {
    const i = n - 16;
    const r = Math.floor(i / 36);
    const g = Math.floor((i % 36) / 6);
    const b = i % 6;
    const c = (v: number) => (v === 0 ? 0 : 55 + v * 40);
    return `#${[c(r), c(g), c(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  }
  const v = (n - 232) * 10 + 8;
  return `#${[v, v, v].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

interface Style {
  fg?: string;
  bg?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

function styleToCss(s: Style): string {
  const parts: string[] = [];
  if (s.fg) parts.push(`color:${s.fg}`);
  if (s.bg) parts.push(`background:${s.bg}`);
  if (s.bold) parts.push("font-weight:bold");
  if (s.dim) parts.push("opacity:.6");
  if (s.italic) parts.push("font-style:italic");
  if (s.underline) parts.push("text-decoration:underline");
  return parts.join(";");
}

function applyCodes(style: Style, codes: number[]): Style {
  const s = { ...style };
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i];
    if (c === 0) {
      for (const k of Object.keys(s)) delete (s as Record<string, unknown>)[k];
    } else if (c === 1) s.bold = true;
    else if (c === 2) s.dim = true;
    else if (c === 3) s.italic = true;
    else if (c === 4) s.underline = true;
    else if (c === 22) (s.bold = false), (s.dim = false);
    else if (c === 23) s.italic = false;
    else if (c === 24) s.underline = false;
    else if (c === 39) delete s.fg;
    else if (c === 49) delete s.bg;
    else if (c >= 30 && c <= 37) s.fg = BASE16[c - 30];
    else if (c >= 90 && c <= 97) s.fg = BASE16[c - 90 + 8];
    else if (c >= 40 && c <= 47) s.bg = BASE16[c - 40];
    else if (c >= 100 && c <= 107) s.bg = BASE16[c - 100 + 8];
    else if (c === 38 || c === 48) {
      const target = c === 38 ? "fg" : "bg";
      if (codes[i + 1] === 5) {
        s[target] = xterm256(codes[i + 2]);
        i += 2;
      } else if (codes[i + 1] === 2) {
        const [r, g, b] = [codes[i + 2], codes[i + 3], codes[i + 4]];
        s[target] = `#${[r, g, b].map((v) => (v || 0).toString(16).padStart(2, "0")).join("")}`;
        i += 4;
      }
    }
  }
  return s;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function ansiToHtml(input: string): string {
  let style: Style = {};
  let out = "";
  let buf = "";
  const flush = () => {
    if (!buf) return;
    const css = styleToCss(style);
    out += css ? `<span style="${css}">${escapeHtml(buf)}</span>` : escapeHtml(buf);
    buf = "";
  };
  // eslint-disable-next-line no-control-regex
  const re = /\x1b\[([0-9;]*)m/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    buf += input.slice(last, m.index);
    flush();
    const codes = m[1] === "" ? [0] : m[1].split(";").map(Number);
    style = applyCodes(style, codes);
    last = re.lastIndex;
  }
  buf += input.slice(last);
  flush();
  return out;
}
