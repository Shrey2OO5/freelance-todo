import { renderTasks, renderUpdatedTask, createTaskElements } from "./ui.js";
let globalCounter = 0;

function toggleTaskCompletion(task) {
  task.completed = !task.completed;
}

function deleteTask(id, tasks) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  console.log(tasks);
}

function updateTask(task, elements) {
  const updateText = prompt(`${task.task}`);
  if (updateText === null) return;
  const trimmed = updateText.trim();
  if (trimmed === "") return;
  task.task = trimmed;
  renderUpdatedTask(trimmed, elements);
}

function addTask(tasks, listContainer, addInput, btn) {
  const taskName = addInput.value.trim();
  if (taskName === "") return;
  const elements = createTaskElements();
  const id = globalCounter++;

  const task = {
    id,
    task: taskName,
    completed: false,
  };

  tasks.push(task);
  renderTasks(
    tasks,
    task,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    listContainer,
    btn,
    elements,
    addInput,
  );
  console.log(tasks);
}

export default addTask;
