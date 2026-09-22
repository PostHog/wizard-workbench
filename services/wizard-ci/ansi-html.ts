/** Render the SGR styling in captured terminal frames as safe HTML. */

interface Style {
  foreground?: string;
  background?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  inverse?: boolean;
}

const BASIC_COLORS = [
  "#000000", "#cd3131", "#0dbc79", "#e5e510",
  "#2472c8", "#bc3fbc", "#11a8cd", "#e5e5e5",
  "#666666", "#f14c4c", "#23d18b", "#f5f543",
  "#3b8eea", "#d670d6", "#29b8db", "#ffffff",
];

function ansiColor(index: number): string | undefined {
  if (!Number.isInteger(index) || index < 0 || index > 255) return undefined;
  if (index < 16) return BASIC_COLORS[index];
  if (index < 232) {
    const color = index - 16;
    const component = (value: number) => value === 0 ? 0 : value * 40 + 55;
    const red = component(Math.floor(color / 36));
    const green = component(Math.floor(color / 6) % 6);
    const blue = component(color % 6);
    return `rgb(${red},${green},${blue})`;
  }
  const gray = (index - 232) * 10 + 8;
  return `rgb(${gray},${gray},${gray})`;
}

function applySgr(style: Style, parameters: string): Style {
  const values = (parameters || "0").split(";").map((value) => value === "" ? 0 : Number(value));
  let next = { ...style };
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value === 0) next = {};
    else if (value === 1) next.bold = true;
    else if (value === 2) next.dim = true;
    else if (value === 3) next.italic = true;
    else if (value === 4) next.underline = true;
    else if (value === 7) next.inverse = true;
    else if (value === 22) { next.bold = false; next.dim = false; }
    else if (value === 23) next.italic = false;
    else if (value === 24) next.underline = false;
    else if (value === 27) next.inverse = false;
    else if (value === 39) next.foreground = undefined;
    else if (value === 49) next.background = undefined;
    else if (value >= 30 && value <= 37) next.foreground = ansiColor(value - 30);
    else if (value >= 90 && value <= 97) next.foreground = ansiColor(value - 90 + 8);
    else if (value >= 40 && value <= 47) next.background = ansiColor(value - 40);
    else if (value >= 100 && value <= 107) next.background = ansiColor(value - 100 + 8);
    else if (value === 38 || value === 48) {
      const property = value === 38 ? "foreground" : "background";
      const mode = values[++i];
      if (mode === 5 && i + 1 < values.length) {
        next[property] = ansiColor(values[++i]);
      } else if (mode === 2 && i + 3 < values.length) {
        const channels = values.slice(i + 1, i + 4);
        i += 3;
        if (channels.every((channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255)) {
          next[property] = `rgb(${channels.join(",")})`;
        }
      }
    }
  }
  return next;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function styledText(text: string, style: Style): string {
  // Captured frames contain SGR codes. Never show an unsupported control code
  // as visible text in the PNG or allow it to affect the browser.
  const content = escapeHtml(text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").replace(/\x1b/g, ""));
  if (!content) return "";
  const foreground = style.inverse ? (style.background ?? "#010409") : style.foreground;
  const background = style.inverse ? (style.foreground ?? "#c9d1d9") : style.background;
  const css = [
    foreground && `color:${foreground}`,
    background && `background-color:${background}`,
    style.bold && "font-weight:700",
    style.dim && "opacity:.6",
    style.italic && "font-style:italic",
    style.underline && "text-decoration:underline",
  ].filter(Boolean).join(";");
  return css ? `<span style="${css}">${content}</span>` : content;
}

export function ansiToHtml(input: string): string {
  const sgr = /\x1b\[([0-9;]*)m/g;
  let style: Style = {};
  let start = 0;
  let html = "";
  for (const match of input.matchAll(sgr)) {
    const index = match.index;
    html += styledText(input.slice(start, index), style);
    style = applySgr(style, match[1]);
    start = index + match[0].length;
  }
  return html + styledText(input.slice(start), style);
}
