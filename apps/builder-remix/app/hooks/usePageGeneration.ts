import { useState, useCallback } from 'react';
import { AIService, type AIGenerationRequest } from '~/lib/services/ai-service';
import { WebContainerService } from '~/lib/services/webcontainer-service';
import JSZip from 'jszip';
import { webcontainerUtils } from '~/lib/services/webcontainer-config';

export interface GenerationState {
    isGenerating: boolean;
    result: {
        success: boolean;
        message?: string;
        error?: string;
        previewUrl?: string;
        zipUrl?: string;
    } | null;
    progress: {
        step: 'idle' | 'ai-generation' | 'code-execution' | 'server-startup' | 'complete';
        message: string;
    };
}

export const usePageGeneration = () => {
    const [state, setState] = useState<GenerationState>({
        isGenerating: false,
        result: null,
        progress: { step: 'idle', message: 'Listo para generar' },
    });

    const generateZip = async (mainComponent: string) => {
        const files = webcontainerUtils.generateProjectStructure(mainComponent, 'generated-page');
        const zip = new JSZip();
        for (const file of files) {
            zip.file(file.path, file.content);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        return URL.createObjectURL(blob);
    };

    const generatePage = useCallback(async (request: AIGenerationRequest) => {
        if (!request.description.trim()) throw new Error('Por favor, describe la página que quieres generar');

        setState(prev => ({ ...prev, isGenerating: true, result: null, progress: { step: 'ai-generation', message: 'Generando código con Gemini...' } }));

        try {
            const aiService = AIService.getInstance();
            const aiResponse = await aiService.generatePage(request);
            if (!aiResponse.success || !aiResponse.code) throw new Error(aiResponse.error || 'Error al generar con IA');

            setState(prev => ({ ...prev, progress: { step: 'code-execution', message: 'Ejecutando código en WebContainer...' } }));

            try {
                const webcontainerService = WebContainerService.getInstance();
                const executionResult = await webcontainerService.executeGeneratedCode(aiResponse.code);
                if (!executionResult.success) throw new Error(executionResult.error || 'Fallo al ejecutar código');

                setState(prev => ({
                    ...prev,
                    isGenerating: false,
                    result: { success: true, message: '¡Página generada exitosamente!', previewUrl: executionResult.previewUrl },
                    progress: { step: 'complete', message: 'Página generada y servidor iniciado' },
                }));
                return { success: true, previewUrl: executionResult.previewUrl };
            } catch (execErr) {
                // Fallback a ZIP descargable si WebContainer no puede iniciar (COOP/COEP, extensiones, etc.)
                const zipUrl = await generateZip(aiResponse.code);
                setState(prev => ({
                    ...prev,
                    isGenerating: false,
                    result: { success: true, message: 'No se pudo iniciar WebContainer en este navegador. Descarga el proyecto para ejecutarlo localmente.', zipUrl },
                    progress: { step: 'idle', message: 'Proyecto listo para descargar' },
                }));
                return { success: true, previewUrl: undefined };
            }
        } catch (error) {
            setState(prev => ({ ...prev, isGenerating: false, result: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }, progress: { step: 'idle', message: 'Error en la generación' } }));
            throw error;
        }
    }, []);

    const cleanup = useCallback(async () => {
        try {
            const webcontainerService = WebContainerService.getInstance();
            await webcontainerService.cleanup();
            setState(prev => ({ ...prev, result: null, progress: { step: 'idle', message: 'WebContainer limpiado' } }));
        } catch {
            // ignore
        }
    }, []);

    const reset = useCallback(() => {
        setState({ isGenerating: false, result: null, progress: { step: 'idle', message: 'Listo para generar' } });
    }, []);

    return { state, generatePage, cleanup, reset };
};
