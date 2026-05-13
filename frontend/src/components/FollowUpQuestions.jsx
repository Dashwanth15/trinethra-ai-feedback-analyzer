import { useClipboard } from "../hooks/useClipboard";

/** FollowUpQuestions — interview-quality contextual questions */
export default function FollowUpQuestions({ questions = [] }) {
  if (!questions.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-400 text-sm">?</span>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Suggested Follow-up Questions
        </h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Contextual interview-quality questions linked to detected gaps and weaknesses.
      </p>
      <ol className="space-y-3">
        {questions.map((q, idx) => (
          <QuestionItem key={idx} index={idx} question={q} />
        ))}
      </ol>
    </div>
  );
}

function QuestionItem({ index, question }) {
  const { copy, copied } = useClipboard();

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:border-blue-100 hover:bg-blue-50 transition-colors">
      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
        {index + 1}
      </span>
      <p className="flex-1 text-sm text-gray-800 leading-relaxed">{question}</p>
      <button
        onClick={() => copy(question)}
        className="shrink-0 text-xs text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
        title="Copy question"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </li>
  );
}
