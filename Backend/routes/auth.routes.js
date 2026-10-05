import express from "express"
import { login, register, getMe, registerClub } from "../controllers/auth.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
const router = express.Router();
router.post("/login", login)
router.post("/register", register)
router.post("/registerClub", registerClub);
router.get("/me", authenticateUser, getMe)
export default router