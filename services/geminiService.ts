import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found via process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStylingAdvice = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Ти професійний асистент стиліста-перукаря. 
        Твоя мета - надавати кваліфіковані поради щодо стрижок, фарбування та догляду за волоссям.
        Відповідай українською мовою. Будь ввічливим, креативним та лаконічним.
        Якщо питають про тренди, називай актуальні тренди 2024-2025 років.`,
      }
    });
    return response.text || "Вибачте, я не зміг згенерувати відповідь.";
  } catch (error) {
    console.error("Error generating styling advice:", error);
    throw error;
  }
};

export const generateHairstyleImage = async (description: string): Promise<string> => {
  try {
    const ai = getClient();
    // Using Imagen 3 via genai sdk (assuming configured model map, adhering to prompt guidance for imagen-4.0-generate-001 if available or similar)
    // The prompt instructions say to use 'imagen-4.0-generate-001' for high quality images.
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Professional hairstyle photography, salon quality, ${description}`,
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
      // Using gemini-2.5-flash for multimodal analysis as it is cost effective and fast.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg', // Assuming jpeg for simplicity or derived
                        data: base64Image
                    }
                },
                {
                    text: prompt
                }
            ]
        },
        config: {
            systemInstruction: "Ти експерт-стиліст. Проаналізуй фото клієнта та дай пораду."
        }
      });
      return response.text || "Не вдалося проаналізувати фото.";
    } catch (error) {
        console.error("Error analyzing photo:", error);
        throw error;
    }
}
