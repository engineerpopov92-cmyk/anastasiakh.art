"""
Anastasia Kh. - Local Web Server
Supports both HTTP (port 8000) and HTTPS (port 443) for https://anastasiakh.art/
"""

import sys
import os
import socket
import ssl
import threading
import argparse
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Ensure UTF-8 output on Windows consoles
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except AttributeError:
        pass

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CERT_FILE = os.path.join(DIRECTORY, 'cert.pem')
KEY_FILE = os.path.join(DIRECTORY, 'key.pem')

class CustomHTTPHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Development headers: avoid aggressive caching
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        mime_type = super().guess_type(path)
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.css'):
            return 'text/css; charset=utf-8'
        elif path.endswith('.html'):
            return 'text/html; charset=utf-8'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        return mime_type

    def log_message(self, format, *args):
        code = args[1] if len(args) > 1 else ''
        sys.stdout.write(f"[{code}] {args[0]}\n")
        sys.stdout.flush()

def check_hosts_file():
    hosts_path = r"C:\Windows\System32\drivers\etc\hosts"
    try:
        with open(hosts_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            return 'anastasiakh.art' in content
    except Exception:
        return False

def find_available_port(start_port=8000, max_attempts=50):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    return start_port

def run_servers(http_port=8000, enable_https=True, auto_open=True):
    servers = []
    threads = []
    
    hosts_configured = check_hosts_file()

    print("=" * 65)
    print("Anastasia Kh. - Local Web Server")
    print(f"Directory: {DIRECTORY}")
    print("=" * 65)

    # 1. HTTPS Server (Port 443)
    https_active = False
    if enable_https and os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE):
        try:
            https_server = HTTPServer(('0.0.0.0', 443), CustomHTTPHandler)
            ssl_ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            ssl_ctx.load_cert_chain(CERT_FILE, KEY_FILE)
            https_server.socket = ssl_ctx.wrap_socket(https_server.socket, server_side=True)
            
            t_https = threading.Thread(target=https_server.serve_forever, daemon=True)
            t_https.start()
            servers.append(https_server)
            threads.append(t_https)
            https_active = True

            print(" [HTTPS Active]")
            if hosts_configured:
                print("   👉 https://anastasiakh.art")
                print("   👉 https://localhost")
            else:
                print("   👉 https://localhost")
                print("   (Run setup_domain.bat once to enable https://anastasiakh.art)")
        except Exception as e:
            print(f" [HTTPS Warning] Could not start port 443: {e}")
            print(" Continuing with HTTP server...")

    # 2. HTTP Server (Port 8000)
    actual_http_port = find_available_port(http_port)
    http_server = HTTPServer(('0.0.0.0', actual_http_port), CustomHTTPHandler)
    t_http = threading.Thread(target=http_server.serve_forever, daemon=True)
    t_http.start()
    servers.append(http_server)
    threads.append(t_http)

    print("\n [HTTP Active]")
    print(f"   👉 http://localhost:{actual_http_port}")
    print("=" * 65)
    print("Server running. Press Ctrl+C to stop.\n")

    # Browser launch target
    if auto_open:
        if https_active and hosts_configured:
            target_url = "https://anastasiakh.art"
        elif https_active:
            target_url = "https://localhost"
        else:
            target_url = f"http://localhost:{actual_http_port}"

        try:
            webbrowser.open(target_url)
        except Exception:
            pass

    try:
        # Keep main thread alive
        for t in threads:
            t.join()
    except KeyboardInterrupt:
        print("\nStopping local servers...")
        for s in servers:
            try:
                s.server_close()
            except Exception:
                pass
        print("Servers stopped cleanly. Goodbye!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run local server for Anastasia Kh. website")
    parser.add_argument('--port', type=int, default=8000, help="Preferred HTTP port (default: 8000)")
    parser.add_argument('--no-https', action='store_true', help="Disable HTTPS on port 443")
    parser.add_argument('--no-browser', action='store_true', help="Do not open browser automatically")
    args = parser.parse_args()

    run_servers(http_port=args.port, enable_https=not args.no_https, auto_open=not args.no_browser)
