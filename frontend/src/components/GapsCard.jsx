/** GapsCard — dimensions the supervisor did NOT cover */
export default function GapsCard({ gaps = [] }) {
  if (!gaps.length) return null;

  return (
    <div className="bg-white rounded-xl border border-rose-100 p-5 shadow-sm">
      <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">
        🔍 Missing Evaluation Areas
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Topics the supervisor did not address in this feedback session.
      </p>
      <ul className="space-y-2">
        {gaps.map((g, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="shrink-0 text-rose-300 mt-0.5">—</span>
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}
