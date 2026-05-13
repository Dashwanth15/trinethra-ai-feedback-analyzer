import { useRef } from "react";
import Layout from "./components/Layout";
import TranscriptInput from "./components/TranscriptInput";
import EvidenceList from "./components/EvidenceList";
import RubricScore from "./components/RubricScore";
import KpiTags from "./components/KpiTags";
import GapAnalysis from "./components/GapAnalysis";
import FollowUpQuestions from "./components/FollowUpQuestions";
import ConfidenceBadge from "./components/ConfidenceBadge";
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
  const showLowConfidence = result?.confidence_label === "low" && result?.success;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <TranscriptInput onAnalyze={handleAnalyze} loading={loading} />

        {loading && <LoadingSkeleton />}

        {error && (
          <ErrorBanner
            message={error}
            onRetry={() => {
              /* user can edit transcript and resubmit */
            }}
          />
        )}

        {result && !loading && (
          <div ref={resultsRef} className="mt-8 space-y-6">
            {showLowConfidence && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                This analysis required multiple attempts. Please review the
                evidence carefully before using it.
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Analysis Results
              </h2>
              <ConfidenceBadge
                label={result.confidence_label}
                retryCount={result.retry_count}
              />
            </div>

            {result.success && data ? (
              <>
                <RubricScore rubric={data.rubric} />
                <EvidenceList evidence={data.evidence} />
                <KpiTags kpis={data.kpis} />
                <GapAnalysis gaps={data.gaps} />
                <FollowUpQuestions questions={data.follow_up_questions} />
                <div className="text-xs text-gray-400 text-right">
                  Processed in {result.processing_time_ms.toLocaleString()}ms
                </div>
              </>
            ) : (
              <ErrorBanner
                message={
                  result.error_message ||
                  "Analysis could not be completed."
                }
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
