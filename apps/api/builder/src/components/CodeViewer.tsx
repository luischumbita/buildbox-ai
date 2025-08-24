import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Copy, Download, Eye } from 'lucide-react';

interface CodeViewerProps {
  html: string;
  css: string;
  javascript: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ html, css, javascript }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript'>('html');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // Simple notification - you could enhance this with a toast library
    alert(`Código ${type.toUpperCase()} copiado al portapapeles`);
  };

  const downloadCode = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Landing Page</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${javascript}
    </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return html;
      case 'css': return css;
      case 'javascript': return javascript;
      default: return '';
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'html';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5" />
            Código Generado
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(getCurrentCode(), activeTab)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              Copiar
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>
        </div>

        <div className="flex gap-1">
          {['html', 'css', 'javascript'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'html' | 'css' | 'javascript')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96 overflow-auto">
        <SyntaxHighlighter
          language={getLanguage()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            height: '100%',
            fontSize: '0.875rem',
          }}
          showLineNumbers
          wrapLines
        >
          {getCurrentCode()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};