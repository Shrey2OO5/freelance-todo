import {
  getTasks,
  toggleCompletion,
  updateTaskById,
  deleteTaskById,
  addTask
} from "./services.js";

const addForm = document.getElementById("add-form")
const mainContent = document.getElementById("container")

export function renderTasks() {
  const tasks = getTasks();

  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.remove();
  const existingList = document.getElementById("list-container");
  if (existingList) existingList.remove();

  if (tasks.length === 0) {
    const msg = document.createElement("h2");
    msg.id = "empty-state";
    msg.textContent = "A clear list. Add your first task above.";
    mainContent.append(msg);
    return;
  }

  const listContainer = document.createElement("ul");
  listContainer.id = "list-container";
  mainContent.append(listContainer);

  for (let task of tasks) {
    createTaskElements(task, listContainer);
  }
}

function createTaskElements(task, listContainer) {
  //Buttons
  const listItem = document.createElement("li");
  const deleteBtn = document.createElement("button");
  const completeBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const taskText = document.createElement("span");

  completeBtn.textContent = "Mark Completed";
  completeBtn.className = "completeBtn"
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "deleteBtn"
  editBtn.textContent = "Edit";
  editBtn.className = "editBtn";

  listItem.id = `task-${task.id}`;
  taskText.textContent = task.taskTitle;
  listItem.append(taskText);

  renderTaskCompletion(task, taskText, completeBtn);

  completeBtn.addEventListener("click", () => {
    toggleCompletion(task.id);
    renderTasks();
  });
  editBtn.addEventListener("click", () => {
    const updatedTitle = prompt("Enter new title:");
    if (updatedTitle === null) return;
    updateTaskById(task.id, updatedTitle);
    renderTasks();
  });
  deleteBtn.addEventListener("click", () => {
    deleteTaskById(task.id);
    renderTasks();
  });
  listItem.append(completeBtn, editBtn, deleteBtn);
  listContainer.append(listItem);
}

function renderTaskCompletion(task, taskText, completeBtn) {
  taskText.style.textDecoration = task.isComplete ? "line-through" : "none";
  taskText.parentElement.classList.toggle("is-complete", task.isComplete);

  if (!completeBtn) return;
  completeBtn.setAttribute("aria-pressed", String(task.isComplete));
  completeBtn.textContent = task.isComplete
    ? "Undo Completed"
    : "Mark Completed";
}

export function displayAddTask() {
  
const addInput = document.getElementById("add")
const btn = document.getElementById("btn")

// Input Event listener
addInput.addEventListener("input", () => {
  btn.disabled = addInput.value.trim() === "";
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
   const taskTitle = addInput.value.trim();
  addTask(taskTitle)
  addInput.value = ""
  btn.disabled = true
  renderTasks()
})
}
