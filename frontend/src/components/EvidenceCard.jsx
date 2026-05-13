/** EvidenceCard — verbatim transcript quotes styled as analyst citations */
export default function EvidenceCard({ evidence = [] }) {
  if (!evidence.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400 text-sm">📎</span>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Evidence Extracted
        </h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Verbatim phrases drawn directly from the transcript to support this analysis.
      </p>
      <ul className="space-y-2.5">
        {evidence.map((e, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg px-4 py-3"
          >
            <span className="text-gray-300 font-serif text-xl leading-none mt-0.5 select-none">&ldquo;</span>
            <span className="text-sm text-gray-700 italic flex-1">{e}</span>
            <span className="text-gray-300 font-serif text-xl leading-none self-end select-none">&rdquo;</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
