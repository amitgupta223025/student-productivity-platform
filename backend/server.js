
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL];

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);


// Body parser
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Student Productivity Platform API is running");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from the backend!",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});