const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function testBackend() {
  const response = await fetch(`${API_URL}/api/test`)
  const data = await response.json()
  return data
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }

  return data
}


export async function getTasks(token) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tasks")
  }

  return data
}

export async function createTask(taskData, token) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task")
  }

  return data
}

export async function updateTask(taskId, updates, token) {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task")
  }

  return data
}

export async function deleteTask(taskId, token) {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task")
  }

  return data
}