import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./auth";
import workoutRoutes from "./workout";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/workouts", workoutRoutes);
app.use("/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// DB Check Route
app.get("/db-check", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "Database connected successfully" });
  } catch (error) {
    res.status(500).json({ status: "Database connection failed", error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
