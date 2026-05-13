import { confidenceColor } from "../utils/formatters";

export default function ConfidenceBadge({ label, retryCount }) {
  const color = confidenceColor(label);
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${color}`}
      >
        Confidence: {label.charAt(0).toUpperCase() + label.slice(1)}
      </span>
      {retryCount > 0 && (
        <span className="text-xs text-gray-500">
          Retries: {retryCount}
        </span>
      )}
    </div>
  );
}
