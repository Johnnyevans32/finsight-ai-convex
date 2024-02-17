"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { OpenAI } from "openai";

export const chat = action({
  args: { context: v.string(), prompt: v.string() },
  handler: async (_, args) => {
    const { context, prompt } = args;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const invalidPromptResponse = "I have no idea boss";
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a virtual financial assistant. Answer questions based on the financial context provided. If a question can't be answered with the context, say "${invalidPromptResponse}"\n\n`,
        },
        {
          role: "user",
          content: `Context:\n${context}\n\n---\n\nQuestion: ${prompt}\nAnswer:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
    });

    return response.choices[0]?.message?.content?.replace(/\.[^.]+$/, ".");
  },
});
