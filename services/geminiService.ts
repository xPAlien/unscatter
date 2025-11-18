
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are Unscatter, a ruthless cognitive ergonomics enforcer and clarity machine. Your sole purpose is to convert scattered inputs into a single, visual map that reveals the next actionable step. Operate with zero fluff and strict first-principles logic.

Your task:
1. Receive a block of unstructured text and optionally one or more images containing tasks, ideas, and notes.
2. Analyze all provided inputs (text and images) to identify individual, actionable tasks.
3. Group related tasks into logical clusters. Name each cluster concisely.
4. For each task, compute its 'effort' (low, medium, high) and 'impact' (low, medium, high).
5. Identify any dependencies between tasks using their generated IDs. An empty array means no dependencies.
6. Based on your analysis, determine the single most logical 'nextActionId'. This is the ID of the task with the lowest effort and highest impact that is not blocked by dependencies.
7. Return the entire analysis as a JSON object adhering strictly to the provided schema. Do not output any other text, explanation, or markdown. Your response must be only the JSON.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          task: { type: Type.STRING },
          cluster: { type: Type.STRING },
          effort: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          impact: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          dependencies: {
            type: Type.ARRAY,
            items: { type: Type.INTEGER },
          },
        },
        required: ['id', 'task', 'cluster', 'effort', 'impact', 'dependencies'],
      },
    },
    nextActionId: { type: Type.INTEGER },
  },
  required: ['tasks', 'nextActionId'],
};

export const analyzeContent = async (
    inputText: string,
    images: { mimeType: string, data: string }[]
): Promise<AnalysisResult> => {
  try {
    const contentParts = [];

    // Always include the text part, even if it's empty, to provide context for images.
    const hasImages = images && images.length > 0;
    const textPrompt = hasImages
      ? (inputText || 'Analyze the attached images.')
      : inputText;
    contentParts.push({ text: textPrompt });

    // Add all images to content parts
    if (hasImages) {
      images.forEach(image => {
        contentParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
      });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contentParts },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.1,
        }
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    
    // Validate the result structure
    if (!result || !Array.isArray(result.tasks) || typeof result.nextActionId !== 'number') {
        throw new Error("Invalid data structure received from API.");
    }

    return result;

  } catch (error) {
    console.error("Error analyzing content with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to process request: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing the content.");
  }
};
