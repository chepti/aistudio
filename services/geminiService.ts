
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// This function simulates getting the API key. In a real scenario,
// it should be securely managed and accessed, e.g. via environment variables.
// For client-side browser environments, this is tricky and usually involves a backend proxy.
// For this example, we'll assume it's globally available or passed if needed.
const getApiKey = (): string => {
  // Attempt to get from a global variable (e.g., set in index.html or via build)
  // Or directly from process.env if available (more for Node.js context, but bundlers can handle it)
  const apiKey = (window as any).GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : undefined);
  if (!apiKey) {
    console.error("API Key for Gemini is not configured.");
    // For a production app, you might throw an error or return a specific status
    // For now, returning an empty string to let the caller handle it.
    return ""; 
  }
  return apiKey;
};


export const generateStoryForWord = async (word: string, modelName: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is not available. Cannot generate story.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a helpful assistant creating a very simple and short story for a child learning English. The story MUST include the English word: "${word}". Make the story easy to understand, memorable, and focused on the meaning of the word "${word}". The story should be in English, and consist of 2-3 short sentences.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
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
