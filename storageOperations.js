/**
 * Only storage related operations happen here.
 * This file is single source of truth.
 */

const id = Number(localStorage.getItem("global-id"));
const tasksExist = JSON.parse(localStorage.getItem("tasks"));
if ((Number.isNaN(id) || id < 1) && !tasksExist)
  localStorage.setItem("global-id", "0");

export function getTask(id) {
  const tasks = getAllTasks();
  if (tasks === null || tasks.length === 0) return null;
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  return task;
}

export function getAllTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks === null || tasks.length === 0) return [];
  return tasks;
}

export function createTask(taskData) {
  const tasks = getAllTasks();
  const storedCounter = Number(localStorage.getItem("global-id"));

  const highestTaskId = tasks.reduce(
    (highest, task) => Math.max(highest, task.id),
    0,
  );

  const validCounter =
    Number.isSafeInteger(storedCounter) && storedCounter >= 0
      ? storedCounter
      : 0;

  const id = Math.max(validCounter, highestTaskId) + 1;

  const { taskTitle, isComplete } = taskData;
  let task = { id, taskTitle, isComplete };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("global-id", `${id}`)
  return tasks;
}

export function updateTask(id, data) {
  const tasks = getAllTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return tasks;
  const task = tasks[index];

  tasks[index] = {
    ...task,
    taskTitle: data.taskTitle ?? task.taskTitle,
    isComplete: data.isComplete ?? task.isComplete,
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return tasks[index];
}

export function deleteTask(id) {
  const tasks = getAllTasks();
  if (tasks.length === 0) return tasks;
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return tasks;
}

export function deleteAllTasks() {
  localStorage.removeItem("tasks");
}
