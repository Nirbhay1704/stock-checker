import http.server
import socketserver
import socket
import os
import sys

PORT = 3000

import json

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            data_path = os.path.join(os.path.dirname(__file__), 'data.json')
            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                default_data = {
                    "stocks": [],
                    "stockTypes": []
                }
                self.wfile.write(json.dumps(default_data).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/data':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            data_path = os.path.join(os.path.dirname(__file__), 'data.json')
            try:
                parsed_data = json.loads(post_data.decode('utf-8'))
                with open(data_path, 'w', encoding='utf-8') as f:
                    json.dump(parsed_data, f, indent=2, ensure_ascii=False)
                    
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def end_headers(self):
        super().end_headers()

def get_local_ips():
    ips = []
    # Try connecting to an external socket to find active interface IP
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Doesn't need to connect actually, just triggers routing lookup
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        if local_ip and not local_ip.startswith("127."):
            ips.append(local_ip)
    except Exception:
        pass
        
    # Fallback to hostname inspection
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if ip and not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
        
    return ips

if __name__ == "__main__":
    # Clear console (cross-platform)
    os.system('cls' if os.name == 'nt' else 'clear')
    
    local_ips = get_local_ips()
    
    print("\033[36m==================================================\033[0m")
    print("\033[35m           STOCK CHECKER PRO LOCAL SERVER         \033[0m")
    print("\033[36m==================================================\033[0m")
    print("\033[32m  Server is running!\033[0m")
    print(f"\033[33m  Local Access:      http://localhost:{PORT}\033[0m")
    
    if local_ips:
        print("\033[33m  Mobile Device IP:\033[0m")
        for ip in local_ips:
            print(f"\033[1m\033[32m    http://{ip}:{PORT}\033[0m")
    else:
        print("\033[31m  No local network connection detected.\033[0m")
        
    print("\033[36m--------------------------------------------------\033[0m")
    print("\033[37m  Instructions for Mobile:\033[0m")
    print("  1. Connect your phone and computer to the same Wi-Fi.")
    print("  2. Open the browser on your phone.")
    print("  3. Enter one of the \"Mobile Device IP\" links shown above.")
    print("  4. Tap the browser Menu and select \"Add to Home Screen\"")
    print("     to use it offline like a native app!")
    print("\033[36m==================================================\033[0m")
    print("  Press Ctrl+C to stop the server.")

    # Run the server
    handler = MyHTTPRequestHandler
    # Bind to 0.0.0.0 to listen on all interfaces (necessary for mobile access)
    with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            sys.exit(0)
