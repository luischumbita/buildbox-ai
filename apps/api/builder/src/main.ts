import '../style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from  './files';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { ServerStatus, DOMElements } from './types';

let webcontainerInstance: WebContainer;
let currentFilePath: string = 'index.ts';
import { generateFilesFromPrompt } from "./services/service";


/** @type {DOMElements} */
const domElements: DOMElements = {
  textareaEl: null,
  iframeEl: null,
  terminalMountEl: null,
  fileListEl: null,
  currentFileNameEl: null,
};

window.addEventListener('load', async () => {
  buildAppShell();

  const fitAddon = new FitAddon();

  const terminal = new Terminal({
    convertEol: true,
  });
  terminal.loadAddon(fitAddon);
  if (domElements.terminalMountEl) {
    terminal.open(domElements.terminalMountEl);
  }

  fitAddon.fit();

  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  // initialize file list and editor
  await refreshFileList();
  await openFile(currentFilePath);

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    if (domElements.iframeEl) domElements.iframeEl.src = url;
    
    // Actualizar estado del servidor
    updateServerStatus('running', `Running on port ${port}`);
    
    // Mostrar mensaje en el terminal cuando el servidor esté listo
    if (domElements.terminalMountEl) {
      const terminal = domElements.terminalMountEl.querySelector('.xterm');
      if (terminal) {
        // Encontrar el terminal activo y escribir el mensaje
        const activeTerminal = (terminal as any).terminal;
        if (activeTerminal) {
          activeTerminal.write('\r\nServidor listo!\r\n');
          activeTerminal.write(`URL: ${url}\r\n`);
          activeTerminal.write('La aplicación se está ejecutando en el preview\r\n\r\n');
        }
      }
    }
  });

  const shellProcess = await startShell(terminal);
  window.addEventListener('resize', () => {
    fitAddon.fit();
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  });
});

/**
 * @param {Terminal} terminal
 */
async function startShell(terminal: Terminal) {
  const shellProcess = await webcontainerInstance.spawn('jsh', {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  });
  
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  const input = shellProcess.input.getWriter();

  terminal.onData((data) => {
    input.write(data);
  });

  // Ejecutar comandos automáticamente
  await executeAutoCommands(terminal, input);

  return shellProcess;
}

/**
 * Genera archivos a partir de un prompt
 * @param prompt - El prompt para generar los archivos
 */
async function handlePrompt(prompt: string) {
  const generatedFiles = await generateFilesFromPrompt(prompt);

  for (const [path, content] of Object.entries(generatedFiles)) {
    await webcontainerInstance.fs.writeFile(`/${path}`, content as string);
  }

  // refrescar la UI de archivos
  await refreshFileList();
  
  // abrir el primer archivo generado
  const firstFile = Object.keys(generatedFiles)[0];
  if (firstFile) await openFile(firstFile);
}

/**
 * Ejecuta comandos automáticamente al iniciar
 */
async function executeAutoCommands(terminal: Terminal, input: WritableStreamDefaultWriter<string>) {
  try {
    // Actualizar estado del servidor
    updateServerStatus('starting', 'Installing dependencies...');
    
    // Esperar un poco para que el shell esté listo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    terminal.write('\r\nIniciando configuración automática...\r\n');
    terminal.write('Instalando dependencias...\r\n');
    
    // Commented out the installation of dependencies
    /*
    await executeCommand(input, 'npm install');
    
    // Esperar a que termine la instalación (más tiempo para npm install)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    terminal.write('\r\nDependencias instaladas correctamente\r\n');
    terminal.write('Iniciando servidor...\r\n');
    
    // Actualizar estado del servidor
    updateServerStatus('starting', 'Starting server...');
    
    // Commented out the starting of the server
    await executeCommand(input, 'npm start');
    
    terminal.write('\r\nServidor iniciado automáticamente!\r\n');
    */
   //Funcion para react app
   //await executeCommand(input, 'npx create-react-app .');
    
  } catch (error) {
    updateServerStatus('error', 'Configuration failed');
    terminal.write('\r\nError durante la configuración automática\r\n');
    terminal.write('Puedes ejecutar los comandos manualmente:\r\n');
    terminal.write('   npm install\r\n');
    terminal.write('   npm start\r\n\r\n');
  }
}

/**
 * Ejecuta un comando en el terminal
 */
async function executeCommand(input: WritableStreamDefaultWriter<string>, command: string) {
  try {
    // Escribir el comando
    input.write(command + '\n');
    
    // Esperar un poco para que se procese
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error ejecutando comando:', error);
  }
}

/**
 * @param {string} content
 */

async function writeCurrentFile(content: string) {
  if (!webcontainerInstance || !currentFilePath) return;
  await webcontainerInstance.fs.writeFile(`/${currentFilePath}`, content);
}

function buildAppShell() {
  const app = document.querySelector('#app');
  if (!app) return;
  app.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex gap-4">
        <aside class="w-64 bg-white border rounded-lg flex flex-col overflow-hidden">
          <div class="px-3 py-2 border-b flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Files</span>
          </div>
          <ul id="fileList" class="flex-1 overflow-auto divide-y"></ul>
        </aside>
        <main class="flex-1 flex flex-col gap-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border rounded-lg overflow-hidden bg-white">
              <div class="px-3 py-2 border-b flex items-center justify-between">
                <input id="promptInput" 
                type="text" 
                placeholder="Escribe tu prompt (ej: slider, formulario, etc)" 
                class="text-sm px-2 py-1 border rounded w-full" />
                <button id="generateBtn" 
                class="ml-2 text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
                Generate
              </button>
            </div>
              <div class="px-3 py-2 border-b flex items-center justify-between">
                <span id="currentFileName" class="text-sm text-gray-700"></span>
                <div class="space-x-2">
                  <button id="renameFileBtn" class="text-xs px-2 py-1 rounded border text-gray-700 hover:bg-gray-50">Rename</button>
                  <button id="deleteFileBtn" class="text-xs px-2 py-1 rounded border text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
              <div class="p-0">
                <textarea class="w-full h-80 resize-none bg-black text-white p-3 text-sm font-mono" placeholder="Start typing..."></textarea>
              </div>
            </div>
            <div class="border rounded-lg overflow-hidden bg-white">
              <div class="px-3 py-2 border-b flex items-center justify-between">
                <span class="text-sm text-gray-700">Preview</span>
                <div class="flex items-center space-x-2">
                  <div id="serverStatus" class="flex items-center space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span class="text-xs text-gray-500">Starting...</span>
                  </div>
                </div>
              </div>
              <div class="p-0">
                <iframe class="w-full h-80 border-0" src="loading.html"></iframe>
              </div>
            </div>
          </div>
          <div class="border rounded-lg overflow-hidden bg-white">
            <div class="px-3 py-2 border-b flex items-center justify-between">
              <span class="text-sm text-gray-700">Terminal</span>
              <div class="flex items-center space-x-2">
                <button id="restartServerBtn" class="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">Restart Server</button>
                <button id="clearTerminalBtn" class="text-xs px-2 py-1 rounded border text-gray-700 hover:bg-gray-50">Clear</button>
              </div>
            </div>
            <div class="p-2">
              <div id="terminal" class="w-full h-64"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  domElements.iframeEl = document.querySelector('iframe');
  domElements.textareaEl = document.querySelector('textarea');
  domElements.terminalMountEl = document.querySelector('#terminal');
  domElements.fileListEl = document.querySelector('#fileList');
  domElements.currentFileNameEl = document.querySelector('#currentFileName');
  const promptInput = document.querySelector('#promptInput');
  const generateBtn = document.querySelector('#generateBtn');


generateBtn?.addEventListener('click', async () => {
  const prompt = (promptInput as HTMLInputElement).value.trim();
  if (!prompt) return;
  await handlePrompt(prompt);
});

  if (domElements.textareaEl) {
    domElements.textareaEl.addEventListener('input', (e) => {
      const val = (e.currentTarget as HTMLTextAreaElement).value;
      writeCurrentFile(val);
    });
  }

  const newFileBtn = document.querySelector('#newFileBtn');
  newFileBtn?.addEventListener('click', async () => {
    const name = prompt('New file name (e.g. notes.txt):');
    if (!name) return;
    await createFile(name.trim());
  });

  const renameBtn = document.querySelector('#renameFileBtn');
  renameBtn?.addEventListener('click', async () => {
    if (!currentFilePath) return;
    const next = prompt('Rename file to:', currentFilePath);
    if (!next || next === currentFilePath) return;
    await renameFile(currentFilePath, next.trim());
  });

  const deleteBtn = document.querySelector('#deleteFileBtn');
  deleteBtn?.addEventListener('click', async () => {
    if (!currentFilePath) return;
    const ok = confirm(`Delete ${currentFilePath}?`);
    if (!ok) return;
    await deleteFile(currentFilePath);
  });

  

  // Botón para reiniciar el servidor
  const restartServerBtn = document.querySelector('#restartServerBtn');
  restartServerBtn?.addEventListener('click', async () => {
    if (confirm('¿Reiniciar el servidor?')) {
      await restartServer();
    }
  });

  // Botón para limpiar el terminal
  const clearTerminalBtn = document.querySelector('#clearTerminalBtn');
  clearTerminalBtn?.addEventListener('click', () => {
    if (domElements.terminalMountEl) {
      const terminal = domElements.terminalMountEl.querySelector('.xterm');
      if (terminal) {
        const activeTerminal = (terminal as any).terminal;
        if (activeTerminal) {
          activeTerminal.clear();
        }
      }
    }
  });
}

/**
 * Reinicia el servidor
 */
async function restartServer() {
  try {
    // Encontrar el terminal activo
    if (domElements.terminalMountEl) {
      const terminal = domElements.terminalMountEl.querySelector('.xterm');
      if (terminal) {
        const activeTerminal = (terminal as any).terminal;
        if (activeTerminal) {
          activeTerminal.write('\r\nReiniciando servidor...\r\n');
          
          // Enviar Ctrl+C para detener el proceso actual
          const input = activeTerminal.input;
          if (input) {
            input.write('\x03'); // Ctrl+C
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Ejecutar npm start nuevamente
            input.write('npm start\n');
            activeTerminal.write('\r\nServidor reiniciado\r\n\r\n');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reiniciando servidor:', error);
  }
}

/**
 * Actualiza el estado del servidor en la UI
 */
function updateServerStatus(status: ServerStatus, message?: string) {
  const statusEl = document.querySelector('#serverStatus');
  if (!statusEl) return;

  const dot = statusEl.querySelector('div');
  const text = statusEl.querySelector('span');

  if (dot && text) {
    switch (status) {
      case 'starting':
        dot.className = 'w-2 h-2 bg-yellow-400 rounded-full animate-pulse';
        text.textContent = message || 'Starting...';
        text.className = 'text-xs text-yellow-600';
        break;
      case 'running':
        dot.className = 'w-2 h-2 bg-green-400 rounded-full';
        text.textContent = message || 'Running';
        text.className = 'text-xs text-green-600';
        break;
      case 'error':
        dot.className = 'w-2 h-2 bg-red-400 rounded-full';
        text.textContent = message || 'Error';
        text.className = 'text-xs text-red-600';
        break;
    }
  }
}

async function refreshFileList() {
  let entries = [];
  try {
    const names = await webcontainerInstance.fs.readdir('/');
    entries = Array.isArray(names) ? names : Object.keys(names);
  } catch {
    entries = Object.keys(files);
  }
  entries = entries.filter((n) => !n.startsWith('.') && !n.startsWith('node_modules'));

  if (domElements.fileListEl) {
    domElements.fileListEl.innerHTML = '';
    for (const name of entries) {
      const li = document.createElement('li');
      li.className = `px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${name === currentFilePath ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`;
      li.textContent = name;
      li.addEventListener('click', async () => {
        await openFile(name);
      });
      domElements.fileListEl.appendChild(li);
    }
  }
}

async function openFile(path: string) {
  currentFilePath = path;
  try {
    const content = await webcontainerInstance.fs.readFile(`/${path}`, 'utf-8');
    if (domElements.textareaEl) domElements.textareaEl.value = /** @type {string} */ (content);
  } catch {
    const initial = files[path as keyof typeof files]?.file?.contents ?? '';
    if (domElements.textareaEl) domElements.textareaEl.value = initial;
  }
  if (domElements.currentFileNameEl) domElements.currentFileNameEl.textContent = path;
  await refreshFileList();
}

async function createFile(path: string) {
  try {
    await webcontainerInstance.fs.writeFile(`/${path}`, '');
  } catch {
    // noop
  }
  await refreshFileList();
  await openFile(path);
}

async function deleteFile(path: string) {
  try {
    await webcontainerInstance.fs.rm(`/${path}`);
  } catch {
    // noop
  }
  // pick another file
  let next = 'index.ts';
  try {
    const names = await webcontainerInstance.fs.readdir('/');
    const list = Array.isArray(names) ? names : Object.keys(names);
    const remaining = list.filter((n) => n !== path);
    next = remaining[0] || 'index.ts';
  } catch {
    // noop
  }
  await refreshFileList();
  if (next) await openFile(next);
}

async function renameFile(oldPath: string, newPath: string) {
  if (oldPath === newPath) return;
  try {
    if (typeof webcontainerInstance.fs.rename === 'function') {
      await webcontainerInstance.fs.rename(`/${oldPath}`, `/${newPath}`);
    } else {
      const content = await webcontainerInstance.fs.readFile(`/${oldPath}`, 'utf-8');
      await webcontainerInstance.fs.writeFile(`/${newPath}`, /** @type {string} */(content));
      await webcontainerInstance.fs.rm(`/${oldPath}`);
    }
  } catch {
    // noop
  }
  await refreshFileList();
  await openFile(newPath);
}
