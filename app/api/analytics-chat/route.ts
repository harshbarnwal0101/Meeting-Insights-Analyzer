import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';

function buildGeminiUrl(apiVersion: 'v1beta' | 'v1beta2') {
  return `https://generativelanguage.googleapis.com/${apiVersion}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
}

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ reply: 'Gemini is not configured. Please set GEMINI_API_KEY.' }, { status: 200 });
    }

    const { meetingId, context, messages } = await req.json();

    if (!meetingId || !context) {
      return NextResponse.json({ error: 'meetingId and context are required' }, { status: 400 });
    }

    const systemContext = summarizeContext(context);

    const chatTranscript = (Array.isArray(messages) ? messages : [])
      .map((m: any) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${sanitize(m.content ?? '')}`)
      .join('\n');

    const prompt = `You are an assistant helping analyze meeting analytics. Use the provided analytics context only; if unsure, say so. Provide concise, actionable, and accurate answers grounded in the numbers.\n\nAnalytics Context (JSON):\n${systemContext}\n\nConversation so far:\n${chatTranscript}\n\nAssistant:`;

    let response = await fetch(buildGeminiUrl('v1beta'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (response.status === 404) {
      response = await fetch(buildGeminiUrl('v1beta2'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
    }

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: `Gemini request failed: ${response.status} ${text}` }, { status: 500 });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      data.candidates?.[0]?.content?.parts?.[0]?.stringValue ??
      '';

    return NextResponse.json({ reply: reply || 'No response.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}

function sanitize(s: string) {
  if (typeof s !== 'string') return '';
  return s.replace(/\s+/g, ' ').slice(0, 4000);
}

function summarizeContext(context: any) {
  try {
    const { latest, avgLast3, radarData, lineTrend, barByMeeting } = context || {};
    const compact = {
      latestScore: latest?.score || null,
      avgLast3: avgLast3 || null,
      radarData: Array.isArray(radarData) ? radarData.slice(0, 10) : [],
      lineTrend: Array.isArray(lineTrend) ? lineTrend.slice(-12) : [],
      barByMeeting: Array.isArray(barByMeeting) ? barByMeeting.slice(-5) : [],
    };
    return JSON.stringify(compact);
  } catch {
    try {
      return JSON.stringify(context);
    } catch {
      return '{}';
    }
  }
}
