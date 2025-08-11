import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerationOptions } from '../types';

class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private apiKey: string | null = null;

    initializeAPI(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.apiKey = apiKey;
    }

    async generateLandingPage(prompt: string, options: GenerationOptions): Promise<{ html: string, css: string, javascript: string }> {
        if (!this.genAI) {
            throw new Error('Gemini API no está configurada. Por favor, proporciona tu API key.');
        }

        const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const systemPrompt = `
    Eres un experto desarrollador web especializado en crear landing pages modernas, atractivas y de alto rendimiento.
    
    Instrucciones específicas:
    - Genera código HTML, CSS y JavaScript separado para una landing page completa
    - El estilo debe ser ${options.style}
    - Esquema de colores: ${options.colorScheme}
    - ${options.includeAnimations
                ? 'Incluye animaciones avanzadas y pulidas (parallax suave, microinteracciones de hover/focus, reveals on scroll, contadores, sliders/carousels básicos sin dependencias) usando CSS y JavaScript vanilla. Optimiza por rendimiento (usa transform/opacity, evita layout thrashing, usa will-change con mesura) y accesibilidad (respeta prefers-reduced-motion).'
                : 'Sin animaciones complejas; solo transiciones sutiles y accesibles.'}
    - ${options.responsive ? 'Diseño completamente responsive (mobile-first y desktop).' : 'Diseño para desktop.'}
    - Usa CSS moderno (flexbox, grid, variables CSS, clamp, media queries)
    - Incluye elementos típicos de landing: header, hero section, features, testimonials, CTA, footer
    - Usa contenido placeholder realista y profesional
    - El JavaScript debe ser vanilla JS, sin dependencias externas ni frameworks
    - No incluyas etiquetas <style> ni <script> embebidas en el HTML; todo el CSS va en "css" y todo el JS en "javascript"
    - El HTML debe contener ÚNICAMENTE el contenido del <body> (sin <html>, sin <head> y sin <body>)
    
    Tokens y utilidades base (CSS):
    - Define tokens en :root que deriven del esquema de color indicado: 
      --color-primary, --color-bg, --color-surface, --color-text, --color-muted, --radius, --shadow,
      --space-1..--space-6, --container-max, --font-sans.
    - Usa tipografía fluida con clamp y una escala tipo --step--2..--step-3.
    - Incluye utilidades y patrones comunes: .container (max-width con padding lateral), .section (espaciado vertical),
      .grid (responsive), .card, .btn, .btn-primary, .btn-outline, .visually-hidden/.sr-only, estados :focus-visible claros.
    - Soporta modo oscuro con @media (prefers-color-scheme: dark) ajustando tokens cuando corresponda.
    - No utilices recursos externos (CDN) para imágenes o librerías
    
    Imágenes (placeholders en vez de <img>):
    - Como todavía no podemos generar imágenes reales, NO uses la etiqueta <img>.
    - En su lugar, inserta contenedores de placeholder accesibles que indiquen dónde iría cada imagen (hero, features, testimonios, logos, etc.). Cada placeholder debe:
      - Tener la clase principal "ai-image-box"
      - Incluir atributos data-prompt="DESCRIPCION_DE_LA_IMAGEN" y aria-label="ALT DESCRIPTIVO"
      - Incluir opcionalmente data-aspect con valores como "16:9", "4:3" o "1:1"
      - Contener un hijo con clase "ai-image-skeleton" que muestre un shimmer/skeleton animado
      - Opcional: un caption con clase "ai-image-caption"
    - Ejemplos de descripciones: "hero abstract gradient background", "happy customer portrait", "product mockup on phone".
    - Estiliza estos placeholders en el CSS para que tengan relación de aspecto estable (usa aspect-ratio o el padding-top hack), bordes redondeados, fondo neutro, y una animación skeleton agradable. Si se permiten animaciones avanzadas, añade microinteracciones sutiles (p. ej., tilt/parallax en hover) para los placeholders también.
    
    Accesibilidad y estructura:
    - Añade un enlace de "Saltar al contenido" (skip link) visible en foco.
    - Usa landmarks semánticos (header, main, footer, nav, section) y jerarquía correcta de headings.
    - Asegura contraste suficiente, roles/aria donde aporte valor, y navegación con teclado.
    
    Interacciones y JS (sin librerías):
    - Inicializa reveals on scroll con IntersectionObserver (respetando prefers-reduced-motion)
    - Implementa un menú móvil accesible (hamburger) con aria-expanded y focus-trap simple
    - Si corresponde, añade contador animado, slider/carousel simple y parallax suave (transform/opacity + rAF)
    - Evita fugas de memoria: desmonta listeners en window cuando no se usen (si aplica)
    - Puedes actualizar document.title desde JS, pero no insertes <meta> en el HTML (no hay <head> en el output)
    
    Formato de respuesta:
    - Responde SOLO con un JSON válido (sin backticks ni markdown) en este formato exacto:
    {
      "html": "código HTML completo",
      "css": "código CSS completo",
      "javascript": "código JavaScript completo"
    }
    - Asegúrate de escapar correctamente comillas y caracteres especiales para que el JSON sea válido.
    
    Descripción de la landing page: ${prompt}
    `;

        try {
            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();

            // Extraer JSON de la respuesta
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON válido de la respuesta');
            }

            const parsedResponse = JSON.parse(jsonMatch[0]);

            if (!parsedResponse.html || !parsedResponse.css || !parsedResponse.javascript) {
                throw new Error('Respuesta incompleta del modelo');
            }

            // Reemplazar marcadores de imagen por imágenes reales
            const processedHtml = await this.replaceImagePlaceholders(parsedResponse.html);

            return { ...parsedResponse, html: processedHtml };

        } catch (error) {
            console.error('Error generating landing page:', error);
            throw new Error(`Error al generar la landing page: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    private async replaceImagePlaceholders(html: string): Promise<string> {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Seleccionar todas las imágenes; si no traen data-prompt, usar alt como prompt
            const imageElements = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];

            if (imageElements.length === 0) {
                return html;
            }

            const prompts = imageElements.map((imgEl) => (
                imgEl.getAttribute('data-prompt') || imgEl.getAttribute('alt') || 'web landing hero image'
            ));

            const dataUris = await this.generateImagesBatch(prompts);

            const generations = imageElements.map((imgEl, idx) => ({ imgEl, dataUri: dataUris[idx] || null }));

            generations.forEach(({ imgEl, dataUri }) => {
                if (dataUri) {
                    imgEl.setAttribute('src', dataUri);
                } else {
                    // Fallback a Unsplash si no se pudo generar
                    const query = encodeURIComponent(imgEl.getAttribute('data-prompt') || imgEl.getAttribute('alt') || 'landing');
                    imgEl.setAttribute('src', `https://source.unsplash.com/1200x800/?${query}`);
                }
                imgEl.removeAttribute('data-ai-image');
                imgEl.removeAttribute('data-prompt');
            });

            return doc.body.innerHTML;
        } catch (e) {
            console.warn('No se pudo postprocesar imágenes, se devuelve HTML original', e);
            return html;
        }
    }

    private async generateImagesBatch(prompts: string[]): Promise<(string | null)[]> {
        try {
            if (!prompts.length) return [];
            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'x-api-key': this.apiKey } : {}),
                },
                body: JSON.stringify({ prompts }),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            const images = Array.isArray(data.images) ? data.images : [];
            return prompts.map((_, idx) => (typeof images[idx] === 'string' ? images[idx] : null));
        } catch (error) {
            console.warn('Fallo en batch de generación de imágenes:', error);
            return prompts.map(() => null);
        }
    }
}

export const geminiService = new GeminiService();