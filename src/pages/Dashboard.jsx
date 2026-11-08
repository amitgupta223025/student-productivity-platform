import { useEffect, useState } from "react";
import AddTask from "../components/AddTask";
import { getTasks, updateTask, deleteTask } from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function loadTasks() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your tasks.");
        }

        const data = await getTasks(token);
        setTasks(data.tasks);
      } catch (err) {
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" && task.completed) ||
        (statusFilter === "Pending" && !task.completed);

      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      }

      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      // Default: newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  async function refreshTasks() {
    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const data = await getTasks(token);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    }
  }

  async function handleToggleComplete(task) {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      await updateTask(task._id, { completed: !task.completed }, token);

      await refreshTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      await deleteTask(taskId, token);
      await refreshTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  }

  function handleEditTask(task) {
    setEditingTask(task);
  }

  const getDeadlineStatus = (task) => {
    if (task.completed) {
      return {
        label: "Completed",
        style: "bg-green-100 text-green-700",
      };
    }

    if (!task.deadline) {
      return {
        label: "No deadline",
        style: "bg-slate-100 text-slate-600",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < today) {
      return {
        label: "Overdue",
        style: "bg-red-100 text-red-700",
      };
    }

    if (deadline.getTime() === today.getTime()) {
      return {
        label: "Due Today",
        style: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "Upcoming",
      style: "bg-blue-100 text-blue-700",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome to StudyFlow
        </h1>

        <p className="mt-2 text-slate-600">
          Manage your tasks and stay organized.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <span className="rounded-lg bg-blue-100 p-2 text-blue-700">
                📚
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">
              {tasks.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              All your tasks in one place
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <span className="rounded-lg bg-green-100 p-2 text-green-700">
                ✓
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-green-600">
              {completedTasks}
            </p>
            <p className="mt-2 text-sm text-slate-500">Tasks you've finished</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <span className="rounded-lg bg-orange-100 p-2 text-orange-700">
                ◷
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-orange-600">
              {pendingTasks}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Still on your to-do list
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Your Tasks</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="🔍 Search tasks..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
              <option value="deadline">Nearest Deadline</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <AddTask
            onTaskCreated={refreshTasks}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />

          {loading && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
              <p className="text-sm font-medium text-blue-800">
                Loading your tasks...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">Something went wrong</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}
          {!loading && !error && tasks.length === 0 && (
            <p className="mt-4 rounded-xl bg-white p-6 text-slate-500 shadow-sm">
              No tasks yet. Your tasks will appear here once you add them.
            </p>
          )}

          <div className="mt-4 space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="text-4xl">
                  {tasks.length === 0 ? "📋" : "🔎"}
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {tasks.length === 0
                    ? "Add your first task using the form above and start organizing your day."
                    : "Try another search term or adjust your priority and status filters."}
                </p>

                {tasks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setPriorityFilter("All");
                      setStatusFilter("All");
                    }}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => {
                const priorityStyle = {
                  High: "bg-red-100 text-red-700 ring-red-200",
                  Medium: "bg-amber-100 text-amber-700 ring-amber-200",
                  Low: "bg-emerald-100 text-emerald-700 ring-emerald-200",
                };

                return (
                  <div
                    key={task._id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${
                      task.completed
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex gap-3">
                        <div
                          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            task.completed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {task.completed ? "✓" : "📝"}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className={`wrap-break-words text-lg font-bold ${
                              task.completed
                                ? "text-slate-500 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="mt-2 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-slate-600">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                          priorityStyle[task.priority] ||
                          "bg-slate-100 text-slate-700 ring-slate-200"
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
                          📅{" "}
                          {task.deadline
                            ? new Date(task.deadline).toLocaleDateString()
                            : "No deadline"}
                        </span>

                        <span
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${getDeadlineStatus(task).style}`}
                        >
                          {getDeadlineStatus(task).label}
                        </span>
                      </div>

                      <div className="ml-auto flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            task.completed
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                        >
                          {task.completed ? "Undo" : "✓ Complete"}
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
