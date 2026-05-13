/** ScoreCard — premium score display with confidence context */
const CONFIDENCE_META = {
  High:     { text: "High Confidence",     sub: "Sufficient transcript detail for reliable analysis.",   badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Moderate: { text: "Moderate Confidence", sub: "Partial transcript coverage — some areas may be uncertain.", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  Low:      { text: "Low Confidence",      sub: "Limited transcript detail. Review with caution.",       badge: "bg-red-50 text-red-700 border-red-200" },
};

export default function ScoreCard({ score, confidence = "Moderate", processingTimeMs }) {
  const pct = (score / 10) * 100;
  const barColor = score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-amber-400" : "bg-red-500";
  const scoreLabel = score >= 7 ? "Strong" : score >= 4 ? "Developing" : "Needs Attention";
  const meta = CONFIDENCE_META[confidence] ?? CONFIDENCE_META.Moderate;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Performance Score
        </h2>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.badge}`}>
          {meta.text}
        </span>
      </div>

      {/* Score display */}
      <div className="flex items-end gap-3 mb-4">
        <span className="text-7xl font-bold text-gray-900 leading-none tabular-nums">
          {score}
        </span>
        <div className="pb-1">
          <span className="text-2xl text-gray-300 font-light">/ 10</span>
          <p className={`text-xs font-semibold mt-0.5 ${
            score >= 7 ? "text-emerald-600" : score >= 4 ? "text-amber-600" : "text-red-600"
          }`}>{scoreLabel}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full score-bar ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Confidence context */}
      <p className="text-xs text-gray-400 italic">{meta.sub}</p>

      {/* Processing time */}
      {processingTimeMs != null && (
        <p className="text-xs text-gray-300 text-right mt-3">
          ⏱ {processingTimeMs.toLocaleString()} ms
        </p>
      )}
    </div>
  );
}
