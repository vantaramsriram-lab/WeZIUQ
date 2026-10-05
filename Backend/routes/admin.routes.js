import express from "express"
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { authoriseQuizAdmin, authoriseClubAdmin } from "../middlewares/admin.middlewares.js";
import { getResults, getStatistics, getUsers, getMembers, createQuiz, getQuizzes } from "../controllers/admin.controllers.js";
import { getQuestions } from "../controllers/questions.contollers.js";
const router = express.Router();
router.get("/",authenticateUser, authoriseClubAdmin, getQuizzes);
router.post("/quiz/create", authenticateUser, authoriseClubAdmin, createQuiz)
router.get("/getMembers", authenticateUser, authoriseClubAdmin, getMembers);
router.get("/:quizId/statistics",authenticateUser, authoriseQuizAdmin, getStatistics);
router.get("/:quizId/questions",authenticateUser, authoriseQuizAdmin, getQuestions)
router.get("/:quizId/users",authenticateUser, authoriseQuizAdmin, getUsers);
router.get("/:quizId/results",authenticateUser, authoriseQuizAdmin, getResults)
export default router;