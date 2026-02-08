import React, { useEffect, useState } from "react";
import { api } from "./api.js";

const emptyTask = { title: "", description: "", status: "todo" };

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [taskError, setTaskError] = useState("");

  useEffect(() => {
    api.me()
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    api.listTasks()
      .then((data) => setTasks(data.tasks))
      .catch(() => setTasks([]));
  }, [user]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthError("");

    try {
      const payload = { email: form.email, password: form.password };
      const data = authMode === "login" ? await api.login(payload) : await api.register(payload);
      setUser(data);
      setForm({ email: "", password: "" });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  const handleTaskCreate = async (event) => {
    event.preventDefault();
    setTaskError("");
    try {
      const data = await api.createTask(taskForm);
      setTasks((prev) => [data.task, ...prev]);
      setTaskForm(emptyTask);
    } catch (err) {
      setTaskError(err.message);
    }
  };

  const handleDelete = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  if (loading) {
    return <div className="page">Chargement...</div>;
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Questify</h1>
          <p>Gestionnaire de tâches SaaS light, pret a etre dockerisé.</p>
        </div>
        {user && (
          <div className="user-chip">
            <span>{user.email}</span>
            <button type="button" onClick={handleLogout}>Se déconnecter</button>
          </div>
        )}
      </header>

      {!user ? (
        <section className="card auth">
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Connexion
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Inscription
            </button>
          </div>
          <form onSubmit={handleAuth}>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Mot de passe
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            {authError && <p className="error">{authError}</p>}
            <button type="submit" className="primary">
              {authMode === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          </form>
        </section>
      ) : (
        <main className="content">
          <section className="card">
            <h2>Nouvelle tâche</h2>
            <form onSubmit={handleTaskCreate} className="task-form">
              <label>
                Titre
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  rows="3"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </label>
              <label>
                Statut
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                >
                  <option value="todo">A faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </label>
              {taskError && <p className="error">{taskError}</p>}
              <button type="submit" className="primary">Créer</button>
            </form>
          </section>

          <section className="card">
            <h2>Mes tâches</h2>
            {tasks.length === 0 ? (
              <p>Aucune tâche pour le moment.</p>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <article key={task.id} className="task-item">
                    <div>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <span className={`status ${task.status}`}>{task.status}</span>
                    </div>
                    <button type="button" onClick={() => handleDelete(task.id)}>
                      Supprimer
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
