/** EvidenceCard — direct phrases extracted from the transcript */
export default function EvidenceCard({ evidence = [] }) {
  if (!evidence.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        📋 Evidence Extracted
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Phrases drawn directly from the transcript to support the analysis.
      </p>
      <ul className="space-y-2">
        {evidence.map((e, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5"
          >
            <span className="text-gray-300 font-mono text-sm shrink-0 mt-0.5">"</span>
            <span className="text-sm text-gray-700 italic">{e}</span>
            <span className="text-gray-300 font-mono text-sm shrink-0 mt-0.5">"</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
