export interface DOMElements {
  textareaEl: HTMLTextAreaElement | null;
  iframeEl: HTMLIFrameElement | null;
  terminalMountEl: HTMLElement | null;
  fileListEl: HTMLElement | null;
  currentFileNameEl: HTMLElement | null;
}

export type ServerStatus = 'stopped' | 'starting' | 'running' | 'error';

export interface FileInfo {
  name: string;
  content: string;
  type: 'file' | 'directory';
} 