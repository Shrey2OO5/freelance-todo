export default class TaskServices {
  constructor(
    repo
  ) {
    this.taskRepo = repo;
  }

  createTask = (payload) => {
    return this.taskRepo.createTask(payload);
  }

  getAllTasks = () => {
    return this.taskRepo.getTasks();
  }

  updateTask = (id, payload) => {
    return this.taskRepo.updateTask(id, payload);
  }

  toggleCompletion = (id) => {
    return this.taskRepo.toggleIsComplete(id);
  }
  
  deleteTaskById = (id) => {
    return this.taskRepo.deleteTaskById(id);
  }
}