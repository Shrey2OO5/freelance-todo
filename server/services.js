export default class TaskServices {
  constructor(
    repo
  ) {
    this.taskRepo = repo;
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
}