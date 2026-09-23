"""Run both real Wizard SDK adapters against a synthetic loopback gateway.

Requires mitmdump, installed dependencies in this workbench and the Wizard
checkout, and no PostHog credentials. The fake gateway and proxy listen on
loopback; a verifier-only guard rejects non-loopback proxy traffic.
"""

import argparse
from collections import Counter
from http.client import HTTPConnection
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import shutil
import socket
import subprocess
import tempfile
import time


ROOT = Path(__file__).resolve().parent.parent
SCENARIOS = json.loads((ROOT / 'proxy/scenarios.json').read_text())['scenarios']
SCENARIO = 'http_400_terminal'
HIT = re.compile(r'^wizard-fault scenario=(\S+) status=(\d+) path=(\S+) hit=(\d+)$', re.M)
RESULT = re.compile(r'^WIZARD_FAULT_RESULT (\{.*\})$', re.M)
PHW_ERROR = re.compile(r'^phw-error: (\{.*\})$', re.M)


class LocalGateway(BaseHTTPRequestHandler):
    paths = Counter()

    def do_POST(self):
        remaining = int(self.headers.get('Content-Length', '0'))
        while remaining:
            remaining -= len(self.rfile.read(min(remaining, 65536)))
        self.paths[self.path.split('?', 1)[0]] += 1
        self.send_response(418)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"error":{"message":"Unscoped loopback request"}}')

    def do_GET(self):
        self.paths[self.path.split('?', 1)[0]] += 1
        self.send_response(404)
        self.end_headers()

    def log_message(self, *_args):
        pass


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def wait_for_proxy(proc, port):
    for _ in range(100):
        if proc.poll() is not None:
            raise RuntimeError('mitmdump exited before listening')
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=0.2):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError('mitmdump did not listen within 10 seconds')


def stop_process(proc):
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait(timeout=5)


def verify_guard(proxy_port, upstream_port):
    """Exercise proxy egress control before any SDK traffic starts."""
    with socket.create_connection(('127.0.0.1', proxy_port), timeout=5) as tunnel:
        tunnel.settimeout(5)
        tunnel.sendall(b'CONNECT probe.invalid:443 HTTP/1.1\r\n'
                       b'Host: probe.invalid:443\r\n\r\n')
        status = tunnel.makefile('rb').readline()
        if not status.startswith(b'HTTP/1.1 421 '):
            raise AssertionError('Non-loopback HTTPS CONNECT was not blocked locally')

    external = HTTPConnection('127.0.0.1', proxy_port, timeout=5)
    try:
        external.request('GET', 'http://probe.invalid/egress-check')
        response = external.getresponse()
        response.read()
        if response.status != 421 or LocalGateway.paths:
            raise AssertionError('Non-loopback proxy request was not blocked locally')
    finally:
        external.close()

    loopback = HTTPConnection('127.0.0.1', proxy_port, timeout=5)
    try:
        loopback.request('GET', f'http://127.0.0.1:{upstream_port}/guard-probe')
        response = loopback.getresponse()
        response.read()
        if response.status != 404 or LocalGateway.paths['/guard-probe'] != 1:
            raise AssertionError('Loopback proxy request did not reach the fake gateway')
    finally:
        loopback.close()


def caller_evidence(stdout, stderr, result, harness):
    """Require independent human and machine error output from the caller."""
    if not result or not result.get('code') or not result.get('message'):
        raise AssertionError(f'{harness}: no error result to render')
    if harness == 'anthropic' and result.get('hasError') is not True:
        raise AssertionError('anthropic: caught SDK Error was not retained')

    rendered = f'✖  {result["message"]}'
    if f'\n{rendered}\n' not in f'\n{stdout}':
        raise AssertionError(f'{harness}: LoggingUI did not render the result on stdout')

    error_lines = PHW_ERROR.findall(stderr)
    if len(error_lines) != 1:
        raise AssertionError(f'{harness}: expected one phw-error line on stderr')
    try:
        machine_error = json.loads(error_lines[0])
    except json.JSONDecodeError as exc:
        raise AssertionError(f'{harness}: invalid phw-error JSON') from exc
    if (machine_error.get('code') != result['code'] or
            machine_error.get('message') != result['message']):
        raise AssertionError(f'{harness}: phw-error differs from RunResult')
    return {
        'headlessErrorShown': True,
        'machineError': {
            'code': machine_error['code'],
            'message': machine_error['message'],
        },
    }


def run_one(wizard, harness, timeout):
    with tempfile.TemporaryDirectory(prefix=f'wizard-fault-{harness}-') as td:
        temp = Path(td)
        (temp / 'app').mkdir()
        LocalGateway.paths = Counter()
        upstream = ThreadingHTTPServer(('127.0.0.1', 0), LocalGateway)
        from threading import Thread
        server_thread = Thread(target=upstream.serve_forever, daemon=True)
        server_thread.start()
        proxy_port = free_port()
        proxy_log = temp / 'proxy.log'
        with proxy_log.open('w') as log:
            proxy_env = {
                'PATH': os.environ['PATH'],
                'HOME': str(temp),
                'WIZARD_PROXY_SCENARIO': SCENARIO,
            }
            proxy = subprocess.Popen(
                ['mitmdump', '--quiet', '--listen-host', '127.0.0.1',
                 '--listen-port', str(proxy_port), '--set', 'flow_detail=0',
                 '-s', str(ROOT / 'proxy/loopback_guard.py'),
                 '-s', str(ROOT / 'proxy/faults.py')],
                cwd=ROOT, env=proxy_env, stdout=log, stderr=subprocess.STDOUT,
            )
            try:
                wait_for_proxy(proxy, proxy_port)
                verify_guard(proxy_port, upstream.server_port)
                gateway_url = f'http://127.0.0.1:{upstream.server_port}'
                env = {
                    'PATH': os.environ['PATH'],
                    'HOME': str(temp),
                    'TMPDIR': str(temp),
                    'USER': os.environ.get('USER', 'wizard-fault-probe'),
                    'LANG': os.environ.get('LANG', 'en_US.UTF-8'),
                    'HTTP_PROXY': f'http://127.0.0.1:{proxy_port}',
                    'HTTPS_PROXY': f'http://127.0.0.1:{proxy_port}',
                    'NODE_OPTIONS': f'-r {ROOT / "proxy/proxy-fetch-preload.cjs"}',
                    'MCP_URL': f'{gateway_url}/mcp',
                    'WIZARD_FAULT_GATEWAY_URL': gateway_url,
                    'WIZARD_FAULT_INSTALL_DIR': str(temp / 'app'),
                    'WIZARD_FAULT_HARNESS': harness,
                }
                try:
                    completed = subprocess.run(
                        ['node', '--import', 'tsx',
                         str(wizard / 'scripts/a3-fault-probe.no-jest.ts')],
                        cwd=wizard, env=env, text=True, capture_output=True,
                        timeout=timeout,
                    )
                except subprocess.TimeoutExpired as exc:
                    raise RuntimeError(f'{harness} probe timed out after {timeout}s') from exc
            finally:
                stop_process(proxy)
                upstream.shutdown()
                upstream.server_close()

        matches = HIT.findall(proxy_log.read_text())
        injected = [m for m in matches if m[0] == SCENARIO]
        result_match = RESULT.search(completed.stdout)
        result = json.loads(result_match.group(1)) if result_match else None
        summary = {
            'harness': harness,
            'scenario': SCENARIO,
            'status': SCENARIOS[SCENARIO]['status'],
            'path': '/v1/messages',
            'hitCount': len(injected),
            'proxyHits': [{'scenario': s, 'status': int(status), 'path': path,
                           'hit': int(hit)} for s, status, path, hit in matches],
            'upstreamPaths': dict(LocalGateway.paths),
            'result': result,
            'exitCode': completed.returncode,
            'egressGuard': 'external CONNECT and GET 421 locally; loopback 404 at fake gateway',
        }
        expected_hits = [(SCENARIO, '400', '/v1/messages', str(n))
                         for n in range(1, len(injected) + 1)]
        if not injected or matches != expected_hits or len(injected) > SCENARIOS[SCENARIO]['max_hits']:
            raise AssertionError(f'{harness}: scoped retries escaped the injected fault: {summary}')
        if LocalGateway.paths.get('/v1/messages', 0):
            raise AssertionError(f'{harness}: a gateway retry passed through: {summary}')
        if not result or result.get('outcome') != 'failed':
            raise AssertionError(f'{harness}: missing terminal failure: {summary}')
        if (result.get('code') != 'PHW_AGENT_API_ERROR' or
                'Synthetic Wizard proxy fault' not in result.get('message', '') or
                result.get('outroKind')):
            raise AssertionError(f'{harness}: incomplete terminal result: {summary}')
        summary.update(caller_evidence(completed.stdout, completed.stderr,
                                       result, harness))
        if completed.returncode != 1:
            raise AssertionError(f'{harness}: headless caller hid the error: {summary}')
        return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--wizard', type=Path, required=True,
                        help='Wizard checkout with dependencies installed')
    parser.add_argument('--harness', choices=('both', 'anthropic', 'pi'), default='both')
    parser.add_argument('--timeout', type=int, default=120)
    parser.add_argument('--evidence', type=Path)
    args = parser.parse_args()
    if not shutil.which('mitmdump') or not (ROOT / 'node_modules/undici').exists():
        parser.error('Install mitmproxy and run pnpm install in wizard-workbench')
    if not (args.wizard / 'node_modules/tsx').exists():
        parser.error('Run pnpm install in the Wizard checkout')
    if not (args.wizard / 'scripts/a3-fault-probe.no-jest.ts').exists():
        parser.error('The Wizard checkout needs scripts/a3-fault-probe.no-jest.ts')
    harnesses = ('anthropic', 'pi') if args.harness == 'both' else (args.harness,)
    summaries = [run_one(args.wizard.resolve(), h, args.timeout)
                 for h in harnesses]
    payload = {'verified': True, 'runs': summaries}
    if args.evidence:
        args.evidence.parent.mkdir(parents=True, exist_ok=True)
        args.evidence.write_text(json.dumps(payload, indent=2) + '\n')
    print(json.dumps(payload, indent=2))


if __name__ == '__main__':
    main()
