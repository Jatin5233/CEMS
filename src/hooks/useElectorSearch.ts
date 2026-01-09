import { useState } from "react";
import { apiClient } from "../services/apiClients";

export interface ElectorProfile {
  id: string;
  name: string;
  epicNumber: string;
  fatherName: string;
  dob: string;
  gender: string;
  state: string;
  district: string;
  constituency: string;
  pollingStation: string;
  address: string;
  phone?: string;
  email?: string;
  status: "verified" | "pending" | "rejected";
  enrollmentDate: string;
}

export function useElectorSearch() {
  const [result, setResult] = useState<ElectorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByEpic = async (epicNumber: string) => {
    try {
      setLoading(true);
      const response = await apiClient(`/electors/search/epic/${encodeURIComponent(epicNumber)}`);
      setResult(response.data || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async (name: string) => {
    try {
      setLoading(true);
      const response = await apiClient(`/electors/search/name/${encodeURIComponent(name)}`);
      setResult(response.data || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const searchByMobile = async (mobile: string) => {
    try {
      setLoading(true);
      const response = await apiClient(`/electors/search/mobile/${encodeURIComponent(mobile)}`);
      setResult(response.data || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, searchByEpic, searchByName, searchByMobile };
}
