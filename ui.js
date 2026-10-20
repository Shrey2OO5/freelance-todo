function createTaskElements() {
  //Buttons
  const listItem = document.createElement("li");
  const deleteBtn = document.createElement("button");
  const completeBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const taskText = document.createElement("span");

  completeBtn.textContent = "Mark Completed";
  deleteBtn.textContent = "Delete";
  editBtn.textContent = "Edit";

  //Button styles
  completeBtn.style.cssText =
    "color: white; margin-left: 12px; background-color:green; border-radius: 12px; padding: 12px;";
  deleteBtn.style.cssText =
    "color: white; margin-left: 12px; background-color:red; border-radius: 12px; padding: 12px;";
  editBtn.style.cssText =
    "color: white; margin-left: 12px; background-color:blue; border-radius: 12px; padding: 12px;";
  return {
    listItem,
    deleteBtn,
    completeBtn,
    editBtn,
    taskText,
  };
}

function renderTaskCompletion(task, elements) {
  elements.taskText.style.textDecoration = task.completed
    ? "line-through"
    : "none";

  elements.completeBtn.textContent = task.completed
    ? "Undo Completed"
    : "Mark Completed";
}

function renderUpdatedTask(text, elements) {
  elements.taskText.textContent = text;
}

function renderDelete(elements) {
  elements.listItem.remove();
}

function renderTasks(
  tasks,
  task,
  toggleTaskCompletion,
  deleteTask,
  updateTask,
  listContainer,
  btn,
  elements,
  addInput,
) {
  elements.listItem.id = `task-${task.id}`;
  elements.taskText.textContent = task.task;
  elements.listItem.append(elements.taskText);

  elements.completeBtn.addEventListener("click", () => {
    toggleTaskCompletion(task);
    renderTaskCompletion(task, elements);
  });

  elements.deleteBtn.addEventListener("click", () => {
    deleteTask(task.id, tasks);
    renderDelete(elements);
  });

  elements.editBtn.addEventListener("click", () => {
    updateTask(task, elements);
  });

  elements.listItem.append(
    elements.completeBtn,
    elements.editBtn,
    elements.deleteBtn,
  );
  listContainer.append(elements.listItem);
  addInput.value = "";
  btn.disabled = true;
}

export { renderTasks, renderUpdatedTask, createTaskElements };
