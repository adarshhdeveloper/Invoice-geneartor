import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});


export default app;