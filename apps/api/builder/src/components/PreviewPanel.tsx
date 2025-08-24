import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Eye, ExternalLink } from 'lucide-react';
import { bootWebContainer, writeGeneratedProject } from '../lib/webcontainer';

interface PreviewPanelProps {
  html: string;
  css: string;
  javascript: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ html, css, javascript }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [useContainer, setUseContainer] = useState(false);
  const [containerUrl, setContainerUrl] = useState('');

  const updatePreview = () => {
    if (iframeRef.current) {
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${javascript}</script>
        </body>
        </html>
      `;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;

      return () => URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (useContainer) {
      (async () => {
        const { previewUrl } = await bootWebContainer();
        await writeGeneratedProject(html, css, javascript);
        setContainerUrl(previewUrl);
        if (iframeRef.current) iframeRef.current.src = previewUrl;
      })();
    } else {
      cleanup = updatePreview() as any;
    }
    return cleanup;
  }, [html, css, javascript, useContainer]);

  const openInNewTab = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Landing Page</title>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${javascript}</script>
</body>
</html>`;

    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(fullHtml);
      newWindow.document.close();
    }
  };

  const getFrameClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-[768px] h-[600px]';
      case 'desktop':
      default:
        return 'w-full h-[600px]';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-100 border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Vista Previa
          </h3>

          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded border">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 ${viewMode === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 ${viewMode === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 ${viewMode === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            <label className="ml-3 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={useContainer} onChange={(e) => setUseContainer(e.target.checked)} />
              Usar WebContainer
            </label>

            <button
              onClick={openInNewTab}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir
            </button>
            {useContainer && containerUrl && (
              <a
                href={containerUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-2 px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                Servidor
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex justify-center">
        <div className={`bg-white shadow-lg ${getFrameClass()} transition-all duration-300`}>
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded"
            title="Landing Page Preview"
          />
        </div>
      </div>
    </div>
  );
};