import express from "express"
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { authoriseAdmin } from "../middlewares/admin.middlewares.js";
import { getResults, getStatistics, getUsers } from "../controllers/admin.controllers.js";
const router = express.Router();
router.use(authenticateUser, authoriseAdmin);
router.get("/statistics", getStatistics);
router.get("/users", getUsers);
router.get("/results", getResults)
export default router;