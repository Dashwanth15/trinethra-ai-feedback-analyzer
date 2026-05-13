export default function RubricScore({ rubric }) {
  if (!rubric) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Rubric Score
      </h2>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-5xl font-bold text-gray-900">{rubric.score}</span>
        <span className="text-sm text-gray-500">out of 10</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {rubric.justification}
      </p>
    </div>
  );
}
