import express from "express"
import { authoriseQuizAdmin } from "../middlewares/admin.middlewares.js"
import { authenticateUser } from "../middlewares/auth.middlewares.js"
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from "../controllers/questions.contollers.js"
const router = express.Router()
router.get("/:quizId", authenticateUser, authoriseQuizAdmin, getQuestions)
router.post("/:quizId", authenticateUser, authoriseQuizAdmin, addQuestion)
router.put("/:quizId/:questionId", authenticateUser, authoriseQuizAdmin, updateQuestion)
router.delete("/:quizId/:questionId", authenticateUser, authoriseQuizAdmin, deleteQuestion)
export default router;