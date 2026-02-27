/**
 * Interactive checkbox prompt using raw stdin.
 *
 * Arrow keys to navigate, space to toggle, enter to confirm.
 */

const CLEAR_LINE = "\x1b[2K\r";
const CURSOR_UP = (n: number) => (n > 0 ? `\x1b[${n}A` : "");
const DIM = (s: string) => `\x1b[2m${s}\x1b[0m`;
const BOLD = (s: string) => `\x1b[1m${s}\x1b[0m`;
const GREEN = (s: string) => `\x1b[32m${s}\x1b[0m`;
const CYAN = (s: string) => `\x1b[36m${s}\x1b[0m`;

export interface CheckboxOption {
  label: string;
  checked: boolean;
}

export function checkbox(
  message: string,
  options: CheckboxOption[],
): Promise<CheckboxOption[]> {
  return new Promise((resolve) => {
    let cursor = 0;
    let rendered = 0;

    function render() {
      if (rendered > 0) {
        process.stdout.write(CURSOR_UP(rendered));
      }

      const lines: string[] = [];
      lines.push(
        `${CYAN("?")} ${BOLD(message)} ${DIM("(space to toggle, enter to confirm)")}`,
      );
      for (let i = 0; i < options.length; i++) {
        const pointer = i === cursor ? GREEN("❯") : " ";
        const box = options[i].checked ? GREEN("◼") : "◻";
        const label = i === cursor ? options[i].label : DIM(options[i].label);
        lines.push(`  ${pointer} ${box} ${label}`);
      }

      for (const line of lines) {
        process.stdout.write(`${CLEAR_LINE}${line}\n`);
      }
      rendered = lines.length;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");

    render();

    function onData(key: string) {
      if (key === "\x03") {
        cleanup();
        process.exit(0);
      }

      if (key === "\x1b[A" || key === "k") {
        cursor = (cursor - 1 + options.length) % options.length;
        render();
        return;
      }

      if (key === "\x1b[B" || key === "j") {
        cursor = (cursor + 1) % options.length;
        render();
        return;
      }

      if (key === " ") {
        options[cursor].checked = !options[cursor].checked;
        render();
        return;
      }

      if (key === "\r" || key === "\n") {
        cleanup();
        resolve(options);
      }
    }

    function cleanup() {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }

    process.stdin.on("data", onData);
  });
}
