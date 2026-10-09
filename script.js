const addInput = document.querySelector("#add");
const btn = document.querySelector("#btn");

const listContainer = document.createElement("ul");
listContainer.setAttribute("id", "list-container");
document.body.append(listContainer);

addInput.addEventListener("input", () => {
  btn.disabled = addInput.value.trim() === "";
});
btn.addEventListener("click", () => {
  const listItem = document.createElement("li");
  const taskText = document.createElement("span");
  taskText.textContent = addInput.value.trim();
  listItem.append(taskText);
  listContainer.appendChild(listItem);
  addInput.value = "";
  btn.disabled = true;
  const deleteBtn = document.createElement("button");
  deleteBtn.style.cssText =
    "color: white; margin-left: 12px; background-color:red; border-radius: 12px; padding: 12px;";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    listItem.remove();
  });

  let toggle = false;
  const completeBtn = document.createElement("button");
  completeBtn.style.cssText =
    "color: white; margin-left: 12px; background-color:green; border-radius: 12px; padding: 12px;";
  completeBtn.textContent = "Mark Completed";
  completeBtn.addEventListener("click", () => {
    if (!toggle) {
      taskText.style.textDecoration = "line-through";
      completeBtn.textContent = "Undo Completed";
      toggle = true;
    } else {
      toggle = false; 
      taskText.style.textDecoration = "none";
      completeBtn.textContent = "Mark Completed";
    }
  });

  listItem.append(completeBtn);
  listItem.append(deleteBtn);
});
