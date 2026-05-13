import { importanceColor } from "../utils/formatters";

export default function GapAnalysis({ gaps }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Gap Analysis
      </h2>
      <ul className="space-y-3">
        {gaps.map((gap, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-gray-400"></span>
            <div>
              <p className={`text-sm ${importanceColor(gap.importance)}`}>
                {gap.dimension}
                <span className="ml-2 text-xs font-normal text-gray-400 capitalize">
                  ({gap.importance.replace("_", " ")})
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{gap.rationale}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
