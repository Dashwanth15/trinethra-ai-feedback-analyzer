/** StrengthsWeaknessesCard — side-by-side strengths & weaknesses */
export default function StrengthsWeaknessesCard({ strengths = [], weaknesses = [] }) {
  if (!strengths.length && !weaknesses.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-3">
            ✓ Strengths
          </h2>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-100 p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-3">
            ⚠ Improvement Areas
          </h2>
          <ul className="space-y-2">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
