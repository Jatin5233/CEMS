import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClients";

export interface PollingStation {
  id: string;
  name: string;
  code: string;
  district: string;
  constituency: string;
  location: string;
  address: string;
  capacity: number;
  assignedBLOs: number;
  electorsRegistered: number;
  status: "active" | "pending" | "inactive";
}

export function usePollingStations(district?: string, constituency?: string) {
  const [stations, setStations] = useState<PollingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        let endpoint = "/polling-stations";
        const params = new URLSearchParams();
        
        if (district) params.append("district", district);
        if (constituency) params.append("constituency", constituency);
        
        if (params.toString()) {
          endpoint += `?${params.toString()}`;
        }

        const response = await apiClient(endpoint);
        setStations(response.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch polling stations");
        console.error("Polling stations fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [district, constituency]);

  return { stations, loading, error };
}
