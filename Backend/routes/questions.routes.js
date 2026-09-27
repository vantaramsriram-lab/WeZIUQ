import express from "express"
import { authoriseAdmin } from "../middlewares/admin.middlewares.js"
import { authenticateUser } from "../middlewares/auth.middlewares.js"
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from "../controllers/questions.contollers.js"
const router = express.Router()
router.get("/", authenticateUser, authoriseAdmin, getQuestions)
router.post("/", authenticateUser, authoriseAdmin, addQuestion)
router.put("/:id", authenticateUser, authoriseAdmin, updateQuestion)
router.delete("/:id", authenticateUser, authoriseAdmin, deleteQuestion)
export default router;