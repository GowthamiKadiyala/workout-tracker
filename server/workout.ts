import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// 1. LOG A WORKOUT
router.post("/", async (req: Request, res: Response) => {
  const { userId, name, exercises } = req.body;

  try {
    const workout = await prisma.workout.create({
      data: {
        userId,
        name,
        exercises: {
          create: exercises,
        },
      },
      include: { exercises: true },
    });
    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log workout" });
  }
});

// 2. GET HISTORY
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { date: "desc" },
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// 3. GET STATS (Volume per workout)
router.get("/stats/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Get last 7 workouts
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { date: "asc" }, // Oldest first for the graph
      take: 7,
    });

    // Calculate Volume (Sets * Reps * Weight) for each workout
    const stats = workouts.map((w: any) => {
      const totalVolume = w.exercises.reduce((sum: number, ex: any) => {
        return sum + ex.sets * ex.reps * ex.weight;
      }, 0);

      return {
        date: new Date(w.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        volume: totalVolume,
      };
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
