import { pool } from "./db.js";
import taskRepository from "./repository.js";
import TaskService from "./services.js";

const taskRepo = new taskRepository(pool);
const taskService = new TaskService(taskRepo);

export default taskService;