import express from "express";
import { getStats , createStat, updateStat, deleteStat } from "../controllers/statController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

router.get("/", auth, getStats);
router.post("/", auth, createStat);
router.put("/:id", auth, updateStat);
router.delete("/:id", auth, deleteStat);

export default router;