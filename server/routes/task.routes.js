import {
  INVALID_INPUT,
  TASK_NOT_FOUND,
  TITLE_TOO_LONG,
  TITLE_TOO_SHORT,
} from "../../shared/errorCodes.js";
import taskService from "../injector.js";

export const createTask = async (req, res) => {
  try {
    const { task_title } = req.body;
    if (task_title === null || typeof task_title !== "string") {
      const error = new Error("Valid task title must be provided!");
      error.code = INVALID_INPUT;
      throw error;
    }
    const trimmedTitle = task_title.trim();
    if (trimmedTitle === "") {
      const error = new Error("Valid task title must be provided!");
      error.code = INVALID_INPUT;
      throw error;
    }
    const task = await taskService.createTask({ task_title: trimmedTitle });
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    if (err.code === INVALID_INPUT) {
      return res.status(400).json({
        message: err.message,
        errorCode: INVALID_INPUT,
      });
    }

    if (err.code === TITLE_TOO_LONG) {
      return res.status(400).json({
        message: err.message,
        errorCode: TITLE_TOO_LONG,
      });
    }

    if (err.code === TITLE_TOO_SHORT) {
      return res.status(400).json({
        message: err.message,
        errorCode: err.code,
      });
    }
    throw err;
  }
};

export const getTasks = async (_req, res) => {
  const tasks = await taskService.getAllTasks();
  res.status(200).json({
    message: "Got tasks",
    tasks,
  });
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task_title = req.body.task_title;
    const task = await taskService.updateTask(id, { task_title });
    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    if (error.code === INVALID_INPUT) {
      return res.status(400).json({
        message: error.message,
        errorCode: INVALID_INPUT,
      });
    }
    if (error.code === TASK_NOT_FOUND) {
      return res.status(404).json({
        message: error.message,
        errorCode: TASK_NOT_FOUND,
      });
    }
    if (error.code === TITLE_TOO_LONG) {
      return res.status(400).json({
        message: error.message,
        errorCode: TITLE_TOO_LONG,
      });
    }
    if (error.code === TITLE_TOO_SHORT) {
      return res.status(400).json({
        message: error.message,
        errorCode: TITLE_TOO_SHORT,
      });
    }
    throw error;
  }
};

export const toggleCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.toggleCompletion(id);
    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    if (error.code === INVALID_INPUT) {
      return res.status(400).json({
        message: error.message,
        errorCode: INVALID_INPUT,
      });
    }
    if (error.code === TASK_NOT_FOUND) {
      return res.status(404).json({
        message: error.message,
        errorCode: TASK_NOT_FOUND,
      });
    }
    throw error;
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTaskById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Task not found",
        errorCode: TASK_NOT_FOUND
      });
    }
    return res.status(200).json({
      message: "Task deleted successfully",
      tasksDeleted: result.rowCount,
    });
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(400).json({
        message: "Invalid task ID format",
        errorCode: INVALID_INPUT
      });
    }
    throw error;
  }
};
