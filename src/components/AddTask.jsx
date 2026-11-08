
import { useEffect, useState } from "react";
import { createTask, updateTask } from "../services/api";

function AddTask({ onTaskCreated, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "Medium");
      setDeadline(
        editingTask.deadline
          ? new Date(editingTask.deadline).toISOString().split("T")[0]
          : "",
      );
      setError("");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setError("");
    }
  }, [editingTask]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        deadline: deadline || null,
      };

      if (!taskData.title) {
        throw new Error("Task title is required.");
      }

      if (editingTask) {
        await updateTask(editingTask._id, taskData, token);
        onCancelEdit();
      } else {
        await createTask(taskData, token);
      }

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");

      await onTaskCreated();
    } catch (err) {
      setError(err.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const labelStyle = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
          {editingTask ? "✏️" : "✨"}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {editingTask ? "Edit Task" : "Create a New Task"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {editingTask
              ? "Update your task details below."
              : "Plan your work and stay on track."}
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div>
        <label className={labelStyle}>
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Complete DSA assignment"
          required
          className={inputStyle}
        />
      </div>

      <div>
        <label className={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What do you need to get done?"
          rows={3}
          className={`${inputStyle} resize-y`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className={inputStyle}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : editingTask
              ? "Save Changes"
              : "+ Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddTask;
