import { useState, useCallback } from "react";
import { analyzeTranscript } from "../api/client";

export function useAnalyze() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (transcript) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeTranscript(transcript);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { analyze, reset, result, loading, error };
}
