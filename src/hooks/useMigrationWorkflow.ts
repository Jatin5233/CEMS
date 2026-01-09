import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClients";

export interface MigrationRequest {
  id: string;
  applicantName: string;
  epicNumber: string;
  oldConstituency: string;
  oldState: string;
  newConstituency: string;
  newState: string;
  appliedDate: string;
  status: "pending" | "partial" | "completed" | "rejected";
  currentStage: string;
}

export interface MigrationFilters {
  status?: "pending" | "partial" | "completed" | "rejected";
  state?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useMigrationWorkflow(filters?: MigrationFilters) {
  const [migrations, setMigrations] = useState<MigrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMigrations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (filters?.status) params.append("status", filters.status);
        if (filters?.state) params.append("state", filters.state);
        if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
        if (filters?.dateTo) params.append("dateTo", filters.dateTo);

        const endpoint = `/migrations${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await apiClient(endpoint);
        setMigrations(response.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch migration requests");
        console.error("Migration workflow fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMigrations();
  }, [filters]);

  const approveMigration = async (migrationId: string): Promise<boolean> => {
    try {
      setLoading(true);
      await apiClient(`/migrations/${migrationId}/approve`, {
        method: "POST",
      });
      // Refresh the list after approval
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.state) params.append("state", filters.state);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.append("dateTo", filters.dateTo);

      const endpoint = `/migrations${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient(endpoint);
      setMigrations(response.data || []);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve migration");
      console.error("Migration approval error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectMigration = async (migrationId: string, reason?: string): Promise<boolean> => {
    try {
      setLoading(true);
      await apiClient(`/migrations/${migrationId}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      // Refresh the list after rejection
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.state) params.append("state", filters.state);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.append("dateTo", filters.dateTo);

      const endpoint = `/migrations${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient(endpoint);
      setMigrations(response.data || []);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject migration");
      console.error("Migration rejection error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    migrations,
    loading,
    error,
    approveMigration,
    rejectMigration,
  };
}