import { beforeEach, test, expect } from "vitest";
import { addTask, getTasks, toggleCompletion, deleteTaskById, updateTaskById, deleteTasks } from "./services.js";

beforeEach(() => {
  localStorage.clear();
});

test("adding a task trims its title and saves it as incomplete", () => {
    addTask(" Buy Milk ");
    const tasks = getTasks() 
    expect(tasks.length).toBe(1)
    expect(tasks[0].taskTitle).toBe("Buy Milk");
    expect(tasks[0].isComplete).toBe(false);
});

test("adding a title containing only spaces saves zero tasks", () => {
    addTask(" ");
    const tasks = getTasks()
    expect(tasks.length).toBe(0)
    //This needed separate test because the first tests the successful save meaning, tasks.length will be 1.
    //But in this, tasks.length must be 0 for zero saved tasks, thus separate test makes sense.
})

test("toggling a new task marks it complete", () => {
    addTask("Buy milk");
    const tasks = getTasks();
    toggleCompletion(tasks[0].id);
    const updatedTasks = getTasks();
    expect(updatedTasks[0].isComplete).toBe(true);
})

test("deleting the second task preserves the first", () => {
    addTask("Buy milk");
    addTask("Upload docs")
    const tasks = getTasks();
    deleteTaskById(tasks[1].id);
    const remainingTasks = getTasks();
    expect(remainingTasks.length).toBe(1);
    expect(remainingTasks[0].id).toBe(tasks[0].id)
})

test("deleting a task with wrong id does not remove task", () => {
    addTask("Buy milk");
    const tasks = getTasks();
    deleteTaskById(tasks[0].id + 1);
    const deletedTasks = getTasks();
    expect(deletedTasks.length).toBe(1);
})

test("task can be updated by providing new correct title and correct task id", () => {
    addTask("Buy milk");
    const tasks = getTasks();
    updateTaskById(tasks[0].id, "Buy fruits");
    const updatedTasks = getTasks();
    expect(updatedTasks[0].taskTitle).toBe("Buy fruits");
})

test("providing wrong task id for updation doesn't update the task", () => {
    addTask("Buy milk");
    const tasks = getTasks();
    updateTaskById(tasks[0].id+1, "Buy fruits");
    const updatedTask = getTasks();
    expect(updatedTask[0].taskTitle).toBe("Buy milk");
})

test("providing empty input for title updation does not update the task", () => {
    addTask("Buy milk");
    const tasks = getTasks();
    updateTaskById(tasks[0].id, " ");
    const updatedTask = getTasks();
    expect(updatedTask[0].taskTitle).toBe("Buy milk");
})