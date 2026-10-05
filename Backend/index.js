import express from "express"
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import questionRouter from "./routes/questions.routes.js"
import quizAttemptRouter from "./routes/quizAttempt.routes.js"
import adminRouter from "./routes/admin.routes.js"
import userRouter from "./routes/user.routes.js"
const app = express();
app.use(cors({
  // origin: "https://we-ziuq.vercel.app",
  // credentials: true
}))
configDotenv()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
connectDB()
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/questions", questionRouter)
app.use("/api/attempt", quizAttemptRouter);
app.use("/api/admin", adminRouter)
//HealthCheck
app.get("/api/health", (req, res) => {
  res.send("Health Check ! Server is Running")
})
const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})