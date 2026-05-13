/** SummaryCard — one-sentence AI-generated analysis summary */
export default function SummaryCard({ summary }) {
  if (!summary) return null;
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
      <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
        Analysis Summary
      </h2>
      <p className="text-base text-indigo-900 leading-relaxed">{summary}</p>
    </div>
  );
}
