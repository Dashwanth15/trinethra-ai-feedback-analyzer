/** ScoreCard — displays the numeric score with a colour-coded progress bar */
export default function ScoreCard({ score, processingTimeMs }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-amber-400" : "bg-red-500";
  const label =
    score >= 7 ? "Strong" : score >= 4 ? "Developing" : "Needs Attention";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Overall Score
      </h2>
      <div className="flex items-end gap-4 mb-4">
        <span className="text-6xl font-bold text-gray-900">{score}</span>
        <span className="text-2xl text-gray-300 font-light pb-1">/ 10</span>
        <span
          className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full ${
            score >= 7
              ? "bg-emerald-50 text-emerald-700"
              : score >= 4
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {processingTimeMs != null && (
        <p className="text-xs text-gray-400 text-right mt-3">
          Processed in {processingTimeMs.toLocaleString()} ms
        </p>
      )}
    </div>
  );
}
