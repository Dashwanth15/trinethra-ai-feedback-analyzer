import { sentimentColor } from "../utils/formatters";

export default function EvidenceList({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Extracted Evidence ({evidence.length})
      </h2>
      <div className="space-y-3">
        {evidence.map((item, idx) => (
          <div
            key={idx}
            className="rounded-md border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <blockquote className="text-sm text-gray-800 italic flex-1">
                "{item.quote}"
              </blockquote>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${sentimentColor(
                  item.sentiment
                )}`}
              >
                {item.sentiment}
              </span>
            </div>
            {item.context && (
              <p className="text-xs text-gray-500 mt-2">{item.context}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
