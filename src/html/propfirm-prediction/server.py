"""
Foresight dev server — serves static files + proxies /api/polymarket/* to gamma-api.polymarket.com
Usage: python server.py 8091
"""
import sys
import http.server
import socketserver
import urllib.request
import urllib.error
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8091
ROOT = os.path.dirname(os.path.abspath(__file__))
UPSTREAMS = {
    "/api/polymarket": "https://gamma-api.polymarket.com",
    "/api/clob":       "https://clob.polymarket.com",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        for prefix, upstream in UPSTREAMS.items():
            if self.path.startswith(prefix + "/"):
                return self.proxy(prefix, upstream)
        return super().do_GET()

    def proxy(self, prefix, upstream):
        upstream_path = self.path[len(prefix):]  # keep leading /
        url = upstream + upstream_path
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "augure-dev/0.1"})
            with urllib.request.urlopen(req, timeout=15) as r:
                body = r.read()
                self.send_response(r.status)
                self.send_header("Content-Type", r.headers.get("Content-Type", "application/json"))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            self.send_response(502)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(str(e).encode())

    def log_message(self, fmt, *args):
        sys.stderr.write("[foresight] " + (fmt % args) + "\n")


if __name__ == "__main__":
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"Foresight dev server on http://localhost:{PORT}", flush=True)
        httpd.serve_forever()
