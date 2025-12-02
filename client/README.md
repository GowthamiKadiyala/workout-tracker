FitTrack - Full Stack Fitness Tracker

FitTrack is a cross-platform mobile application for tracking workouts, visualizing progress, and scheduling future training sessions. Built with a focus on scalable architecture using the PERN stack (Postgres, Express, React Native, Node).

🚀 Features

Authentication: Secure JWT-based login and signup.

Workout Logging: Detailed logging of sets, reps, and weight.

Data Visualization: Interactive charts showing volume progress over time.

Scheduling: Plan future workouts with an "Up Next" dashboard view.

Cross-Platform: Runs on iOS, Android, and Web.

🛠 Tech Stack

Frontend: React Native (Expo), TypeScript, Victory Charts.

Backend: Node.js, Express, TypeScript.

Database: PostgreSQL (via Docker), Prisma ORM.

DevOps: Docker Compose for local database orchestration.

📸 Screenshots

(Add screenshots of your Dashboard and Login screen here)

🏃‍♂️ How to Run Locally

1. Start the Database

cd server
docker-compose up -d

2. Start the Backend

cd server
npx prisma migrate dev
npx ts-node index.ts

3. Start the Frontend

cd client
npx expo start

# Press 'w' for Web View, or scan QR code for Mobile

📂 Project Structure

client/app: React Native screens and logic.

server/prisma: Database schema and migrations.

server/: API routes (Auth, Workouts, Schedule).

🔮 Future Improvements

Add "Edit/Delete" functionality for workouts.

Integrate Apple HealthKit for step tracking.

Add Social Sharing features.
