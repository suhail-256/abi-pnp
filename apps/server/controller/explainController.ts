import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const explainResponseSchema = z.object({
  summary: z.string(),
  inputs: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),
  outputs: z.array(
    z.object({
      description: z.string(),
    }),
  ),
  warnings: z.array(z.string()),
});

const systemInstruction = `You are a smart contract interpreter. Your job is to explain Solidity functions 
to users who may not be familiar with blockchain development.

You will be given:
- The full source code of a smart contract
- The ABI entry of a specific function

Respond in this exact JSON format:
{
  "summary": "One sentence explaining what this function does in plain English.",
  "inputs": [
    { "name": "paramName", "description": "What this parameter represents and expected values." }
  ],
  "outputs": [
    { "description": "What this returns and what it represents." }
  ],
  "warnings": [
    "Any risks or important notes, e.g. sends ETH, irreversible, restricted to owner, etc."
  ]
}

Rules:
- Never use Solidity jargon without explaining it
- Keep the summary under 2 sentences
- If there are no inputs, outputs, or warnings, return an empty array for that field
- warnings should only include genuinely important things, not obvious ones
- Base your explanation on the full contract source for accuracy, not just the function signature`;

const ai = new GoogleGenAI({});

export const explainFunction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { contractSource, functionABI } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `contract: ${contractSource}\n\nfunction ABI: ${functionABI}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(explainResponseSchema as any),
      },
    });

    return res.status(201).json(explainResponseSchema.parse(JSON.parse(response.text!)));
  } catch (err) {
    next(err);
  }
};
