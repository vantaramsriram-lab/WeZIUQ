import express from "express"
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { startQuiz, saveAnswer, submitQuiz } from "../controllers/quiz.controllers.js";
const router = express.Router();
router.get("/start", authenticateUser, startQuiz)
router.put("/attempt/:attemptId/answer", authenticateUser, saveAnswer)
router.post("/submit", authenticateUser, submitQuiz)
export default router