import { parseJsonSafe } from '@/utils/parseJsonSafe';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest'; // configurable

function buildGeminiUrl(apiVersion: 'v1beta' | 'v1beta2') {
  return `https://generativelanguage.googleapis.com/${apiVersion}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
}

const PROMPT = `
Analyze the following meeting transcript and return a JSON object with scores from 1-100 for each of the following categories: pitchScore, conversionScore, rapportScore, objectionScore, closingScore. Also include an 'overall' score and a 'rationale' string (2-3 sentences). The JSON object must be the only thing in your response.

Transcript:
---
__TRANSCRIPT_TEXT__
---
`;

export interface AnalysisResult {
  pitchScore: number;
  conversionScore: number;
  rapportScore: number;
  objectionScore: number;
  closingScore: number;
  overall: number;
  rationale: string;
  rawModelOutput: string;
}

const fallbackResult: Omit<AnalysisResult, 'rawModelOutput'> = {
  pitchScore: 0,
  conversionScore: 0,
  rapportScore: 0,
  objectionScore: 0,
  closingScore: 0,
  overall: 0,
  rationale: 'Model analysis failed or is not configured. This is a fallback score.',
};

export async function analyzeTranscript(
  transcriptText: string
): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. Returning fallback scores.');
    return { ...fallbackResult, rawModelOutput: JSON.stringify(fallbackResult) };
  }

  const prompt = PROMPT.replace('__TRANSCRIPT_TEXT__', transcriptText);

  try {
    // First attempt with v1beta
    let response = await fetch(buildGeminiUrl('v1beta'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    // If the model/path is not found (404), retry with v1beta2 (some accounts require this)
    if (response.status === 404) {
      response = await fetch(buildGeminiUrl('v1beta2'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
    }

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    // Gemini responses vary slightly; try common shapes
    const modelOutput =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
      data.candidates?.[0]?.content?.parts?.[0]?.stringValue ??
      '';

    if (!modelOutput) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedJson = parseJsonSafe(modelOutput);

    if (!parsedJson) {
      throw new Error('Failed to parse JSON from model output');
    }

    return {
      ...parsedJson,
      rawModelOutput: modelOutput,
    };
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return {
      ...fallbackResult,
      rawModelOutput: JSON.stringify({ error: (error as Error).message }),
    };
  }
}
