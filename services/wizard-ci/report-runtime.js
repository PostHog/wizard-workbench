// Browser runtime for the snapshot report: render each captured frame's ANSI
// into a real xterm.js terminal so Playwright can screenshot the colored TUI.
// Frames arrive as window.__FRAMES__; sets window.__ready once all have painted.
(() => {
  const frames = window.__FRAMES__ || [];
  const root = document.getElementById("rows");
  let pending = frames.length;
  const done = () => {
    if (--pending === 0) requestAnimationFrame(() => (window.__ready = true));
  };
  if (!frames.length) window.__ready = true;

  for (const f of frames) {
    const section = document.createElement("section");
    section.className = "row";
    section.setAttribute("data-frame", f.file);
    section.innerHTML =
      '<h2>' + f.file + ' <span class="t">(' + f.elapsed + ')</span></h2>';
    const host = document.createElement("div");
    host.className = "term";
    section.appendChild(host);
    root.appendChild(section);

    // Drop the trailing newline so writing the last row doesn't scroll the top
    // row (the header bar) off into discarded scrollback.
    const ansi = f.ansi.replace(/\n$/, "");
    // Size the terminal to the frame: rows = line count, cols = widest line
    // (measured with SGR escapes stripped, since they occupy no columns).
    const lines = ansi.split("\n");
    const cols = Math.max(1, ...lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "").length));
    const term = new Terminal({
      cols,
      rows: Math.max(1, lines.length),
      fontSize: 14,
      fontFamily: 'ui-monospace,SFMono-Regular,Menlo,"DejaVu Sans Mono",monospace',
      theme: { background: "#010409", foreground: "#c9d1d9" },
      convertEol: true,
      scrollback: 0,
      disableStdin: true,
      cursorInactiveStyle: "none",
    });
    term.open(host);
    term.write(ansi, done);
  }
})();
