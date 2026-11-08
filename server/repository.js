import {
  INVALID_INPUT,
  TASK_NOT_FOUND,
  TITLE_TOO_LONG,
  TITLE_TOO_SHORT,
} from "../shared/errorCodes.js";
export default class TaskRepository {
  constructor(pool) {
    this.dbPool = pool;
  }

  getTasks = async () => {
    const { rows } = await this.dbPool.query(
      "SELECT id, task_title, is_complete FROM tasks ORDER BY id",
    );
    return rows;
  };

  updateTask = async (id, payload) => {
    try {
      if (!payload.task_title || typeof payload.task_title !== "string") {
        const error = new Error("Please provide valid title!");
        error.code = INVALID_INPUT;
        throw error;
      }
      if (payload.task_title.trim() === "") {
        const error = new Error(
          "Taks title should contain at least one character!",
        );
        error.code = TITLE_TOO_SHORT;
        throw error;
      }
      const task_title = payload.task_title?.trim() ?? null;
      if (task_title !== null && task_title.length > 250) {
        const error = new Error(
          "Task title should contain at most 250 characters!",
        );
        error.code = TITLE_TOO_LONG;
        throw error;
      }
      const query = `
            UPDATE tasks
            SET task_title = COALESCE($1, task_title)
            WHERE id = $2
            RETURNING *;
        `;
      const result = await this.dbPool.query(query, [task_title, id]);
      if (result.rowCount === 0) {
        const error = new Error("Task does not exist");
        error.code = TASK_NOT_FOUND;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      if (error.code === "22P02") {
        const dbError = new Error("Invalid ID format or malformed input data.");
        dbError.code = INVALID_INPUT;
        throw dbError;
      }
      throw error;
    }
  };

  toggleIsComplete = async (id) => {
    try {
      const query = `
            UPDATE tasks
            SET is_complete = NOT is_complete 
            WHERE id = $1
            RETURNING *;
        `;
      const result = await this.dbPool.query(query, [id]);
      if (result.rowCount === 0) {
        const error = new Error("Task does not exist");
        error.code = TASK_NOT_FOUND;
        throw error;
      }
      return result.rows[0]; //Return updated task only.
    } catch (error) {
      if (error.code === "22P02") {
        const dbError = new Error("Invalid ID format or malformed input data.");
        dbError.code = INVALID_INPUT;
        throw dbError;
      }
      throw error;
    }
  };
}
