interface Transcript {
  id: string;
  name: string;
  date: string;
}

interface TranscriptListProps {
  transcripts: Transcript[];
}

export default function TranscriptList({ transcripts }: TranscriptListProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Recent Transcripts</h2>
      <ul className="space-y-3">
        {transcripts.map((transcript) => (
          <li
            key={transcript.id}
            className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition duration-200 cursor-pointer"
          >
            <p className="font-medium">{transcript.name}</p>
            <p className="text-sm text-gray-400">{transcript.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
