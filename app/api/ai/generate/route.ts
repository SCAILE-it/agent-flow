// ABOUTME: Server-side API route for Gemini AI generation
// ABOUTME: Keeps API key secure by running on server only

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Server-side only - API key never exposed to client
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '';

if (!API_KEY) {
  console.warn('[GEMINI] API key not configured. Set GEMINI_API_KEY environment variable.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, type = 'text', schema } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    // Input validation: max prompt length
    if (prompt.length > 50000) {
      return NextResponse.json(
        { error: 'Prompt too long (max 50,000 characters)' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Handle JSON generation request
    if (type === 'json') {
      const fullPrompt = schema
        ? `${prompt}\n\nYou MUST respond with valid JSON only. No explanations, no markdown, just the JSON object.\n\nExpected schema:\n${schema}`
        : `${prompt}\n\nYou MUST respond with valid JSON only. No explanations, no markdown, just the JSON object.`;

      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = text.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }

      try {
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({ result: parsed, raw: text });
      } catch {
        console.error('[GEMINI] Failed to parse JSON:', jsonStr);
        return NextResponse.json(
          { error: 'AI returned invalid JSON', raw: text },
          { status: 422 }
        );
      }
    }

    // Handle text generation request
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error('[GEMINI] API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
