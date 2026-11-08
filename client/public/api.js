const url = "http://localhost:5000/tasks";

export async function fetchTasks() {
  const response = await fetch(`${url}`);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message);
    error.code = data.errorCode;
    throw error;
  }
  return data.tasks;
}

export async function updateTask(id, payload) {
  const urlWithParams = `${url}/${id}`;

  const response = await fetch(urlWithParams, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message);
    error.code = data.errorCode;
    throw error;
  }
  return data;
}

export async function toggleCompletion(id) {
  const urlWithParams = `${url}/${id}/completion`;
  const response = await fetch(urlWithParams, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message);
    error.code = data.errorCode;
    throw error;
  }
  return data;
}
