'use client';

import { useState } from 'react';

interface PasteBoxProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
}

export default function PasteBox({ onAnalyze, loading }: PasteBoxProps) {
  const [text, setText] = useState('');

  const handleAnalyzeClick = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Analyze Transcript</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your meeting transcript here..."
        className="w-full h-48 bg-gray-700 border border-gray-600 rounded-md p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        onClick={handleAnalyzeClick}
        disabled={loading || !text.trim()}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </div>
  );
}
