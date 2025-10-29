// ABOUTME: Gemini AI client for agent execution
// ABOUTME: Provides typed interface to Google's Generative AI API

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '';

if (!API_KEY && typeof window !== 'undefined') {
  console.warn('Gemini API key not found. Agents will use fallback mode.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generate content using Gemini
 */
export async function generateContent(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate structured JSON output
 */
export async function generateJSON<T = Record<string, unknown>>(
  prompt: string,
  schema?: string
): Promise<T> {
  const fullPrompt = schema
    ? `${prompt}\n\nYou MUST respond with valid JSON only. No explanations, no markdown, just the JSON object.\n\nExpected schema:\n${schema}`
    : `${prompt}\n\nYou MUST respond with valid JSON only. No explanations, no markdown, just the JSON object.`;

  const response = await generateContent(fullPrompt);

  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = response.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/```\n?/g, '');
  }

  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('Failed to parse JSON response:', jsonStr);
    throw new Error('AI returned invalid JSON');
  }
}

/**
 * Check if Gemini is available
 */
export function isGeminiAvailable(): boolean {
  return genAI !== null;
}
