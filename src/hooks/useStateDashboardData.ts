import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClients";

export interface District {
  district: string;
  electors: number;
  pending: number;
  stations: number;
}

export interface Constituency {
  name: string;
  electors: number;
  pending: number;
  verified: number;
  station: string;
}

export interface StateDashboardData {
  states: string[];
  districts: string[];
  districtData: District[];
  constituencies: Constituency[];
}

export function useStateDashboardData(state: string, district: string) {
  const [data, setData] = useState<StateDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiClient(`/dashboard/state?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
        setData(result.data || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch state dashboard data");
        console.error("State dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state, district]);

  return { data, loading, error };
}
