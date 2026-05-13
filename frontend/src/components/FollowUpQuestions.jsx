import { useClipboard } from "../hooks/useClipboard";

export default function FollowUpQuestions({ questions }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Suggested Follow-up Questions
      </h2>
      <ol className="space-y-3">
        {questions.map((q, idx) => (
          <QuestionItem key={idx} index={idx} item={q} />
        ))}
      </ol>
    </div>
  );
}

function QuestionItem({ index, item }) {
  const { copy, copied } = useClipboard();

  return (
    <li className="flex items-start gap-3 group">
      <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
        {index + 1}
      </span>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{item.question}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Targets: {item.target_gap}
        </p>
      </div>
      <button
        onClick={() => copy(item.question)}
        className="shrink-0 text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy to clipboard"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </li>
  );
}
