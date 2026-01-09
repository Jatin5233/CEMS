import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClients";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  userRole: string;
  module: string;
  recordId?: string;
  details: string;
  ipAddress: string;
  status: "success" | "failure";
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  action?: string;
  module?: string;
  status?: "success" | "failure";
}

export function useAuditLog(filters?: AuditLogFilters, limit: number = 50) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: limit.toString() });
        
        if (filters?.startDate) params.append("startDate", filters.startDate);
        if (filters?.endDate) params.append("endDate", filters.endDate);
        if (filters?.action) params.append("action", filters.action);
        if (filters?.module) params.append("module", filters.module);
        if (filters?.status) params.append("status", filters.status);

        const response = await apiClient(`/audit-logs?${params.toString()}`);
        setLogs(response.data || []);
        setTotal(response.total || 0);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch audit logs");
        console.error("Audit logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters, limit]);

  return { logs, total, loading, error };
}
