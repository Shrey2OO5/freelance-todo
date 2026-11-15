export default function downloadTasks(tasks) {
  const json = JSON.stringify(tasks, null, 2);
  const file = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = "todo-tasks.json";
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}