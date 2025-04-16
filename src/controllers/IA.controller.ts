import { GoogleGenAI } from "@google/genai";

export const IAController = {
    async generateContent(options: { contents: string, systemInstruction?: string }) {
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: options.contents,
                config: {
                    systemInstruction: options.systemInstruction,
                }
            });
            
            return response.text;
        } catch (error) {
            console.error("Error generating content:", error);
            return null;
        }
    }
}