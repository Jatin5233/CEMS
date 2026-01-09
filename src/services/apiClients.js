const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// Default headers for all requests
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Get auth token from localStorage if available
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Main API client function
export async function apiClient(endpoint, options = {}) {
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.message || `API error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

// GET request helper
export async function get(endpoint) {
  return apiClient(endpoint, { method: "GET" });
}

// POST request helper
export async function post(endpoint, data) {
  return apiClient(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT request helper
export async function put(endpoint, data) {
  return apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE request helper
export async function del(endpoint) {
  return apiClient(endpoint, { method: "DELETE" });
}

// Patch request helper
export async function patch(endpoint, data) {
  return apiClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
