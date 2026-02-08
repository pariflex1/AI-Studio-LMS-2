
import { GoogleGenAI } from "@google/genai";
import { Client } from './types';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async *chatStream(message: string, clients: Client[]) {
    const clientSummary = clients.map(c => 
      `${c.name} (${c.status}): ${c.location}, Budget ${c.budget}, Profession ${c.profession}, Intent: ${c.intent}, Notes: ${c.notes}`
    ).join('\n');

    const systemInstruction = `
      You are the SkyCRM AI Assistant for real estate agents. 
      You have access to the following current client data:
      ${clientSummary}
      
      Your goal is to help the agent manage their business. 
      - Be professional, concise, and helpful.
      - If asked about leads, analyze the status and notes.
      - Suggest follow-ups where appropriate.
      - Use markdown for formatting lists or highlighting names.
      - Keep responses short and actionable.
    `;

    try {
      const result = await this.ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) yield text;
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      yield "I'm sorry, I'm having trouble connecting to my brain right now. Please check your connection and try again.";
    }
  }
}

export const gemini = new GeminiService();
