// service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCW2AUsLrHc0pVM9zHpPhZFWLtuSbmSdu8");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateFilesFromPrompt(prompt: string) {
  const response = await model.generateContent(`
  Eres un generador de código para un entorno WebContainer.
  Responde SOLO con un JSON con los archivos necesarios.
  
  En caso de que el response contenga imagenes, no es necesario agregarlas sino definir un marcador de posición para la imagen.
  Ejemplo de salida:
  {
    "Slider.tsx": "<código del componente>",
    "Slider.css": "body { background: red; }"
  }

  Prompt del usuario:
  ${prompt}
  `);

  const text = await response.response.text(); // Ensure this is awaited
  console.log("Response text:", text); // Log the response for debugging

  // Clean up the response text
  const cleanedText = text.replace(/```json|```/g, '').trim(); // Remove Markdown formatting

  try {
    return JSON.parse(cleanedText || "{}"); // Handle empty response gracefully
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid JSON response");
  }
}
