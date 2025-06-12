
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { CharacterInput, GeminiStoryResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please ensure the process.env.API_KEY environment variable is configured.");
  // Potentially throw an error or handle this scenario more gracefully depending on application requirements.
  // For this example, we'll let operations fail if the key is missing, and the UI should show an error.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // The "!" asserts API_KEY is non-null, handle with caution.

const STORY_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
const IMAGE_MODEL_NAME = "imagen-3.0-generate-002";

export const generateStoryAndImagePrompts = async (input: CharacterInput): Promise<GeminiStoryResponse> => {
  const gender_hebrew = input.gender === 'boy' ? 'ילד' : 'ילדה';
  const gender_english = input.gender === 'boy' ? 'boy' : 'girl';

  const prompt = `
אתה סופר ילדים יצירתי המתמחה בסיפורים לכיתה ב'. אנא צור סיפור מקורי בן 3 חלקים.
הדמות הראשית היא:
- שם: ${input.name}
- מין: ${gender_hebrew}
- חיה אהובה: ${input.favoriteAnimal}
- הסיפור מתרחש ב: ${input.setting}

חשוב מאוד: אל תזכיר את תיאור המראה והלבוש של הדמות בטקסט הסיפור עצמו. תיאור זה ישמש ליצירת תמונות בלבד.
עבור כל אחד משלושת חלקי הסיפור, ספק גם תיאור מפורט באנגלית ליצירת תמונה. תיאור זה חייב לכלול את שם הדמות, מינה, ואת תיאור המראה והלבוש הבא: '${input.appearance}'. התיאור צריך לתאר את הסצנה בחלק זה של הסיפור, כולל הדמות, החיה האהובה (אם רלוונטי לחלק זה) והרקע. התמונה צריכה להיות בסגנון איור צבעוני וידידותי לילדים.

אנא החזר את התשובה בפורמט JSON עם המבנה הבא:
{
  "title": "כותרת הסיפור בעברית",
  "sections": [
    { "story_text_hebrew": "טקסט החלק הראשון של הסיפור בעברית...", "image_prompt_english": "Colorful, child-friendly illustration style. A ${gender_english} named ${input.name}, with appearance '${input.appearance}', is [describe action/scene for section 1, incorporating favorite animal ${input.favoriteAnimal} if relevant] in ${input.setting}." },
    { "story_text_hebrew": "טקסט החלק השני של הסיפור בעברית...", "image_prompt_english": "Colorful, child-friendly illustration style. A ${gender_english} named ${input.name}, with appearance '${input.appearance}', is [describe action/scene for section 2, incorporating favorite animal ${input.favoriteAnimal} if relevant] in ${input.setting}." },
    { "story_text_hebrew": "טקסט החלק השלישי של הסיפור בעברית...", "image_prompt_english": "Colorful, child-friendly illustration style. A ${gender_english} named ${input.name}, with appearance '${input.appearance}', is [describe action/scene for section 3, incorporating favorite animal ${input.favoriteAnimal} if relevant] in ${input.setting}." }
  ]
}

ודא שהסיפור יצירתי, מותח ומתאים לגילאי כיתה ב'.
ודא שכל image_prompt_english הוא ייחודי ומתאר במדויק את הסצנה בחלק הסיפור המתאים, תוך שמירה על עקביות במראה הדמות.
`;

  if (!API_KEY) throw new Error("API Key not configured for Gemini Service.");

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: STORY_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as GeminiStoryResponse;
    if (!parsedData.title || !parsedData.sections || parsedData.sections.length !== 3) {
        throw new Error("Invalid story structure received from API.");
    }
    return parsedData;

  } catch (error) {
    console.error("Error generating story:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate story: ${error.message}`);
    }
    throw new Error("Failed to generate story due to an unknown error.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) throw new Error("API Key not configured for Gemini Service.");
  try {
    const response = await ai.models.generateImages({
        model: IMAGE_MODEL_NAME,
        prompt: prompt,
        config: {numberOfImages: 1, outputMimeType: 'image/png'}, // Using PNG for better quality potential
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image generated or empty response.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("Failed to generate image due to an unknown error.");
  }
};
