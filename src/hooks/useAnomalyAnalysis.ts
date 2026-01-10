import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClients";

export interface AnomalyDetail {
  type: string;
  severity: "Low" | "Medium" | "High";
  description: string;
  additionalInfo: string;
  detectionDate: string;
}

export interface AnomalyRecord {
  id: string;
  voterId: string;
  voterName: string;
  constituency: string;
  district: string;
  state: string;
  anomalyTypes: string[];
  severity: "Low" | "Medium" | "High";
  sourceClassification: string;
  lastReviewed: string;
  dateOfBirth: string;
  age: number;
  address: string;
  relativeInfo: string;
  anomalyDetails: AnomalyDetail[];
}

export interface AnomalyCategory {
  id: string;
  label: string;
  count: number;
}

export interface AnomalyAnalysisData {
  totalFlagged: number;
  highSeverity: number;
  mediumSeverity: number;
  anomalyCategories: number;
  categories: AnomalyCategory[];
  records: AnomalyRecord[];
}

export function useAnomalyAnalysis(category: string) {
  const [data, setData] = useState<AnomalyAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiClient(
          `/anomaly-analysis?category=${encodeURIComponent(category)}`
        );
        setData(result.data || null);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch anomaly analysis data"
        );
        console.error("Anomaly analysis data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return { data, loading, error };
}
