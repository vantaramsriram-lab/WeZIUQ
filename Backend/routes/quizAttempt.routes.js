import express from "express"
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { startQuiz, saveAnswer, submitQuiz } from "../controllers/quizAttempt.controllers.js";
const router = express.Router();
router.post("/start/:quizId", authenticateUser, startQuiz)
router.put("/:attemptId/answer", authenticateUser, saveAnswer)
router.post("/:attemptId/submit", authenticateUser, submitQuiz)
export default router