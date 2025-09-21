'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ScoreCard from '@/components/ScoreCard';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';

interface Item {
  transcript: { _id: string; createdAt: string; text?: string };
  score: {
    pitchScore: number;
    conversionScore: number;
    rapportScore: number;
    objectionScore: number;
    closingScore: number;
    overall: number;
  } | null;
}

export default function MeetingAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const meetingId = params?.id as string;

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/transcripts?meetingId=${meetingId}&limit=8`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    if (meetingId) run();
  }, [meetingId]);

  const latest = useMemo(() => items.find((x) => !!x.score) || null, [items]);

  const avgLast3 = useMemo(() => {
    const scored = items.filter((x) => x.score).slice(0, 3).map((x) => x.score!);
    if (scored.length === 0) return null;
    const n = scored.length;
    const sum = scored.reduce(
      (a, s) => ({
        pitchScore: a.pitchScore + s.pitchScore,
        conversionScore: a.conversionScore + s.conversionScore,
        rapportScore: a.rapportScore + s.rapportScore,
        objectionScore: a.objectionScore + s.objectionScore,
        closingScore: a.closingScore + s.closingScore,
        overall: a.overall + s.overall,
      }),
      { pitchScore: 0, conversionScore: 0, rapportScore: 0, objectionScore: 0, closingScore: 0, overall: 0 }
    );
    return {
      pitchScore: Math.round(sum.pitchScore / n),
      conversionScore: Math.round(sum.conversionScore / n),
      rapportScore: Math.round(sum.rapportScore / n),
      objectionScore: Math.round(sum.objectionScore / n),
      closingScore: Math.round(sum.closingScore / n),
      overall: Math.round(sum.overall / n),
    };
  }, [items]);

  const radarData = useMemo(() => {
    if (!latest?.score || !avgLast3) return [] as any[];
    return [
      { metric: 'Pitch', current: latest.score.pitchScore, average: avgLast3.pitchScore },
      { metric: 'Conversion', current: latest.score.conversionScore, average: avgLast3.conversionScore },
      { metric: 'Rapport', current: latest.score.rapportScore, average: avgLast3.rapportScore },
      { metric: 'Objection', current: latest.score.objectionScore, average: avgLast3.objectionScore },
      { metric: 'Closing', current: latest.score.closingScore, average: avgLast3.closingScore },
    ];
  }, [latest, avgLast3]);

  const lineTrend = useMemo(() => {
    const arr = items.filter((x) => x.score).slice(0, 12).reverse();
    return arr.map((x, idx) => ({ name: `M${idx + 1}`, score: x.score!.overall }));
  }, [items]);

  const barByMeeting = useMemo(() => {
    return items
      .filter((x) => !!x.score)
      .slice(0, 5)
      .reverse()
      .map((x, i) => ({
        name: `#${items.length - i}`,
        Pitch: x.score!.pitchScore,
        Conversion: x.score!.conversionScore,
        Rapport: x.score!.rapportScore,
        Objection: x.score!.objectionScore,
        Closing: x.score!.closingScore,
      }));
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meeting Analytics</h1>
            <p className="text-sm text-gray-500">Review insights and trends for this meeting.</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-indigo-600 hover:underline">Back to Dashboard</button>
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-500">Loading…</div>
        )}

        {!loading && !latest && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-500">No analyzed transcripts yet for this meeting.</div>
        )}

        {latest && (
          <div className="space-y-8">
            {/* Score cards */}
            <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ScoreCard title="Pitch Score" value={latest.score!.pitchScore} />
              <ScoreCard title="Conversion Score" value={latest.score!.conversionScore} />
              <ScoreCard title="Rapport Score" value={latest.score!.rapportScore} />
              <ScoreCard title="Objection Score" value={latest.score!.objectionScore} />
              <ScoreCard title="Closing Score" value={latest.score!.closingScore} />
              <ScoreCard title="Overall Score" value={latest.score!.overall} />
            </section>

            {/* Radar */}
            {avgLast3 && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Radar</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData} outerRadius={110}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar name="Current" dataKey="current" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.55} />
                    <Radar name="Average (last 3)" dataKey="average" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </section>
            )}

            {/* Overall Trend */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Overall Score Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineTrend}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Properties across last up to 5 entries */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Last 3–5 Entries by Property</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barByMeeting}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pitch" fill="#4f46e5" />
                  <Bar dataKey="Conversion" fill="#10b981" />
                  <Bar dataKey="Rapport" fill="#f59e0b" />
                  <Bar dataKey="Objection" fill="#ef4444" />
                  <Bar dataKey="Closing" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Analytics Chat (Gemini) */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Ask Gemini about these analytics</h2>
              <AnalyticsChat
                meetingId={meetingId}
                context={{
                  latest: latest,
                  avgLast3: avgLast3,
                  radarData: radarData,
                  lineTrend: lineTrend,
                  barByMeeting: barByMeeting,
                }}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Inline component for chat to keep changes local to this page ---
function AnalyticsChat({
  meetingId,
  context,
}: {
  meetingId: string;
  context: any;
}) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;
    setInput('');
    const nextMessages = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setSubmitting(true);
    try {
      const res = await fetch('/api/analytics-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, context, messages: nextMessages }),
      });
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'No response.' }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Sorry, I could not process that request. ' + (e?.message || '') },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="h-64 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50 text-sm space-y-3">
        {messages.length === 0 && (
          <div className="text-gray-500">Ask questions like: "Why is overall lower than average?", "Which property is dragging the score?", or "Give suggestions to improve conversion next meeting."</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-gray-900' : 'text-indigo-700'}>
            <span className="font-semibold mr-2">{m.role === 'user' ? 'You' : 'Gemini'}:</span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ask about these analytics…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={submitting}
          className={`px-4 py-2 rounded text-white ${submitting ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
