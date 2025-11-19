import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // УВАГА: process.env.API_KEY автоматично підставляється середовищем.
  // Якщо ви використовуєте Vite локально, використовуйте import.meta.env.VITE_API_KEY
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing! Check your environment variables.");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Системна інструкція, що включає "алгоритм" користувача
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
        temperature: 0.7, // Баланс між креативністю та точністю
      }
    });
    return response.text || "Вибачте, я не зміг згенерувати відповідь.";
  } catch (error) {
    console.error("Error generating styling advice:", error);
    // Повертаємо безпечне повідомлення, щоб не "валити" інтерфейс
    return "На жаль, AI зараз недоступний. Перевірте з'єднання або спробуйте пізніше.";
  }
};

export const generateHairstyleImage = async (description: string): Promise<string> => {
  try {
    const ai = getClient();
    // Використовуємо Imagen 3/4 для високої якості
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
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating hairstyle image:", error);
    throw error;
  }
};

export const analyzeClientPhoto = async (base64Image: string, prompt: string): Promise<string> => {
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg', 
                        data: base64Image
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
        console.error("Error analyzing photo:", error);
        throw error;
    }
}