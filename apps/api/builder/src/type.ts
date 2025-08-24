// Tipos para el WebContainer
export interface WebContainerInstance {
    boot(): Promise<WebContainerInstance>;
    mount(files: FileSystemTree): Promise<void>;
    spawn(command: string, options?: SpawnOptions): Promise<Process>;
    fs: FileSystemAPI;
    on(event: string, callback: (...args: any[]) => void): void;
  }
  
  export interface FileSystemTree {
    [path: string]: FileSystemNode;
  }
  
  export interface FileSystemNode {
    file?: {
      contents: string;
    };
    directory?: FileSystemTree;
  }
  
  export interface FileSystemAPI {
    readdir(path: string): Promise<string[] | Record<string, any>>;
    readFile(path: string, encoding?: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    rm(path: string): Promise<void>;
    rename?(oldPath: string, newPath: string): Promise<void>;
  }
  
  export interface SpawnOptions {
    terminal?: {
      cols: number;
      rows: number;
    };
  }
  
  export interface Process {
    output: ReadableStream<string>;
    input: WritableStream<string>;
    resize(options: { cols: number; rows: number }): void;
  }
  
  // Tipos para el estado del servidor
  export type ServerStatus = 'starting' | 'running' | 'error';
  
  // Tipos para los elementos del DOM
  export interface DOMElements {
    textareaEl: HTMLTextAreaElement | null;
    iframeEl: HTMLIFrameElement | null;
    terminalMountEl: HTMLDivElement | null;
    fileListEl: HTMLUListElement | null;
    currentFileNameEl: HTMLSpanElement | null;
  }
  
  // Tipos para los archivos del proyecto
  export interface ProjectFile {
    name: string;
    path: string;
    content: string;
    isDirectory: boolean;
  } 