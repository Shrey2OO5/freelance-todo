import addTask from "./utilities.js";
const addInput = document.querySelector("#add");
const btn = document.querySelector("#btn");

const listContainer = document.createElement("ul");
listContainer.id = "list-container";
document.body.append(listContainer);

const tasks = [];

// Input Event listener
addInput.addEventListener("input", () => {
  btn.disabled = addInput.value.trim() === "";
});

//Add button event listener
btn.addEventListener("click", () => {
  addTask(tasks, listContainer, addInput, btn);
});
