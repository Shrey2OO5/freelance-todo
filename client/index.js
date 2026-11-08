import express from "express";
import path from "path";
const client = express();
const PORT = 3000;

client.use(express.static(path.join(__dirname, "public")));

client.listen(PORT, () => {
    console.log(`Client is running on http://localhost${PORT}`)
});