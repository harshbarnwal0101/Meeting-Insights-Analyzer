interface Meeting {
  _id: string;
  name: string;
  createdAt: string;
}

interface MeetingListProps {
  meetings: Meeting[];
  selectedId?: string;
  onSelect: (m: Meeting) => void;
  onNew: () => void;
}

export default function MeetingList({ meetings, selectedId, onSelect, onNew }: MeetingListProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Recent Meetings</h2>
        <button
          onClick={onNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-3 rounded"
        >
          New Meeting
        </button>
      </div>
      <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {meetings.map((m) => (
          <li key={m._id}>
            <button
              onClick={() => onSelect(m)}
              className={`w-full text-left p-3 rounded border border-gray-700 hover:bg-gray-700 transition ${
                selectedId === m._id ? 'bg-gray-700' : 'bg-gray-900'
              }`}
            >
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</p>
            </button>
          </li>
        ))}
        {meetings.length === 0 && (
          <li className="text-gray-400 text-sm">No meetings yet. Click "New Meeting" to create one.</li>
        )}
      </ul>
    </div>
  );
}
