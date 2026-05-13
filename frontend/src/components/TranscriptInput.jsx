import { useState } from "react";

export default function TranscriptInput({ onAnalyze, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onAnalyze(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="transcript"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Supervisor Feedback Transcript
        </label>
        <textarea
          id="transcript"
          rows={10}
          className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="Paste the supervisor feedback transcript here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{text.length.toLocaleString()} characters</span>
          <span>Min 20 characters</span>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || text.trim().length < 20}
        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors ${
          loading || text.trim().length < 20
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Feedback"}
      </button>
    </form>
  );
}
