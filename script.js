import downloadTasks from "./utility.js"
import {getTasks} from "./services.js"
import { displayAddTask, renderTasks } from "./ui.js";
const mainContainer = document.getElementById("container");
const exportBtn = document.createElement("button");
exportBtn.id = "export-btn";
exportBtn.textContent = "Export"
exportBtn.addEventListener("click", () => downloadTasks(getTasks()));
mainContainer.append(exportBtn)
displayAddTask();
renderTasks();
