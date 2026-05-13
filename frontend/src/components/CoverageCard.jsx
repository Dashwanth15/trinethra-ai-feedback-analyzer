/**
 * CoverageCard — shows which standard evaluation dimensions were addressed vs missed.
 * Coverage is derived from the gaps array (pure frontend logic, zero inference cost).
 */

const DIMENSIONS = [
  "Communication",
  "Ownership",
  "Leadership",
  "Teamwork",
  "Time Management",
  "Technical Skills",
  "Goal Alignment",
  "Well-being",
];

function isMissing(dimension, gaps) {
  return gaps.some((g) => g.toLowerCase().includes(dimension.toLowerCase()));
}

export default function CoverageCard({ gaps = [] }) {
  const covered = DIMENSIONS.filter((d) => !isMissing(d, gaps));
  const missing = DIMENSIONS.filter((d) => isMissing(d, gaps));
  const coveragePct = Math.round((covered.length / DIMENSIONS.length) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">🎯</span>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Assessment Coverage
          </h2>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          coveragePct >= 70
            ? "bg-emerald-50 text-emerald-700"
            : coveragePct >= 40
            ? "bg-amber-50 text-amber-700"
            : "bg-red-50 text-red-700"
        }`}>
          {coveragePct}% Covered
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DIMENSIONS.map((dim) => {
          const covered = !isMissing(dim, gaps);
          return (
            <div
              key={dim}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border ${
                covered
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-red-50 border-red-100 text-red-700 opacity-75"
              }`}
            >
              <span className="shrink-0 font-bold">{covered ? "✓" : "✕"}</span>
              <span className="truncate">{dim}</span>
            </div>
          );
        })}
      </div>

      {missing.length > 0 && (
        <p className="text-xs text-gray-400 mt-3">
          {missing.length} dimension{missing.length > 1 ? "s" : ""} not addressed in this session.
        </p>
      )}
    </div>
  );
}
