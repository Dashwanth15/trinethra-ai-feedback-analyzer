import { useRef } from "react";
import Layout from "./components/Layout";
import TranscriptInput from "./components/TranscriptInput";
import ScoreCard from "./components/ScoreCard";
import SummaryCard from "./components/SummaryCard";
import StrengthsWeaknessesCard from "./components/StrengthsWeaknessesCard";
import EvidenceCard from "./components/EvidenceCard";
import GapsCard from "./components/GapsCard";
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
        {/* Input */}
        <TranscriptInput onAnalyze={handleAnalyze} loading={loading} />

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Network / server error */}
        {error && <ErrorBanner message={error} />}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef} className="mt-8 space-y-5">

            {result.success && data ? (
              <>
                {/* AI Disclaimer */}
                <div className="flex items-center gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-600">
                  <span className="text-base">🤖</span>
                  <span>
                    <strong>AI-generated draft analysis.</strong> Human review recommended before
                    sharing or acting on this output.
                  </span>
                </div>

                {/* Score */}
                <ScoreCard
                  score={data.score}
                  processingTimeMs={result.processing_time_ms}
                />

                {/* Summary */}
                <SummaryCard summary={data.summary} />

                {/* Strengths + Weaknesses side by side */}
                <StrengthsWeaknessesCard
                  strengths={data.strengths}
                  weaknesses={data.weaknesses}
                />

                {/* Evidence */}
                <EvidenceCard evidence={data.evidence} />

                {/* Gaps */}
                <GapsCard gaps={data.gaps} />

                {/* Follow-up Questions */}
                <FollowUpQuestions questions={data.questions} />
              </>
            ) : (
              /* Analysis failed — show friendly error */
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
