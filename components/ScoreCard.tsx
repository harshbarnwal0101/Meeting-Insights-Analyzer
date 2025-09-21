interface ScoreCardProps {
  title: string;
  value: number;
}

export default function ScoreCard({ title, value }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      <p className={`text-4xl font-bold ${getScoreColor(value)}`}>{value}</p>
    </div>
  );
}
