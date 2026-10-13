import { isIP } from "node:net";

const NETWORK_SCHEMES = new Set([
  "", "ftp", "http", "gopher", "nntp", "telnet", "imap", "wais", "file", "mms", "https",
  "shttp", "snews", "prospero", "rtsp", "rtsps", "rtspu", "rsync", "svn", "svn+ssh",
  "sftp", "nfs", "git", "git+ssh", "ws", "wss", "itms-services",
]);

export function normalizeDocUrl(url: string): string {
  let remainder = url.replace(/^[\p{White_Space}\u001c-\u001f]+|[\p{White_Space}\u001c-\u001f]+$/gu, "")
    .replace(/^[\x00-\x20]+/, "").replace(/[\t\r\n]/g, "");
  const schemeMatch = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(remainder);
  const scheme = schemeMatch?.[1].toLowerCase() ?? "";
  if (schemeMatch) remainder = remainder.slice(schemeMatch[0].length);
  let authority = "";
  if (remainder.startsWith("//")) {
    const authorityEnd = remainder.slice(2).search(/[/?#]/);
    const boundary = authorityEnd < 0 ? remainder.length : authorityEnd + 2;
    authority = remainder.slice(2, boundary);
    remainder = remainder.slice(boundary);
  }
  const normalizedAuthority = authority.replace(/[@:#?]/g, "").normalize("NFKC");
  if (/[/?#@:]/.test(normalizedAuthority)) return "";
  const hostAndPort = authority.slice(authority.lastIndexOf("@") + 1);
  let host = hostAndPort.split(":", 1)[0];
  let portText = hostAndPort.includes(":") ? hostAndPort.slice(hostAndPort.indexOf(":") + 1) : "";
  if (hostAndPort.includes("[") || hostAndPort.includes("]")) {
    const bracketMatch = /^\[([^\]]+)\](.*)$/.exec(hostAndPort);
    if (!bracketMatch) return "";
    host = bracketMatch[1];
    const address = host.split("%", 1)[0];
    if (isIP(address) !== 6 && !/^v[0-9a-fA-F]+\..+$/.test(host)) return "";
    portText = bracketMatch[2].includes(":") ? bracketMatch[2].slice(bracketMatch[2].indexOf(":") + 1) : "";
  }
  if (portText && (!/^[0-9]+$/.test(portText) || Number(portText) > 65535)) return "";
  host = host.toLowerCase();
  if (host.startsWith("www.")) host = host.slice(4);
  const port = portText ? Number(portText) : null;
  const isDefaultPort = (scheme === "http" && port === 80) || (scheme === "https" && port === 443);
  const netloc = port === null || isDefaultPort ? host : `${host}:${port}`;
  let path = remainder.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  if (netloc || (scheme && NETWORK_SCHEMES.has(scheme) && !path.startsWith("//"))) {
    if (path && !path.startsWith("/")) path = `/${path}`;
    path = `//${netloc}${path}`;
  }
  return scheme ? `${scheme}:${path}` : path;
}

export function isCommunityQuestionUrl(url: string): boolean {
  return /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)?\/\/posthog\.com(?::[0-9]+)?\/questions\//.test(normalizeDocUrl(url));
}

export function uniqueNormalized(urls: Iterable<string>): string[] {
  return [...new Set(Array.from(urls, normalizeDocUrl).filter(Boolean))];
}
