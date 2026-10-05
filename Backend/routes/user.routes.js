import express from "express"
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { joinClub, getmyClubs, getClubQuizzes } from "../controllers/user.controllers.js";
const router = express.Router();
router.get("/myclubs", authenticateUser, getmyClubs);
router.post("/clubs/join", authenticateUser, joinClub);
router.get("/clubs/:clubId/quizzes", authenticateUser, getClubQuizzes);
export default router