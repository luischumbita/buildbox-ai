import type { WebContainer } from '@webcontainer/api';
import { WebContainer as WebContainerApi } from '@webcontainer/api';

export type BootedContainer = {
  webcontainer: WebContainer;
  port: number;
  previewUrl: string;
};

let bootPromise: Promise<BootedContainer> | null = null;

export async function bootWebContainer(): Promise<BootedContainer> {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    const webcontainer = await WebContainerApi.boot({
      coep: 'credentialless',
      workdirName: 'buildbox',
      forwardPreviewErrors: true,
    });

    // Create a tiny Vite app skeleton
    await webcontainer.fs.mkdir('app', { recursive: true });
    await webcontainer.fs.writeFile('package.json', JSON.stringify({
      name: 'buildbox-preview',
      private: true,
      type: 'module',
      scripts: { dev: 'vite', start: 'vite preview --host', build: 'vite build' },
      devDependencies: { vite: '^5.4.2' }
    }, null, 2));

    await webcontainer.fs.writeFile('index.html', `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BuildBox Preview</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.js"></script>
  </body>
 </html>`);

    await webcontainer.fs.writeFile('main.js', `import '/styles.css';
const mount = document.getElementById('app');
mount.innerHTML = '<div>Ready</div>';
`);

    await webcontainer.fs.writeFile('styles.css', `:root{--color-primary:#6366f1}
body{font-family: system-ui, sans-serif; margin:0;}
`);

    return new Promise<BootedContainer>((resolve, reject) => {
      const exit = webcontainer.on('server-ready', (port, url) => {
        exit();
        resolve({ webcontainer, port, previewUrl: url });
      });

      webcontainer.spawn('bash', {
        terminal: {
          cols: 80,
          rows: 24,
        },
      }).then(async (process) => {
        const input = process.input.getWriter();
        const run = async (cmd: string) => {
          await input.write(new TextEncoder().encode(cmd + '\n'));
        };
        // Install vite and start dev server
        await run('pnpm i -D vite');
        await run('pnpm run dev');
      }).catch(reject);
    });
  })();

  return bootPromise;
}

export async function writeGeneratedProject(html: string, css: string, javascript: string) {
  const { webcontainer } = await bootWebContainer();
  // Replace entry with generated assets
  await webcontainer.fs.writeFile('styles.css', css);
  await webcontainer.fs.writeFile('main.js', `import '/styles.css';\n${javascript}`);
  await webcontainer.fs.writeFile('index.html', `<!doctype html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8"/>\n  <meta name="viewport" content="width=device-width, initial-scale=1"/>\n  <title>Preview</title>\n</head>\n<body>\n${html}\n<script type="module" src="/main.js"></script>\n</body>\n</html>`);
}


