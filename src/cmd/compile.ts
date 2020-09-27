import { serve, exec, minify } from '../deps.ts';
import { createServer } from './server.ts';

const watcher = Deno.watchFs(['./app']);

let serverGen = createServer();
let server = await serverGen.next();
// not awaited
serverGen.next();

await compile();

for await (const event of watcher) {
  await compile(event);
}

async function compile(event: any = null) {
  const [ errors, emitted ] = await Deno.bundle('./app/main.tsx', undefined, {
      'jsx': 'react',
      'lib': [ 'dom', 'esnext' ],
      'target': 'es5',
  });

  if (!errors) {
    const bytesWrittenA = writeToFile(emitted, './dist/bundle.js');
    console.log(`Wrote ${bytesWrittenA} unminified bytes`);

    const minified = await minify(emitted);
    const bytesWritten = writeToFile(minified.code, './dist/bundle.min.js');

    console.log(`Wrote ${bytesWritten} minified bytes`);
  } else {
    console.log('Errors: ', errors);
  }
}

function writeToFile(content: string, path: string) {

  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const file = Deno.openSync(path, { write: true, create: true });
  const bytesWritten = Deno.writeSync(file.rid, data);
  Deno.close(file.rid);

  return bytesWritten;
}
