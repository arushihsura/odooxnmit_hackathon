import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // use || not |

// Middlewares
app.use(cors());
app.use(express.json());

// Example hello route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello " });
});

// 👉 Register route
app.post("/api/user/register", (req, res) => {
  const { name, email, password } = req.body;
  // TODO: Save user to DB here
  res.json({ message: "User registered successfully!", user: { name, email } });
});

// 👉 Send OTP route
app.post("/api/user/sendotp", (req, res) => {
  const { email } = req.body;
  // TODO: Generate & send OTP
  res.json({ message: `OTP sent to ${email}` });
});

// 👉 Login/verify route
app.post("/api/user/login", (req, res) => {
  const { email, otp } = req.body;
  // TODO: Verify user
  res.json({ message: "User logged in successfully", email });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
