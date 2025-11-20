import { GoogleGenAI } from "@google/genai";
import { ClientProfile } from "../types";

// Helper to safely get API Key without crashing the browser
const getApiKey = (): string | undefined => {
  try {
    // Vite replace 'process.env.API_KEY' with the actual string during build.
    // We check typeof process to avoid ReferenceError in environments where it's not defined.
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
    // Fallback: sometimes the bundler replaces the whole expression
    return process.env.API_KEY;
  } catch (e) {
    // console.warn("Environment variable access issue:", e);
    return undefined;
  }
};

const getClient = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("CRITICAL: API Key is missing. The app cannot contact Gemini.");
    throw new Error("API Key not found. Please check your Vercel Environment Variables or .env file.");
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

// --- Text Generation ---
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
    return "На жаль, AI зараз недоступний. Перевірте налаштування ключа API.";
  }
};

// --- Image Generation ---
export const generateHairstyleImage = async (description: string): Promise<string> => {
  try {
    const ai = getClient();
    // Using gemini-2.5-flash-image for better availability/performance
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
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

// --- Vision Analysis (Photo) ---
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
};

// --- Profile Identification (JSON) ---
export const identifyClientProfile = async (description: string): Promise<Partial<ClientProfile>> => {
  try {
    const ai = getClient();
    const prompt = `
      Проаналізуй цей опис зовнішності клієнта і визнач його характеристики для анкети перукаря.
      Опис: "${description}"

      Поверни ТІЛЬКИ JSON об'єкт з такими полями (вибери найбільш відповідне значення зі списку або "Не визначено"):
      - colorType: "Весна", "Літо", "Осінь", "Зима"
      - faceShape: "Овал", "Круг", "Квадрат", "Трикутник", "Ромб", "Прямокутник"
      - hairCondition: "Натуральне", "Фарбоване", "Пористе", "Пошкоджене", "Скляне (Сивина)"
      - hairDensity: "Тонке", "Середнє", "Густе"
      - hairStructure: "Пряме", "Хвилясте", "Кучеряве"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    // FIX: Clean up any Markdown formatting (```json ... ```) that Gemini might include
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonText) as Partial<ClientProfile>;
  } catch (error) {
    console.error("Gemini API Error (Identify Profile):", error);
    return {};
  }
};

// --- Strategic Analysis ---
export const generateClientAnalysis = async (name: string, profile: ClientProfile): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
        Проаналізуй профіль клієнта ${name} та надай професійні рекомендації.
        
        ДАНІ КЛІЄНТА:
        - Кольоротип: ${profile.colorType}
        - Стан волосся: ${profile.hairCondition}
        - Форма обличчя: ${profile.faceShape}
        - Густота: ${profile.hairDensity}
        - Структура: ${profile.hairStructure}
        
        ЗАВДАННЯ:
        1. Запропонуй 2-3 ідеальні відтінки фарбування, які підкреслять кольоротип.
        2. Порекомендуй форму стрижки, яка скорегує овал обличчя (Золоте січення).
        3. Напиши протокол догляду з огляду на стан та структуру волосся.
        
        Відформатуй відповідь чіткими блоками.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });
        return response.text || "Не вдалося згенерувати аналіз.";
    } catch (error) {
        console.error("Gemini API Error (Client Analysis):", error);
        return "Помилка AI аналізу. Перевірте API ключ.";
    }
};