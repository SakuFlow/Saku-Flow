import express from "express";
import { getStats , updateStat, deleteStat } from "../controllers/statController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", auth, getStats);
router.post("/", auth, updateStat);
router.delete("/", auth, deleteStat);

export default router;