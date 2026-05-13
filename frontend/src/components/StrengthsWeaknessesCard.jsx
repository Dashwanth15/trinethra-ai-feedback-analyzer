/** StrengthsWeaknessesCard — side-by-side professional observations */
export default function StrengthsWeaknessesCard({ strengths = [], weaknesses = [] }) {
  if (!strengths.length && !weaknesses.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {strengths.length > 0 && (
        <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
            <h2 className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
              Observed Strengths
            </h2>
          </div>
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <svg className="shrink-0 mt-0.5 w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {weaknesses.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-4 rounded-full bg-amber-400" />
            <h2 className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              Improvement Areas
            </h2>
          </div>
          <ul className="space-y-3">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <svg className="shrink-0 mt-0.5 w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
