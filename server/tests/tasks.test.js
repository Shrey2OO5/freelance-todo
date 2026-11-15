import { beforeEach, test, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";
import { INVALID_INPUT, TASK_NOT_FOUND } from "../../shared/errorCodes.js";

beforeEach(async () => {
  const { rows } = await pool.query(
    "SELECT current_database() AS database_name",
  );

  expect(rows[0].database_name).toBe("test_db");

  await pool.query("DELETE FROM tasks");
});

test("GET / responds with the server message", async () => {
  const response = await request(app).get("/");

  expect(response.status).toBe(200);
  expect(response.text).toBe("Server is up and running...");
});

test("POST /tasks creates the task and responds with that task", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ task_title: "  Buy milk  " });
  expect(response.status).toBe(201);
  expect(response.body.task.task_title).toBe("Buy milk");
  expect(response.body.task.is_complete).toBe(false);
  expect(response.body.task.id).toEqual(expect.any(Number));
  const { rows } = await pool.query("SELECT * FROM tasks");

  expect(rows).toHaveLength(1);
  expect(rows[0].task_title).toBe("Buy milk");
  expect(rows[0].is_complete).toBe(false);
  expect(rows[0].id).toBe(response.body.task.id);
});

test("A blank title rejects creation and does not save anything in database", async () => {
  const response = await request(app).post("/tasks").send({ task_title: " " });
  expect(response.status).toBe(400);
  expect(response.body.errorCode).toBe(INVALID_INPUT);
  const { rows } = await pool.query(`SELECT * FROM tasks`);
  expect(rows).toHaveLength(0);
});

test("Updating title does not affect completion status", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ task_title: "  Buy milk  " });
  const { task } = response.body;
  const completion = await request(app).patch(`/tasks/${task.id}/completion`);
  const updateResponse = await request(app)
    .patch(`/tasks/${task.id}`)
    .send({ task_title: "Pickup gf" });
  const { rows } = await pool.query(`SELECT * FROM tasks WHERE id=$1`, [
    task.id,
  ]);
  expect(completion.body.task.is_complete).toBe(true);
  expect(completion.status).toBe(200);
  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.task.task_title).toBe("Pickup gf");
  expect(updateResponse.body.task.is_complete).toBe(true);
  expect(rows[0].task_title).toBe("Pickup gf");
  expect(rows[0].is_complete).toBe(true);
  expect(updateResponse.body.task.id).toBe(task.id);
});

test("Updating with wrong title rejects the operation", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ task_title: "  Buy milk  " });
  const { task } = response.body;
  const updateResponse = await request(app)
    .patch(`/tasks/${task.id}`)
    .send({ task_title: " " });
  const { rows } = await pool.query(`SELECT * FROM tasks WHERE id=$1`, [
    task.id,
  ]);
  expect(updateResponse.status).toBe(400);
  expect(rows[0].task_title).toBe("Buy milk");
});

test("Updating with wrong task id rejects the operation", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ task_title: "  Buy milk  " });
  const { task } = response.body;
  const updateResponse = await request(app)
    .patch(`/tasks/abc`)
    .send({ task_title: "Go on a date" });
  const { rows } = await pool.query(`SELECT * FROM tasks WHERE id=$1`, [
    task.id,
  ]);
  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.errorCode).toBe(INVALID_INPUT);
  expect(rows[0].task_title).toBe("Buy milk");
});

test("Updating non existing task rejects the operation", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ task_title: "  Buy milk  " });
  const { task } = response.body;
  const updateResponse = await request(app)
    .patch(`/tasks/${task.id+1}`)
    .send({ task_title: "Go on a date" });
      const { rows } = await pool.query(`SELECT * FROM tasks WHERE id=$1`, [
    task.id,
  ]);
    expect(updateResponse.status).toBe(404);
  expect(updateResponse.body.errorCode).toBe(TASK_NOT_FOUND);
  expect(rows[0].task_title).toBe("Buy milk");
});

test("Deleting one task does not delete the other ones", async () => {
  const firstTask = await request(app)
    .post("/tasks")
    .send({ task_title: "  Buy milk  " });
  const secondTask = await request(app)
    .post("/tasks")
    .send({ task_title: " Drop gf to startbucks" });
  expect(firstTask.status).toBe(201);
  expect(secondTask.status).toBe(201);
  const task_1 = firstTask.body.task;
  const task_2 = secondTask.body.task;
  const response = await request(app).delete(`/tasks/${task_2.id}`);
  expect(response.status).toBe(200);
  expect(response.body.tasksDeleted).toEqual(1);
  const remainingTasks = await request(app).get("/tasks");
  expect(remainingTasks.status).toBe(200);
  expect(remainingTasks.body.tasks[0].id).toBe(task_1.id);
  expect(remainingTasks.body.tasks).toHaveLength(1)
});
