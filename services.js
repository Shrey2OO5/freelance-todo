import { getAllTasks, createTask, updateTask, deleteTask, getTask, deleteAllTasks } from "./storageOperations.js"

export function getTasks() {
  return getAllTasks();
}

export function toggleCompletion(id) {
const task = getTask(id);
if (task === null) return null;
const isComplete = !task.isComplete;
return updateTask(id, {isComplete});
}

export function deleteTaskById(id) {
  return deleteTask(id);
}

export function updateTaskById(id, updatedTitle) {
  const taskTitle = updatedTitle.trim();
  if(taskTitle === "") return null;
  return updateTask(id, {taskTitle});
}

export function addTask(taskInput) {
  const taskName = taskInput.trim();
  if (taskName === "") return;
  const task = {
    taskTitle: taskName,
    isComplete: false,
  };

  return createTask(task);
}

export function deleteTasks() {
  deleteAllTasks();
}

export default addTask;
