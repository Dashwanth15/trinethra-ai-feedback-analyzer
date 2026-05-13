/** GapsCard — evaluation dimensions the supervisor did not address */
export default function GapsCard({ gaps = [] }) {
  if (!gaps.length) return null;

  return (
    <div className="bg-white rounded-xl border border-rose-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-rose-400 text-sm">⬡</span>
        <h2 className="text-xs font-semibold text-rose-500 uppercase tracking-widest">
          Missing Evaluation Areas
        </h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Dimensions the supervisor did not address in this feedback session.
      </p>
      <ul className="space-y-2">
        {gaps.map((g, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 border-rose-200 flex items-center justify-center">
              <span className="text-rose-400 text-xs font-bold">!</span>
            </span>
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}
