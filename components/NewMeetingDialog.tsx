'use client';

import { useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (payload: { transcript: any; score: any; meetingId: string }) => void;
}

export default function NewMeetingDialog({ open, onClose, onCreated }: Props) {
  const [meetingName, setMeetingName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      setText((prev) => (prev ? prev + '\n' : '') + content);
    } catch (_err) {
      setError('Failed to read file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    if (!meetingName.trim()) {
      setError('Please enter a meeting/client name');
      return;
    }
    if (!text.trim()) {
      setError('Please paste or upload a transcript');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/transcripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingName, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Analysis failed');
      onCreated({ transcript: data.transcript, score: data.score, meetingId: data.transcript.meetingId });
      setMeetingName('');
      setText('');
      onClose();
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-xl p-6 text-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">New Meeting</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Client / Meeting Name</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              placeholder="e.g., Acme Inc - Q3 Planning"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Transcript</label>
            <textarea
              className="w-full h-48 bg-white border border-gray-300 rounded-md p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your transcript here or use Upload Transcript"
            />
            <div className="mt-2 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.rtf,.log,.json"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={handleUploadClick}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold py-2 px-3 rounded border border-gray-300"
              >
                Upload Transcript
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded border border-gray-300">Cancel</button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2 px-4 rounded"
            >
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
