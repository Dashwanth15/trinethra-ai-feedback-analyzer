/** ReasoningCard — AI analyst note explaining the score rationale */
export default function ReasoningCard({ reasoning }) {
  if (!reasoning) return null;
  return (
    <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="text-xs">🧠</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
          Reasoning Notes
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{reasoning}</p>
        <p className="text-xs text-slate-400 mt-2 italic">
          AI-generated rationale. Human review recommended.
        </p>
      </div>
    </div>
  );
}
