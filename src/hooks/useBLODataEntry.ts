import { useState } from "react";
import { apiClient, post } from "../services/apiClients";

export interface BLOElectorData {
  firstName: string;
  middleName?: string;
  lastName: string;
  firstNameLocal?: string;
  fatherName: string;
  gender: "male" | "female" | "other";
  dob: string;
  mobile?: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
  state: string;
  district: string;
  constituency: string;
  // File uploads would be handled separately
}

export interface BLOEntryResponse {
  success: boolean;
  data?: {
    id: string;
    status: "draft" | "submitted";
    message: string;
  };
  message: string;
}

export function useBLODataEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitElectorData = async (data: BLOElectorData, action: "draft" | "submit"): Promise<BLOEntryResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        action, // "draft" or "submit"
        submittedAt: new Date().toISOString(),
      };

      const response = await post("/blo/electors", payload);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit elector data";
      setError(errorMessage);
      console.error("BLO data entry error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (electorId: string, documentType: string, file: File): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      formData.append("electorId", electorId);

      // Note: This would need a separate endpoint for file uploads
      // For now, we'll use the apiClient but it may need modification for FormData
      await apiClient(`/blo/documents/upload`, {
        method: "POST",
        body: formData,
        // Remove Content-Type header to let browser set it with boundary
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload document";
      setError(errorMessage);
      console.error("Document upload error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitElectorData,
    uploadDocument,
    loading,
    error,
  };
}