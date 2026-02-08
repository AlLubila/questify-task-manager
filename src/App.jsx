import React, { useMemo, useState } from "react";

const initialTasks = [
  { id: 1, title: "Review onboarding docs", status: "todo" },
  { id: 2, title: "Prepare demo checklist", status: "in-progress" },
  { id: 3, title: "Send weekly update", status: "done" }
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "done").length;
    return { total, done };
  }, [tasks]);

  const handleAdd = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const next = {
      id: Date.now(),
      title: trimmed,
      status
    };

    setTasks((prev) => [next, ...prev]);
    setTitle("");
    setStatus("todo");
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Questify Tasks</p>
          <h1>Simple task board, focused on execution.</h1>
          <p className="subtitle">
            Lightweight frontend-only app built for local development and container practice.
          </p>
        </div>
        <div className="hero-card">
          <div>
            <span className="stat-label">Total tasks</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span className="stat-label">Done</span>
            <strong>{stats.done}</strong>
          </div>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <h2>Create task</h2>
          <form onSubmit={handleAdd} className="form">
            <label>
              Title
              <input
                type="text"
                placeholder="Write a clear task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <button type="submit" className="primary">Add task</button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Task list</h2>
            <span className="badge">{tasks.length} items</span>
          </div>
          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="empty">No tasks yet. Add one on the left.</p>
            ) : (
              tasks.map((task) => (
                <article key={task.id} className="task">
                  <div>
                    <h3>{task.title}</h3>
                    <span className={`chip ${task.status}`}>{task.status}</span>
                  </div>
                  <button type="button" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
