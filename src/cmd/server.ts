import { ServerRequest, serve } from '../deps.ts';

export async function* createServer() {
  const server = serve({ port: 8000 });
  console.log('http://localhost:8000/');
  yield server;

  for await (const req of server) {
    console.log(req.url);

    if (req.url === '/bundle.min.js') {
      respondFile(req, 'dist/bundle.min.js', 'application/javascript');
    } else if (req.url === '/bundle.js') {
      respondFile(req, 'dist/bundle.js', 'application/javascript');
    } else {
      respondFile(req, 'static/index.html', 'text/html');
    }
  }
}

async function respondFile(req: ServerRequest, path: string, mime = '') {
  const file = await Deno.open(path, { read: true });
  const body = await Deno.readAll(file);
  Deno.close(file.rid);
  req.respond({
    body,
    headers: new Headers({
      'Content-Type': mime,
    })
  });
}
