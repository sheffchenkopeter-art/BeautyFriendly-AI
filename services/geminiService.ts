import { GoogleGenAI } from "@google/genai";

// Helper to safely get API Key without crashing the browser if process is undefined
const getApiKey = (): string | undefined => {
  try {
    // Check if process exists and has env (Node.js / Webpack / some Vite configs)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore reference errors
  }
  return undefined;
};

const getClient = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("CRITICAL: API Key is missing. The app cannot contact Gemini.");
    throw new Error("API Key not found. Please check your environment variables.");
  }
  
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
Ти - елітний AI-асистент для професійних перукарів та колористів "BeautyFriendly AI".

ТВОЇ ПРАВИЛА:
1. Відповідай українською мовою.
2. Будь лаконічним, професійним, але дружнім.
3. Якщо питання стосується фарбування, використовуй "Алгоритм Колориста":
   - Спочатку визнач базу клієнта (рівень глибини тону, фон освітлення).
   - Визнач бажаний результат.
   - Запропонуй точну формулу (грами фарби + грами окисника).
   - Завжди нагадуй про тест на пасмі.
4. Якщо питають про тренди, орієнтуйся на 2024-2025 роки (текстура, натуральність, "тиха розкіш").
`;

export const generateStylingAdvice = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "Вибачте, я не зміг згенерувати відповідь.";
  } catch (error) {
    console.error("Gemini API Error (Text):", error);
    return "На жаль, AI зараз недоступний. Перевірте API ключ в консолі або спробуйте пізніше.";
  }
};

export const generateHairstyleImage = async (description: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Professional hair photography, salon lighting, high resolution, 8k, realistic texture. Subject: ${description}. Style: Modern, aesthetic.`,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg'
      }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini API Error (Image):", error);
    throw error;
  }
};

export const analyzeClientPhoto = async (base64Image: string, prompt: string): Promise<string> => {
    try {
      const ai = getClient();
      // Remove header if present (data:image/jpeg;base64,) to get raw bytes
      const cleanBase64 = base64Image.split(',')[1] || base64Image;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg', 
                        data: cleanBase64
                    }
                },
                {
                    text: prompt
                }
            ]
        },
        config: {
            systemInstruction: "Ти експерт-стиліст. Проаналізуй структуру волосся, форму обличчя та кольоротип клієнта на фото."
        }
      });
      return response.text || "Не вдалося проаналізувати фото.";
    } catch (error) {
        console.error("Gemini API Error (Analysis):", error);
        throw error;
    }
}