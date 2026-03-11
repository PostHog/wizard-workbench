/**
 * YARA content scanner — local copy of the wizard's rule engine.
 *
 * This is a standalone copy of the scan rules from the wizard repo
 * (wizard/src/lib/yara-scanner.ts) so the workbench yara-scan tool
 * can run without requiring the wizard to be built.
 *
 * Keep in sync with the wizard's yara-scanner.ts when rules change.
 */

// ─── Types ───────────────────────────────────────────────────────

export type YaraSeverity = "critical" | "high" | "medium" | "low";

export type YaraCategory =
  | "posthog_pii"
  | "posthog_hardcoded_key"
  | "posthog_autocapture"
  | "posthog_config"
  | "prompt_injection"
  | "exfiltration"
  | "filesystem_safety"
  | "supply_chain";

export type HookPhase = "PreToolUse" | "PostToolUse";
export type ToolTarget = "Bash" | "Write" | "Edit" | "Read" | "Grep";

export interface YaraRule {
  name: string;
  description: string;
  severity: YaraSeverity;
  category: YaraCategory;
  appliesTo: Array<{ phase: HookPhase; tool: ToolTarget }>;
  patterns: RegExp[];
}

export interface YaraMatch {
  rule: YaraRule;
  matchedText: string;
  offset: number;
}

export type ScanResult =
  | { matched: false }
  | { matched: true; matches: YaraMatch[] };

// ─── Rule Definitions ────────────────────────────────────────────

const POST_WRITE_EDIT: Array<{ phase: HookPhase; tool: ToolTarget }> = [
  { phase: "PostToolUse", tool: "Write" },
  { phase: "PostToolUse", tool: "Edit" },
];

const POST_READ_GREP: Array<{ phase: HookPhase; tool: ToolTarget }> = [
  { phase: "PostToolUse", tool: "Read" },
  { phase: "PostToolUse", tool: "Grep" },
];

const PRE_BASH: Array<{ phase: HookPhase; tool: ToolTarget }> = [
  { phase: "PreToolUse", tool: "Bash" },
];

// ── §1 PostHog API Violations ────────────────────────────────────

const pii_in_capture_call: YaraRule = {
  name: "pii_in_capture_call",
  description:
    "Detects PII fields passed to posthog.capture() — violates 'NEVER send PII in capture()' commandment",
  severity: "high",
  category: "posthog_pii",
  appliesTo: POST_WRITE_EDIT,
  patterns: [
    /\.capture\s*\([^)]{0,200}email/i,
    /\.capture\s*\([^)]{0,200}phone/i,
    /\.capture\s*\([^)]{0,200}full[_\s]?name/i,
    /\.capture\s*\([^)]{0,200}first[_\s]?name/i,
    /\.capture\s*\([^)]{0,200}last[_\s]?name/i,
    /\.capture\s*\([^)]{0,200}(street|mailing|home|billing)[_\s]?address/i,
    /\.capture\s*\([^)]{0,200}(ssn|social[_\s]?security)/i,
    /\.capture\s*\([^)]{0,200}(date[_\s]?of[_\s]?birth|dob|birthday)/i,
    /\.capture\s*\([^)]{0,200}\$ip/,
    /\.identify\s*\([^)]{0,200}(ssn|social[_\s]?security)/i,
    /\.identify\s*\([^)]{0,200}(card[_\s]?number|cvv|credit[_\s]?card)/i,
    /\.identify\s*\([^)]{0,200}(date[_\s]?of[_\s]?birth|dob|birthday)/i,
    /\.identify\s*\([^)]{0,200}(street|mailing|home|billing)[_\s]?address/i,
    /\$set[^}]{0,200}email/i,
    /\$set[^}]{0,200}phone/i,
  ],
};

const hardcoded_posthog_key: YaraRule = {
  name: "hardcoded_posthog_key",
  description:
    "Detects hardcoded PostHog API keys in source — violates 'use environment variables' commandment",
  severity: "high",
  category: "posthog_hardcoded_key",
  appliesTo: POST_WRITE_EDIT,
  patterns: [
    /phc_[a-zA-Z0-9]{20,}/,
    /phx_[a-zA-Z0-9]{20,}/,
    /apiKey\s*[:=]\s*['"][a-zA-Z0-9_]{20,}['"]/,
    /api_key\s*[:=]\s*['"][a-zA-Z0-9_]{20,}['"]/,
    /POSTHOG_KEY\s*[:=]\s*['"][a-zA-Z0-9_]{20,}['"]/,
  ],
};

const autocapture_disabled: YaraRule = {
  name: "autocapture_disabled",
  description:
    "Detects agent disabling autocapture — violates 'don't disable autocapture' commandment",
  severity: "medium",
  category: "posthog_autocapture",
  appliesTo: POST_WRITE_EDIT,
  patterns: [
    /autocapture\s*:\s*false/,
    /autocapture\s*:\s*'false'/,
    /autocapture\s*:\s*"false"/,
    /autocapture\s*=\s*False/,
    /disable_autocapture\s*[:=]\s*(true|True|1)/,
  ],
};

const hardcoded_posthog_host: YaraRule = {
  name: "hardcoded_posthog_host",
  description:
    "Detects hardcoded PostHog host URLs in source — should use environment variables",
  severity: "high",
  category: "posthog_hardcoded_key",
  appliesTo: POST_WRITE_EDIT,
  patterns: [/['"]https:\/\/(us|eu)\.i\.posthog\.com['"]/],
};

const session_recording_disabled: YaraRule = {
  name: "session_recording_disabled",
  description: "Detects agent disabling session recording",
  severity: "medium",
  category: "posthog_config",
  appliesTo: POST_WRITE_EDIT,
  patterns: [
    /disable_session_recording\s*:\s*true/i,
    /disable_session_recording\s*=\s*True/,
  ],
};

const opt_out_capturing: YaraRule = {
  name: "opt_out_capturing",
  description: "Detects agent opting out of PostHog capturing entirely",
  severity: "medium",
  category: "posthog_config",
  appliesTo: POST_WRITE_EDIT,
  patterns: [/opt_out_capturing/i, /opted_out\s*[:=]\s*(true|True|1)/i],
};

// ── §2 Prompt Injection ──────────────────────────────────────────

const prompt_injection_wizard_override: YaraRule = {
  name: "prompt_injection_wizard_override",
  description:
    "Detects classic prompt injection attempting to override agent instructions",
  severity: "critical",
  category: "prompt_injection",
  appliesTo: POST_READ_GREP,
  patterns: [
    /ignore previous instructions/i,
    /disregard all/i,
    /forget your instructions/i,
    /override your rules/i,
    /act as a different/i,
    /new instructions:/i,
  ],
};

const prompt_injection_wizard_specific: YaraRule = {
  name: "prompt_injection_wizard_specific",
  description:
    "Detects wizard-specific manipulation or tool abuse attempts in project files",
  severity: "medium",
  category: "prompt_injection",
  appliesTo: POST_READ_GREP,
  patterns: [
    /skip posthog/i,
    /do not install posthog/i,
    /remove posthog/i,
    /uninstall posthog/i,
    /delete the posthog/i,
    /run the following command/i,
    /execute this shell command/i,
    /you are now/i,
  ],
};

const prompt_injection_base64: YaraRule = {
  name: "prompt_injection_base64",
  description:
    "Detects suspicious base64-encoded blocks in file content that may contain obfuscated prompt injection",
  severity: "critical",
  category: "prompt_injection",
  appliesTo: POST_READ_GREP,
  patterns: [
    /(?:\/\/|#|\/\*)\s*[A-Za-z0-9+/]{100,}={0,2}/,
  ],
};

// ── §3 Secret Exfiltration ───────────────────────────────────────

const secret_exfiltration_via_command: YaraRule = {
  name: "secret_exfiltration_via_command",
  description:
    "Detects shell commands attempting to exfiltrate secrets or credentials",
  severity: "critical",
  category: "exfiltration",
  appliesTo: PRE_BASH,
  patterns: [
    /curl\s+.*\$\{?[A-Z_]*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)/i,
    /wget\s+.*\$\{?[A-Z_]*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)/i,
    /(\$\{?[A-Z_]*(KEY|TOKEN|SECRET|PASSWORD)|\.env|credentials)\S*.*\|\s*curl/i,
    /(\$\{?[A-Z_]*(KEY|TOKEN|SECRET|PASSWORD)|\.env|credentials)\S*.*\|\s*wget/i,
    /\|\s*nc\s/,
    /\|\s*netcat\s/,
    /base64.*\|\s*(curl|wget|nc\s)/i,
    /cat\s+.*\.env.*\|\s*(curl|wget)/,
    /curl.*phc_[a-zA-Z0-9]/,
    /wget.*phc_[a-zA-Z0-9]/,
  ],
};

// ── §4 Filesystem Safety ─────────────────────────────────────────

const destructive_rm: YaraRule = {
  name: "destructive_rm",
  description: "Detects rm -rf or rm -r commands that could mass-delete files",
  severity: "critical",
  category: "filesystem_safety",
  appliesTo: PRE_BASH,
  patterns: [
    // Combined flags: rm -rf, rm -fr, rm -rfi, etc.
    /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b/,
    // Separated flags: rm -r -f, rm -f -r (with optional other flags)
    /\brm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*r[a-zA-Z]*\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*f\b/,
    /\brm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*f[a-zA-Z]*\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*r\b/,
  ],
};

const git_force_push: YaraRule = {
  name: "git_force_push",
  description: "Detects git push --force which can overwrite remote history",
  severity: "critical",
  category: "filesystem_safety",
  appliesTo: PRE_BASH,
  patterns: [/git\s+push\s+.*--force/, /git\s+push\s+.*-f\b/],
};

const git_reset_hard: YaraRule = {
  name: "git_reset_hard",
  description:
    "Detects git reset --hard which discards all uncommitted changes",
  severity: "critical",
  category: "filesystem_safety",
  appliesTo: PRE_BASH,
  patterns: [/git\s+reset\s+--hard/],
};

// ── §5 Supply Chain ──────────────────────────────────────────────

const wrong_posthog_package: YaraRule = {
  name: "wrong_posthog_package",
  description:
    "Detects installing the wrong PostHog npm package — should be posthog-js or posthog-node",
  severity: "high",
  category: "supply_chain",
  appliesTo: PRE_BASH,
  patterns: [
    /npm\s+install\s+(?:--save\s+|--save-dev\s+|-[SD]\s+)*posthog(?!\s*-)/,
    /pnpm\s+(?:add|install)\s+(?:--save\s+|--save-dev\s+|-[SD]\s+)*posthog(?!\s*-)/,
    /yarn\s+add\s+(?:--dev\s+|-D\s+)*posthog(?!\s*-)/,
    /bun\s+(?:add|install)\s+(?:--dev\s+|-[dD]\s+)*posthog(?!\s*-)/,
  ],
};

const npm_install_global: YaraRule = {
  name: "npm_install_global",
  description:
    "Detects global npm installs — should never install packages globally",
  severity: "high",
  category: "supply_chain",
  appliesTo: PRE_BASH,
  patterns: [/npm\s+install\s+-g\b/, /npm\s+install\s+--global\b/],
};

// ─── Rule Registry ───────────────────────────────────────────────

export const RULES: YaraRule[] = [
  pii_in_capture_call,
  hardcoded_posthog_key,
  autocapture_disabled,
  hardcoded_posthog_host,
  session_recording_disabled,
  opt_out_capturing,
  prompt_injection_wizard_override,
  prompt_injection_wizard_specific,
  prompt_injection_base64,
  secret_exfiltration_via_command,
  destructive_rm,
  git_force_push,
  git_reset_hard,
  wrong_posthog_package,
  npm_install_global,
];

// ─── Scan Engine ─────────────────────────────────────────────────

export function scan(
  content: string,
  phase: HookPhase,
  tool: ToolTarget,
): ScanResult {
  const applicableRules = RULES.filter((r) =>
    r.appliesTo.some((a) => a.phase === phase && a.tool === tool),
  );

  const matches: YaraMatch[] = [];
  for (const rule of applicableRules) {
    for (const pattern of rule.patterns) {
      const match = pattern.exec(content);
      if (match) {
        matches.push({
          rule,
          matchedText: match[0],
          offset: match.index,
        });
        break;
      }
    }
  }

  return matches.length > 0 ? { matched: true, matches } : { matched: false };
}
