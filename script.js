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
  listItem.textContent=`${addInput.value}`
  listContainer.appendChild(listItem)
  addInput.value = "";
  btn.disabled = true;
});
