import { useRef } from "react";
import Layout from "./components/Layout";
import TranscriptInput from "./components/TranscriptInput";
import FollowUpQuestions from "./components/FollowUpQuestions";
import ErrorBanner from "./components/ErrorBanner";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { useAnalyze } from "./hooks/useAnalyze";

export default function App() {
  const { analyze, reset, result, loading, error } = useAnalyze();
  const resultsRef = useRef(null);

  const handleAnalyze = async (transcript) => {
    reset();
    const data = await analyze(transcript);
    if (data?.success && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const data = result?.data;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <TranscriptInput onAnalyze={handleAnalyze} loading={loading} />

        {loading && <LoadingSkeleton />}

        {error && <ErrorBanner message={error} />}

        {result && !loading && (
          <div ref={resultsRef} className="mt-8 space-y-6">
            {result.success && data ? (
              <>
                {/* Score Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Overall Score
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-indigo-600">
                      {data.score}
                    </span>
                    <span className="text-gray-400 text-lg font-light">/ 10</span>
                    <ScoreBar score={data.score} />
                  </div>
                </div>

                {/* Strengths */}
                {data.strengths?.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Strengths
                    </h2>
                    <ul className="space-y-2">
                      {data.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                          <span className="mt-0.5 text-green-500 shrink-0">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {data.weaknesses?.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Areas for Improvement
                    </h2>
                    <ul className="space-y-2">
                      {data.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                          <span className="mt-0.5 text-amber-500 shrink-0">⚠</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Questions */}
                <FollowUpQuestions questions={data.follow_up_questions} />

                <div className="text-xs text-gray-400 text-right">
                  Processed in {result.processing_time_ms.toLocaleString()}ms
                </div>
              </>
            ) : (
              <ErrorBanner
                message={result.error_message || "Analysis could not be completed."}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

/** Simple horizontal bar representing score/10 */
function ScoreBar({ score }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "bg-green-500" : score >= 4 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
