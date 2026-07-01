#!/usr/bin/env python3
"""Minimal static file server for local preview.
Serves this script's own directory on PORT (default 4321) without
relying on os.getcwd(), which is blocked in the preview sandbox.
"""
import functools
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4321

Handler = functools.partial(SimpleHTTPRequestHandler, directory=ROOT)
with ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
    print("Serving %s on http://127.0.0.1:%d" % (ROOT, PORT))
    httpd.serve_forever()
