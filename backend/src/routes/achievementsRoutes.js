import express from "express";
import { auth } from "../middleware/auth.js";
import { getAchievements } from "../controllers/achievementsController.js";


const router = express.Router();

router.get("/", auth, getAchievements);

export default router;