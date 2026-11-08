import { fetchTasks, updateTask, toggleCompletion } from "./api.js";
const addForm = document.getElementById("add-form");
const mainContent = document.getElementById("container");

const knownCodes = [
  "TASK_NOT_FOUND",
  "INVALID_INPUT",
  "TITLE_TOO_SHORT",
  "TITLE_TOO_LONG",
];

export async function renderTasks() {
  try {
    const tasks = await fetchTasks();

    const emptyState = document.getElementById("empty-state");
    if (emptyState) emptyState.remove();

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
  } catch (error) {
    handleInitialUiError(error);
  }
}

function handleInitialUiError(error) {
  const uiError = document.createElement("div");
  uiError.className = "ui-err";
  const errText = document.createElement("h2");
  errText.className = "ui-err-text";
    errText.textContent = knownCodes.includes(error.code)
    ? error.message
    : "Could not complete the request. Please try again.";
  document.body.append(uiError);
  uiError.append(errText);
}

function createTaskElements(task, listContainer) {
  //Buttons
  const listItem = document.createElement("li");
  const deleteBtn = document.createElement("button");
  const completeBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const taskText = document.createElement("span");

  completeBtn.textContent = "Mark Completed";
  completeBtn.className = "completeBtn";
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "deleteBtn";
  editBtn.textContent = "Edit";
  editBtn.className = "editBtn";

  listItem.id = `task-${task.id}`;
  taskText.textContent = task.task_title;
  listItem.append(taskText);

  renderTaskCompletion(task, taskText, completeBtn);

  completeBtn.addEventListener("click", async () => {
    try {
      const result = await toggleCompletion(task.id);
      renderTaskCompletion(result.task, taskText, completeBtn);
    } catch (error) {
      handleUpdateError(error);
    }
  });

  editBtn.addEventListener("click", async () => {
    const task_title = prompt("Enter new title:");
    if (task_title === null) return;
    try {
      const result = await updateTask(task.id, { task_title });
      renderTitleUpdate(result.task, taskText); //taskText will be available because of closure.
    } catch (error) {
      handleUpdateError(error);
    }
  });

  deleteBtn.addEventListener("click", () => {
    deleteTaskById(task.id);
    renderDeletion(listItem, listContainer);
  });

  listItem.append(completeBtn, editBtn, deleteBtn);
  listContainer.append(listItem);
}

function renderDeletion(listItem, listContainer) {
  listContainer.remove(listItem);
}

function handleUpdateError(error) {
  const errorBlock = document.createElement("div");
  errorBlock.className = "err-block";
  document.body.append(errorBlock);
  const errText = document.createElement("h2");
  errText.className = "update-err";
  errText.style.cssText = "color: red";

  errText.textContent = knownCodes.includes(error.code)
    ? error.message
    : "Could not complete the request. Please try again.";

  errorBlock.append(errText);

  setTimeout(() => {
    errorBlock.remove();
  }, 3000);

  console.error(error);
}

function renderTaskCompletion(task, taskText, completeBtn) {
  taskText.style.textDecoration = task.is_complete ? "line-through" : "none";
  taskText.parentElement.classList.toggle("is-complete", task.is_complete);

  if (!completeBtn) return;
  completeBtn.setAttribute("aria-pressed", String(task.is_complete));
  completeBtn.textContent = task.is_complete
    ? "Undo Completed"
    : "Mark Completed";
}

function renderTitleUpdate(task, taskText) {
  taskText.textContent = task.task_title;
}

export function displayAddTask() {
  const addInput = document.getElementById("add");
  const btn = document.getElementById("btn");

  // Input Event listener
  addInput.addEventListener("input", () => {
    btn.disabled = addInput.value.trim() === "";
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskTitle = addInput.value.trim();
    addTask(taskTitle);
    addInput.value = "";
    btn.disabled = true;
    // renderTasks();
  });
}
