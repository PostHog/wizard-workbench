import json, os, gzip, zlib
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request, urllib.parse, ssl

REAL_HOST = "https://us.i.posthog.com"

def decode_response(data, encoding):
    if encoding == 'gzip':
        return gzip.decompress(data)
    elif encoding == 'deflate':
        return zlib.decompress(data)
    return data

class MockHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        import sys
        print(f"[MOCK] {format % args}", file=sys.stderr, flush=True)
    
    def send_json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    
    def proxy_to_posthog(self, body=None, method=None):
        try:
            actual_url = REAL_HOST + self.path
            req = urllib.request.Request(actual_url, data=body, method=method or ('POST' if body else 'GET'))
            for key in self.headers:
                if key.lower() not in ('host', 'content-length', 'accept-encoding'):
                    req.add_header(key, self.headers[key])
            if body:
                req.add_header('Content-Length', str(len(body)))
            req.add_header('Accept-Encoding', 'identity')
            ctx = ssl.create_default_context()
            with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)
                for key, val in resp.headers.items():
                    if key.lower() not in ('transfer-encoding', 'content-encoding'):
                        self.send_header(key, val)
                self.end_headers()
                self.wfile.write(resp_body)
        except urllib.error.HTTPError as e:
            resp_body = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(resp_body)
        except Exception as e:
            import traceback; traceback.print_exc()
            body_err = str(e).encode()
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(body_err)
    
    def do_GET(self):
        if '@current' in self.path and 'personal_api_keys' in self.path:
            self.send_json(200, {
                'id': 'mUZTpQNsfuDbYpr5kcH4fViBTQFoMZFzJMaxqfJsqfcp',
                'label': 'Wizard CI',
                'scopes': ['user:read','project:read','llm_gateway:read','dashboard:write','insight:write','query:read','error_tracking:write','llm_analytics:write','notebook:write','notebook:read','event_definition:write'],
                'scoped_teams': [483112],
                'scoped_organizations': []
            })
            return
        self.proxy_to_posthog()
    
    def do_POST(self):
        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len)
        self.proxy_to_posthog(body=body, method='POST')
    
    def do_PATCH(self):
        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len)
        self.proxy_to_posthog(body=body, method='PATCH')

server = HTTPServer(('127.0.0.1', 18012), MockHandler)
print('Mock server v3 listening on 127.0.0.1:18012', flush=True)
server.serve_forever()
