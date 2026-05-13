/** SummaryCard — executive-style AI analysis summary */
export default function SummaryCard({ summary }) {
  if (!summary) return null;
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-400 text-sm">◈</span>
        <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
          Executive Summary
        </h2>
      </div>
      <p className="text-base font-medium text-indigo-900 leading-relaxed">{summary}</p>
    </div>
  );
}
