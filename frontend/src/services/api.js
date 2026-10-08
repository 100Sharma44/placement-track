const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || "Something went wrong. Please try again.");
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  getAnalytics: () => request("/analytics"),
  getApplications: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value)
    );
    const query = params.toString();
    return request(`/applications${query ? `?${query}` : ""}`);
  },
  getApplication: (id) => request(`/applications/${id}`),
  createApplication: (data) => request("/applications", { method: "POST", body: JSON.stringify(data) }),
  updateApplication: (id, data) =>
    request(`/applications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: "DELETE" }),
};
