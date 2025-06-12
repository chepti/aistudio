import { GoogleGenerativeAI } from "@google/generative-ai";
import { UI_TEXT } from '../constants';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(UI_TEXT.NO_API_KEY_CONSOLE_ERROR);
}

const ai = new GoogleGenerativeAI(API_KEY!);

export const generateStoryForWord = async (word: string, modelName: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error(UI_TEXT.NO_API_KEY_MESSAGE);
  }

  const model = ai.getGenerativeModel({ model: modelName });

  const prompt = `You are a helpful assistant creating a very simple and short story for a child learning English. The story MUST include the English word: "${word}". Make the story easy to understand, memorable, and focused on the meaning of the word "${word}". The story should be in English, and consist of 2-3 short sentences.`;

  try {
    const response = await model.generateContent({
      contents: prompt,
      config: {
        temperature: 0.7, // A bit creative but not too wild
        topK: 40,
        topP: 0.95,
        // thinkingConfig: { thinkingBudget: 0 } // For faster, potentially less nuanced responses if needed
      }
    });
    
    const text = response.text;
    if (!text) {
      throw new Error("No text returned from API.");
    }
    return text.trim();
  } catch (error) {
    console.error("Error generating story with Gemini API:", error);
    // It's good to check for specific error types from the SDK if available
    // For now, re-throwing a generic error message.
    throw new Error(`Failed to generate story for "${word}". Please try again. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
};
