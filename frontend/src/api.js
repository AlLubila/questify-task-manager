const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      credentials: "include",
      ...options
    }
  );

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const api = {
  me: () => request("/api/auth/me"),
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  listTasks: () => request("/api/tasks"),
  createTask: (payload) => request("/api/tasks", { method: "POST", body: JSON.stringify(payload) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: "DELETE" })
};
