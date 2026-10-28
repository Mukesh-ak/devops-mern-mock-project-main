
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = `${import.meta.env.VITE_API_URL}/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
       setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await axios.post(API, { text: text.trim() });
      setText('');
      await fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setCompleted(prev => prev.filter(taskId => taskId !== id));
      await fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleTask = (id) => {
    setCompleted(prev =>
      prev.includes(id)
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedCount = tasks.filter(task =>
    completed.includes(task._id)
  ).length;

  return (
    <main className="app">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="todo-card">
        <header className="header">
          <div className="logo">
            <span>✓</span>
          </div>

          <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
          <h1>Make today<br /> <span>count.</span></h1>
          <p>Small steps every day lead to big results.</p>
        </header>

        <div className="progress-section">
          <div className="progress-label">
            <span>Your progress</span>
            <strong>{completedCount}/{tasks.length} completed</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${tasks.length
                  ? (completedCount / tasks.length) * 100
                  : 0}%`
              }}
            />
          </div>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What needs to get done?"
            aria-label="New task"
          />
          <button type="submit" className="add-button">
            <span>+</span> Add task
          </button>
        </form>

        <div className="list-heading">
          <h2>My tasks</h2>
          <span className="task-count">{tasks.length}</span>
        </div>

        <div className="task-list">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>A fresh start!</h3>
              <p>Add your first task and make it happen.</p>
            </div>
          ) : (
            tasks.map(task => {
              const isDone = completed.includes(task._id);

              return (
                <div
                  className={`task-item ${isDone ? 'completed' : ''}`}
                  key={task._id}
                >
                  <button
                    className="check-button"
                    onClick={() => toggleTask(task._id)}
                    aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                    type="button"
                  >
                    {isDone && '✓'}
                  </button>

                  <span className="task-text">{task.text}</span>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task._id)}
                    aria-label="Delete task"
                    type="button"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <footer className="footer">
          <span><span className="status-dot" /> All progress starts somewhere</span>
          <span>BUILT FOR FOCUS ✦</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
