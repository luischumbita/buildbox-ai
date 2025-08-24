import { webcontainerUtils } from './webcontainer-config';

export interface FileToCreate {
    path: string;
    content: string;
    type: 'file' | 'directory';
}

export interface CodeExecutionResult {
    success: boolean;
    files?: FileToCreate[];
    error?: string;
    previewUrl?: string;
}

export class WebContainerService {
    private static instance: WebContainerService;
    private webcontainer: any | null = null;
    private isInitialized = false;

    private constructor() { }

    static getInstance(): WebContainerService {
        if (!WebContainerService.instance) {
            WebContainerService.instance = new WebContainerService();
        }
        return WebContainerService.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            if (typeof window === 'undefined') {
                throw new Error('WebContainer solo puede inicializarse en el navegador');
            }

            // Intento best-effort: en dev habilitamos COEP:credentialless; si no hay aislamiento, seguimos e informamos
            if (!(window as any).crossOriginIsolated) {
                console.warn('crossOriginIsolated = false; se intentará iniciar WebContainer con coep: "credentialless"');
            }

            const apiMod: any = await import('@webcontainer/api');
            const WebContainer = apiMod.WebContainer || apiMod.default || apiMod;

            this.webcontainer = await WebContainer.boot({
                coep: 'credentialless',
                workdirName: 'generated-page',
                forwardPreviewErrors: true,
            });
            // Establish preview connection so new tabs can access the project without a manual connect step
            try {
                const doConnect =
                    typeof apiMod.connect === 'function'
                        ? apiMod.connect
                        : typeof WebContainer?.connect === 'function'
                            ? WebContainer.connect
                            : null;
                if (doConnect) {
                    await doConnect();
                }
            } catch (e) {
                console.warn('WebContainer connect failed; previews may ask to connect manually', e);
            }
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize WebContainer:', error);
            throw new Error('Failed to initialize WebContainer');
        }
    }

    async executeGeneratedCode(generatedCode: string): Promise<CodeExecutionResult> {
        try {
            if (!this.webcontainer || !this.isInitialized) {
                await this.initialize();
            }

            // Parse the generated code to extract files
            const files = this.parseGeneratedCode(generatedCode);

            // Create the project structure
            await this.createProjectStructure(files);

            // Install dependencies
            await this.installDependencies();

            // Start the development server and wait for preview URL
            const previewUrl = await this.startDevServer();

            return {
                success: true,
                files,
                previewUrl
            };
        } catch (error) {
            console.error('Code execution error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    private parseGeneratedCode(generatedCode: string): FileToCreate[] {
        // Use the utility function to parse code to files
        const parsedFiles = webcontainerUtils.parseCodeToFiles(generatedCode);

        // Convert to FileToCreate format
        const files: FileToCreate[] = parsedFiles.map(file => ({
            path: file.path,
            content: file.content,
            type: 'file'
        }));

        // Generate complete project structure
        const projectFiles = webcontainerUtils.generateProjectStructure(
            files.length > 0 ? files[0].content : generatedCode,
            'generated-page'
        );

        // Add project files that don't already exist
        for (const projectFile of projectFiles) {
            const exists = files.some(file => file.path === projectFile.path);
            if (!exists) {
                files.push({
                    path: projectFile.path,
                    content: projectFile.content,
                    type: 'file'
                });
            }
        }

        return files;
    }

    private async createProjectStructure(files: FileToCreate[]): Promise<void> {
        if (!this.webcontainer) throw new Error('WebContainer not initialized');

        const path = await import('path-browserify');

        // Ensure parent directories exist then write files
        for (const file of files) {
            if (file.type === 'file') {
                const dir = path.dirname(file.path);
                if (dir && dir !== '.' && dir !== '/') {
                    try {
                        await this.webcontainer.fs.mkdir(dir, { recursive: true });
                    } catch (_) { }
                }
                await this.webcontainer.fs.writeFile(file.path, file.content);
            } else {
                await this.webcontainer.fs.mkdir(file.path, { recursive: true });
            }
        }
    }

    private async installDependencies(): Promise<void> {
        if (!this.webcontainer) throw new Error('WebContainer not initialized');

        const installProcess = await this.webcontainer.spawn('npm', ['install']);

        // consume output to avoid backpressure (optional)
        try {
            const output = await installProcess.output.getReader();
            const pump = async () => {
                while (true) {
                    const { done } = await output.read();
                    if (done) break;
                }
            };
            pump();
        } catch (_) { }

        const exitCode: number = await installProcess.exit;
        if (exitCode !== 0) {
            throw new Error(`npm install failed with code ${exitCode}`);
        }
    }

    private async startDevServer(): Promise<string> {
        if (!this.webcontainer) throw new Error('WebContainer not initialized');

        const serverReady = new Promise<string>((resolve) => {
            this.webcontainer!.on('server-ready', (_port: number, url: string) => {
                resolve(url);
            });
        });

        await this.webcontainer.spawn('npm', ['run', 'dev']);

        const previewUrl = await serverReady;
        return previewUrl;
    }



    async cleanup(): Promise<void> {
        if (this.webcontainer) {
            try {
                await this.webcontainer.teardown();
            } catch (error) {
                console.error('Error during WebContainer cleanup:', error);
            }
            this.webcontainer = null;
            this.isInitialized = false;
        }
    }
}
