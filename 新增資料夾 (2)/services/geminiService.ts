import { GoogleGenAI, Type } from "@google/genai";
import { ScrapCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeScrapImage = async (base64Image: string): Promise<{ description: string; suggestedCategory: string }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Clean base64 string if it contains the data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze this image of a food service item. 
            1. Describe the item and its condition (e.g., burnt bread, spilled milk) briefly in Traditional Chinese.
            2. Suggest which category it belongs to from the following list:
               - A: Finished Product (burnt, broken, expired)
               - B: Semi-finished (fermentation issue, mixing issue)
               - C: Raw Material (expired, contaminated)
               - D: Packaging
               - E: Front of House (customer return, display expired)
            
            Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "A brief description of the item and damage in Traditional Chinese" },
            suggestedCategory: { 
              type: Type.STRING, 
              enum: ["A", "B", "C", "D", "E"],
              description: "The single letter code for the category" 
            }
          }
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      // Map letter back to full enum string if possible, or just return the letter
      return {
        description: result.description,
        suggestedCategory: result.suggestedCategory
      };
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return { description: "", suggestedCategory: "" };
  }
};
