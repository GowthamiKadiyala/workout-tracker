import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// 1. CREATE SCHEDULE
router.post("/", async (req: Request, res: Response) => {
  const { userId, title, date } = req.body;

  try {
    const schedule = await prisma.schedule.create({
      data: {
        userId,
        title,
        date: new Date(date), // Convert string "2025-12-01" to Date object
      },
    });
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to schedule workout" });
  }
});

// 2. GET UPCOMING (Only future dates)
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const upcoming = await prisma.schedule.findMany({
      where: {
        userId,
        date: {
          gte: new Date(), // "Greater Than or Equal" to NOW
        },
      },
      orderBy: { date: "asc" }, // Soonest first
    });
    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

export default router;
