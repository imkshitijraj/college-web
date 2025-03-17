from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

# File to store the visitor count
COUNTER_FILE = 'visitorCount.json'

class CounterHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/count':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            count = self.get_count()
            self.wfile.write(json.dumps({'count': count}).encode())
            return
            
        return SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        if self.path == '/api/increment':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            count = self.increment_count()
            self.wfile.write(json.dumps({'count': count}).encode())
            return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def get_count(self):
        if not os.path.exists(COUNTER_FILE):
            with open(COUNTER_FILE, 'w') as f:
                json.dump({'count': 0}, f)
            return 0
            
        with open(COUNTER_FILE, 'r') as f:
            data = json.load(f)
            return data.get('count', 0)
    
    def increment_count(self):
        count = self.get_count()
        count += 1
        
        with open(COUNTER_FILE, 'w') as f:
            json.dump({'count': count}, f)
            
        return count

if __name__ == '__main__':
    server = HTTPServer(('localhost', 3000), CounterHandler)
    print('Server running at http://localhost:3000')
    server.serve_forever()
