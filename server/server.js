import express from "express";
import {
  getTasks,
  toggleCompletion,
  updateTask,
} from "./routes/task.routes.js";
import { corsOptions } from "./cors.config.js";
import cors from "cors";
const app = express();
const PORT = 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (_req, res) => {
  res.send("Server is up and running...");
});

app.get("/tasks", getTasks);
app.patch("/tasks/:id", updateTask);
app.patch("/tasks/:id/completion", toggleCompletion);

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
    errorCode: "INTERNAL_ERROR",
  });
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
