import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClients";

export interface StateData {
  state: string;
  electors: number;
  short: string;
}

export interface MigrationTrend {
  month: string;
  migrations: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface DashboardMetrics {
  totalElectors: number;
  pendingMigrations: number;
  duplicateAlerts: number;
  dataQualityScore: number;
  activePollingStations: number;
}

export function useDashboardData() {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [migrationTrend, setMigrationTrend] = useState<MigrationTrend[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statesRes, trendsRes, categoriesRes, metricsRes] = await Promise.all([
          apiClient("/dashboard/states"),
          apiClient("/dashboard/migration-trends"),
          apiClient("/dashboard/categories"),
          apiClient("/dashboard/metrics"),
        ]);

        setStateData(statesRes.data || []);
        setMigrationTrend(trendsRes.data || []);
        setCategoryData(categoriesRes.data || []);
        setMetrics(metricsRes.data || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stateData, migrationTrend, categoryData, metrics, loading, error };
}
