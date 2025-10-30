// ABOUTME: Gemini AI client for agent execution (client-side wrapper)
// ABOUTME: Calls secure server-side API route to keep API key safe

/**
 * Generate content using Gemini (calls server-side API)
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type: 'text' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate content');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('[GEMINI CLIENT] Error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate structured JSON output (calls server-side API)
 */
export async function generateJSON<T = Record<string, unknown>>(
  prompt: string,
  schema?: string
): Promise<T> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type: 'json', schema }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate JSON');
    }

    const data = await response.json();
    return data.result as T;
  } catch (error) {
    console.error('[GEMINI CLIENT] JSON generation error:', error);
    throw new Error('AI returned invalid JSON');
  }
}

/**
 * Check if Gemini is available (always true if server is running)
 */
export function isGeminiAvailable(): boolean {
  return true; // Server-side API handles availability
}
