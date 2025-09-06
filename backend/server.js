import express from "express";
import cors from "cors";
import dotenv, { configDotenv } from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT | 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello " });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
