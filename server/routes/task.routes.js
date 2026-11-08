import { INVALID_INPUT, TASK_NOT_FOUND, TITLE_TOO_LONG, TITLE_TOO_SHORT } from "../../shared/errorCodes.js";
import taskService from "../injector.js";

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
        errorCode: INVALID_INPUT
      });
    }
    if (error.code === TASK_NOT_FOUND) {
      return res.status(404).json({
        message: error.message,
        errorCode: TASK_NOT_FOUND
      });
    }
    if(error.code === TITLE_TOO_LONG) {
      return res.status(400).json({
        message: error.message,
        errorCode: TITLE_TOO_LONG
      })
    }
    if(error.code === TITLE_TOO_SHORT) {
      return res.status(400).json({
        message: error.message,
        errorCode: TITLE_TOO_SHORT
      })
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
        errorCode: INVALID_INPUT
      });
    }
    if (error.code === TASK_NOT_FOUND) {
      return res.status(404).json({
        message: error.message,
        errorCode: TASK_NOT_FOUND
      });
    }
    throw error;
  }
};
