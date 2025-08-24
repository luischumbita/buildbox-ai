/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const PORT = process.env.PORT || 8787;
const DEFAULT_MODEL = 'imagen-4.0-generate-preview-06-06';

app.post('/generate-images', async (req, res) => {
    try {
        const body = req.body || {};
        const prompts = Array.isArray(body.prompts) ? body.prompts : [];
        if (!prompts.length) return res.json({ images: [] });

        const apiKey = req.headers['x-api-key'] || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(400).json({ error: 'API key requerida' });

        const ai = new GoogleGenAI({ apiKey });

        const generateOne = async (prompt) => {
            try {
                const response = await ai.models.generateImages({
                    model: DEFAULT_MODEL,
                    prompt,
                    config: { numberOfImages: 1 },
                });
                const img = response.generatedImages?.[0]?.image?.imageBytes;
                return img ? `data:image/png;base64,${img}` : null;
            } catch (e) {
                console.warn('Fallo imagen para prompt:', prompt, e?.message || e);
                return null;
            }
        };

        const results = await Promise.all(prompts.map((p) => generateOne(p)));
        res.json({ images: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generando imágenes' });
    }
});

app.listen(PORT, () => {
    console.log(`Image server listening on http://localhost:${PORT}`);
});


