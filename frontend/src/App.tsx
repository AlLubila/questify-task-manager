import React, { useMemo, useState } from "react";
import { API_BASE } from "./api";

type Task = {
  id: number;
  title: string;
};

type User = {
  email: string;
  token: string;
};

const seedTasks: Task[] = [
  { id: 1, title: "Review product brief" },
  { id: 2, title: "Prepare demo script" }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("demo@questify.local");
  const [password, setPassword] = useState("password123");
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => ({ total: tasks.length }), [tasks]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }
      const data = await response.json();
      setUser({ email: data.user.email, token: data.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const addTask = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!title.trim()) return;

    if (!user) {
      setError("Please login first.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to create task");
      }
      const data = await response.json();
      setTasks((prev) => [data.task, ...prev]);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create task");
    }
  };

  const deleteTask = async (id: number) => {
    if (!user) {
      setError("Please login first.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(data.error || "Unable to delete task");
      }
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task");
    }
  };

  const logout = async () => {
    if (!user) return;
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setUser(null);
    setTasks([]);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Tasks Hub</p>
          <h1>Operational task control in one place.</h1>
          <p className="subtitle">Login to view and manage your tasks through the API.</p>
        </div>
        <div className="hero-card">
          <div>
            <span className="stat-label">Tasks</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span className="stat-label">Status</span>
            <strong>{user ? "Connected" : "Guest"}</strong>
          </div>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <h2>{user ? "Connected" : "Login"}</h2>
          {!user ? (
            <form className="form" onSubmit={login}>
              <label>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              <button className="primary" type="submit">Sign in</button>
            </form>
          ) : (
            <div className="connected">
              <p>Signed in as {user.email}</p>
              <button className="secondary" type="button" onClick={logout}>Sign out</button>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Tasks</h2>
            <span className="badge">{tasks.length}</span>
          </div>
          <form className="form" onSubmit={addTask}>
            <label>
              Task title
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <button className="primary" type="submit">Add task</button>
          </form>
          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="empty">No tasks yet.</p>
            ) : (
              tasks.map((task) => (
                <article key={task.id} className="task">
                  <span>{task.title}</span>
                  <button type="button" onClick={() => deleteTask(task.id)}>Delete</button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
