import { useRef } from "react";
import Layout from "./components/Layout";
import TranscriptInput from "./components/TranscriptInput";
import ScoreCard from "./components/ScoreCard";
import SummaryCard from "./components/SummaryCard";
import StrengthsWeaknessesCard from "./components/StrengthsWeaknessesCard";
import EvidenceCard from "./components/EvidenceCard";
import CoverageCard from "./components/CoverageCard";
import GapsCard from "./components/GapsCard";
import ReasoningCard from "./components/ReasoningCard";
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

        {/* Input panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <TranscriptInput onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Network / server error */}
        {error && <ErrorBanner message={error} />}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef} className="space-y-4">

            {result.success && data ? (
              <>
                {/* AI Disclaimer banner */}
                <div className="flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-600">
                  <span className="text-base shrink-0">🤖</span>
                  <span>
                    <strong>AI-generated draft analysis.</strong>{" "}
                    Human review recommended before sharing or acting on this output.
                  </span>
                </div>

                {/* 1 — Score (with confidence) */}
                <ScoreCard
                  score={data.score}
                  confidence={data.confidence}
                  processingTimeMs={result.processing_time_ms}
                />

                {/* 2 — Executive Summary */}
                <SummaryCard summary={data.summary} />

                {/* 3 — Reasoning Notes */}
                <ReasoningCard reasoning={data.reasoning} />

                {/* 4 — Assessment Coverage grid */}
                <CoverageCard gaps={data.gaps} />

                {/* 5 — Strengths + Improvement Areas */}
                <StrengthsWeaknessesCard
                  strengths={data.strengths}
                  weaknesses={data.weaknesses}
                />

                {/* 6 — Evidence (verbatim citations) */}
                <EvidenceCard evidence={data.evidence} />

                {/* 7 — Missing evaluation areas */}
                <GapsCard gaps={data.gaps} />

                {/* 8 — Follow-up Questions */}
                <FollowUpQuestions questions={data.questions} />
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
