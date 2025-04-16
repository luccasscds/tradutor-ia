import { GoogleGenAI } from "@google/genai";
import { tools } from "../utils/tools";

export const IAController = {
    async generateContent(options: { contents: string, systemInstruction?: string }) {
        try {
            if (!import.meta.env.VITE_GOOGLE_GENAI_API_KEY) throw "VITE_GOOGLE_GENAI_API_KEY não está definido.";
            await tools.checkInternet();
            
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
            throw error;
        }
    }
}