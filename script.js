const addInput = document.querySelector("#add");
const btn = document.querySelector("#btn");

const listContainer = document.createElement("ul");
listContainer.id = "list-container";
document.body.append(listContainer);

const tasks = [];
let globalCounter = 0;

// Input Event listener
addInput.addEventListener("input", () => {
  btn.disabled = addInput.value.trim() === "";
});

//Add event listener
btn.addEventListener("click", () => {
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

  const taskName = addInput.value.trim();

  if (taskName === "") return;
  const id = globalCounter++;

  const task = {
    id,
    task: taskName,
    completed: false,
  };

  tasks.push(task);
  listItem.id = `task-${id}`;
  taskText.textContent = taskName;
  listItem.append(taskText);

  //Toggle between complete and incomplete
  completeBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    taskText.style.textDecoration = task.completed ? "line-through" : "none";

    completeBtn.textContent = task.completed
      ? "Undo Completed"
      : "Mark Completed";
  });

  // Delete Task
  deleteBtn.addEventListener("click", () => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    listItem.remove();
    console.log(tasks);
  });

  editBtn.addEventListener("click", () => {
    const updateText = prompt(`${task.task}`);
    if (updateText === null) return;
    const trimmed = updateText.trim()
    if (trimmed === "") return;
    task.task = trimmed;
    taskText.textContent = trimmed;
  });

  listItem.append(completeBtn, editBtn, deleteBtn);
  listContainer.append(listItem);
  addInput.value = "";
  btn.disabled = true;

  console.log(tasks);
});
