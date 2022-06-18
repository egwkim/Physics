import http.server
import socketserver

PORT = 8000
DIRECTORY = 'dist'


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


def run():
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print("Serving at port", PORT)
        print(f'http://127.0.0.1:{PORT}/')
        httpd.serve_forever()


if __name__ == '__main__':
    run()
